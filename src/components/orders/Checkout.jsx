import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, createOrder, confirmPayment } from '../../api.js';
import StripeCheckoutPayment from '../payment/StripeCheckoutPayment.jsx';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'India'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/orders');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const fetchCart = async () => {
    try {
      console.log('📦 Fetching cart...');
      const data = await getCart();
      console.log('📥 Cart data received:', data);
      
      if (data.success) {
        // Filter out invalid cart items
        const validItems = data.data.items.filter(item => {
          const hasProductId = item.productId && (item.productId._id || item.productId);
          const hasQuantity = item.quantity > 0;
          const hasPrice = item.price != null && item.price > 0;
          
          if (!hasProductId || !hasQuantity || !hasPrice) {
            console.warn('⚠️ Skipping invalid cart item:', { item, hasProductId, hasQuantity, hasPrice });
          }
          return hasProductId && hasQuantity && hasPrice;
        });

        console.log(`✅ Cart has ${validItems.length}/${data.data.items.length} valid items`);

        const validCart = {
          ...data.data,
          items: validItems,
          totalAmount: validItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
        setCart(validCart);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (err) {
      console.error('❌ Error fetching cart:', err);
      setError('Network error. Please try again.');
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3003/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from server: ${response.status} - ${errorText}`);
        setError('Failed to fetch user data. Please login again.');
        return;
      }

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Expected JSON but received:', text);
        setError('Unexpected response from server while fetching user data.');
        return;
      }

      if (data.success) {
        setShippingAddress(prev => ({
          ...prev,
          fullName: (data.user?.fullName || data.user?.name || data.data?.fullName || data.data?.name) || '',
          phone: data.user?.phone || data.data?.phone || '',
          addressLine1: data.user?.location || data.data?.location || '',
          city: data.user?.city || data.data?.city || '',
          postalCode: data.user?.postalCode || data.data?.postalCode || '',
          country: data.user?.country || data.data?.country || 'India'
        }));
      } else {
        setError(data.message || 'Failed to fetch user data');
      }

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error fetching user data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value
    });
  };

  const validateForm = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'postalCode'];
    const missing = required.filter(field => !shippingAddress[field]);
    
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }

    if (shippingAddress.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setLoading(true);
    setError('');

    try {
      // Create order with payment details
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country
        },
        totalAmount: cart.totalAmount,
        paymentMethod: paymentDetails.paymentMethod,
        paymentDetails: paymentDetails
      };

      // Confirm payment and create order
      const data = await confirmPayment({
        paymentIntentId: paymentDetails.paymentIntentId,
        orderData: orderData
      });

      if (data.success) {
        setSuccessMessage('Payment successful! Order placed successfully.');
        // Clear cart after successful order
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setError(data.message || 'Failed to confirm payment');
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError(err.message || 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🛒 Submitting order form...');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Only allow COD submission, Stripe has its own flow
    if (paymentMethod !== 'cod') {
      setError('Please select Cash on Delivery or use the Stripe payment button below.');
      return;
    }

    console.log('📋 Form data:', shippingAddress);
    console.log('🛒 Cart data:', cart);
    
    setLoading(true);
    setError('');

    try {
      // Validate cart items have proper structure
      console.log('🔍 Validating cart items...');
      const validItems = cart.items.filter(item => {
        // Handle both populated object and raw ID
        const productId = item.productId?._id || item.productId;
        const hasId = productId !== null && productId !== undefined;
        const hasQty = item.quantity > 0;
        const hasPrice = item.price > 0;
        
        if (!hasId || !hasQty || !hasPrice) {
          console.warn('⚠️ Invalid cart item:', { 
            productId, 
            quantity: item.quantity, 
            price: item.price,
            hasId, hasQty, hasPrice 
          });
          return false;
        }
        return true;
      });

      if (validItems.length === 0) {
        throw new Error('No valid items in cart. Please refresh and try again.');
      }

      if (validItems.length !== cart.items.length) {
        console.warn(`⚠️ Filtered out ${cart.items.length - validItems.length} invalid items`);
      }

      // Prepare order data with all required fields
      const orderData = {
        items: validItems.map(item => {
          // Extract product ID - handle both populated and raw formats
          let productId = item.productId;
          if (typeof productId === 'object' && productId !== null) {
            productId = productId._id || productId;
          }
          
          return {
            productId: String(productId || ''), // Ensure it's a string ID
            quantity: item.quantity,
            price: item.price
          };
        }),
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          phone: shippingAddress.phone.trim(),
          addressLine1: shippingAddress.addressLine1.trim(),
          city: shippingAddress.city.trim(),
          postalCode: shippingAddress.postalCode.trim(),
          country: shippingAddress.country.trim()
        },
        totalAmount: cart.totalAmount,
        paymentMethod: 'cash_on_delivery'
      };

      console.log('📤 Sending order data:', JSON.stringify(orderData, null, 2));
      console.log('📤 Order items count:', orderData.items.length);
      console.log('📤 Order total:', orderData.totalAmount);
      
      const data = await createOrder(orderData);
      console.log('📥 Order response:', data);

      if (data.success) {
        // Show success message in-page and let the effect handle redirect
        setSuccessMessage('✅ Order placed successfully! Cash on delivery selected. Redirecting to orders...');
      } else {
        console.error('❌ Order creation failed:', data);
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('❌ Error creating order:', err);
      const errorMsg = err.message || 'Failed to place order. Please try again.';
      setError(errorMsg);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-5 font-sans">
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:transform hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      <h1 className="text-center text-gray-800 mb-8 text-4xl font-semibold">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-5 flex justify-between items-center">
          {error}
          <button onClick={() => setError('')} className="text-xl cursor-pointer text-red-800 bg-transparent border-none p-0 w-5 h-5 flex items-center justify-center">×</button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-5 flex justify-between items-center">
          {successMessage}
          <button onClick={() => setSuccessMessage('')} className="text-xl cursor-pointer text-green-800 bg-transparent border-none p-0 w-5 h-5 flex items-center justify-center">×</button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h3 className="text-gray-800 mb-5 text-xl font-semibold">Order Summary</h3>
          <div className="mb-5">
            {cart.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex-1">
                  <span className="block font-medium text-gray-800 mb-1">{item.productId?.name || 'Product'}</span>
                  <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                </div>
                <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 border-b border-gray-200 mb-3">
            <span className="font-semibold text-gray-800">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">₹{cart.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-green-600 font-medium">
            <span>Delivery:</span>
            <span>Free (3-5 days)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h3 className="text-gray-800 mb-5 text-xl font-semibold">Payment Method</h3>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={() => {
                setPaymentMethod('cod');
                setShowPaymentForm(false);
              }}
              className={`w-full p-4 border-2 rounded-lg transition-all ${
                paymentMethod === 'cod'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">💵</span>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Cash on Delivery</div>
                  <div className="text-sm text-gray-500">Pay when you receive your order</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('stripe');
                setShowPaymentForm(true);
              }}
              className={`w-full p-4 border-2 rounded-lg transition-all ${
                paymentMethod === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">💳</span>
                <div className="text-left">
                  <div className="font-medium text-gray-800">Credit/Debit Card & UPI</div>
                  <div className="text-sm text-gray-500">Instant payment with Stripe</div>
                </div>
              </div>
            </button>
          </div>

          {paymentMethod === 'cod' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800 mb-2">
                <span className="mr-2">✓</span>
                <span className="font-medium">Cash on Delivery Selected</span>
              </div>
              <p className="text-sm text-green-700">
                Pay when you receive your order. Delivery typically takes 3-5 days.
              </p>
            </div>
          )}

          {paymentMethod === 'stripe' && showPaymentForm && (
            <StripeCheckoutPayment
              amount={cart.totalAmount}
              items={cart.items}
              shippingAddress={shippingAddress}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <h3 className="text-gray-800 mb-5 text-xl font-semibold">Shipping Address</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label htmlFor="fullName" className="font-medium text-gray-800 mb-2 text-sm">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="font-medium text-gray-800 mb-2 text-sm">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="10-digit phone number"
                  pattern="[0-9]{10}"
                  className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="addressLine1" className="font-medium text-gray-800 mb-2 text-sm">Address Line 1 *</label>
                <input
                  id="addressLine1"
                  type="text"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address, apartment, suite, etc."
                  className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="city" className="font-medium text-gray-800 mb-2 text-sm">City *</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City name"
                  className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="postalCode" className="font-medium text-gray-800 mb-2 text-sm">Postal Code *</label>
                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="PIN code"
                  className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="country" className="font-medium text-gray-800 mb-2 text-sm">Country *</label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                  className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => navigate('/cart')}
                className="flex-1 p-3.5 bg-gray-600 text-white rounded-lg font-medium cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:transform hover:-translate-y-0.5"
              >
                Back to Cart
              </button>
              <button 
                type="submit" 
                disabled={loading || paymentMethod === 'stripe'}
                className="flex-2 p-3.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:from-green-700 hover:to-teal-700 hover:transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  `Place Order • ₹${cart.totalAmount.toLocaleString()}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
