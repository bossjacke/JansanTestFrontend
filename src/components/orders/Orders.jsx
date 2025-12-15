import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocation } from 'react-router-dom';
import { getCart, getMyOrders, createOrder, cancelOrder } from '../../api.js';



function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', postalCode: '', country: 'sri lanka'
  });
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.fromCart && user) {
      fetchCartAndShowCheckout();
    } else {
      fetchOrders();
    }
  }, [user, location.state]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchCartAndShowCheckout = async () => {
    try {
      setLoading(true);
      const data = await getCart();

      if (data.data.items.length > 0) {
        setCart(data.data);
        setShowCheckout(true);
      } else {
        setShowCheckout(false);
        fetchOrders();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setShowCheckout(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.data.orders || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const createOrderHandler = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    try {
      setOrderProcessing(true);

      // Prepare order data with proper structure
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          fullName: user?.fullName || user?.name || '',
          phone: user?.phone || '',
          addressLine1: shippingAddress.street,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country
        },
        totalAmount: cart.totalAmount,
        paymentMethod: 'cash_on_delivery'
      };

      await createOrder(orderData);

      setSuccessMessage('Order placed successfully! Cash on delivery selected.');
      setShowCheckout(false);
      setCart(null);
      fetchOrders();

    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create order');
    } finally {
      setOrderProcessing(false);
    }
  };

  const cancelCheckout = () => {
    setShowCheckout(false);
    setCart(null);
    fetchOrders();
  };

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg shadow-gray-900/5">
        <h1 className="gradient-text">My Orders</h1>
        <div className="text-center py-10">Loading...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-[calc(100vh-64px)] p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg shadow-gray-900/5">
        <h1 className="gradient-text">My Orders</h1>
        <div className="text-center py-10">
          <div className="text-red-500 mb-5">{error}</div>
          <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200" onClick={fetchOrders}>Retry</button>
        </div>
      </div>
    </div>
  );

  const CheckoutForm = () => (
    <div>
      <h1 className="gradient-text">Checkout</h1>
      
      <div className="mb-8 p-5 bg-gray-50 rounded-lg">
        <h3 className="mb-4 font-bold">Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.productId?._id || item.productId} className="flex justify-between mb-3 p-3 bg-white rounded">
            <div>
              <div className="font-bold">{item.productId?.name || 'Product'}</div>
              <div className="text-sm text-gray-600">
                {item.productId?.type === 'biogas' ? '🔥 Biogas Unit' : '🌱 Fertilizer'}
              </div>
              <div className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</div>
            </div>
            <div className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-4 border-t-2 border-gray-200">
          <div className="text-lg font-bold">Total</div>
          <div className="text-2xl font-bold">₹{cart.totalAmount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 font-bold">Shipping Address</h3>
        <div className="grid gap-4">
          <input type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} 
            className="w-full p-3 border rounded-lg text-sm" placeholder="Street Address *" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} 
              className="w-full p-3 border rounded-lg text-sm" placeholder="City *" required />
            <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} 
              className="w-full p-3 border rounded-lg text-sm" placeholder="State" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="postalCode" value={shippingAddress.postalCode} onChange={handleAddressChange} 
              className="w-full p-3 border rounded-lg text-sm" placeholder="Postal Code *" required />
            <input type="text" name="country" value={shippingAddress.country} onChange={handleAddressChange} 
              className="w-full p-3 border rounded-lg text-sm" placeholder="Country" />
          </div>
        </div>
      </div>

      <div className="mb-8 p-5 bg-green-50 rounded-lg text-center">
        <div><strong>Payment Method:</strong> Cash on Delivery</div>
        <div className="text-sm text-gray-600 mt-2">Pay when you receive your order</div>
      </div>

      <div className="flex gap-4 justify-end">
        <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200" onClick={cancelCheckout} disabled={orderProcessing}>Cancel</button>
        <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50" onClick={createOrderHandler} disabled={orderProcessing}>
          {orderProcessing ? 'Processing...' : `Place Order • ₹${cart.totalAmount.toLocaleString('en-IN')}`}
        </button>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Processing':
          return 'bg-orange-500';
        case 'Delivered':
          return 'bg-blue-500';
        case 'Cancelled':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <div className="p-5 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-gray-600">Order #{order.orderNumber || order._id}</div>
            <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </div>
        </div>

        {/* Display all products in the order */}
        <div className="py-4 border-t border-b border-gray-100">
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <div key={index} className="flex justify-between items-center mb-3 last:mb-0">
                <div className="flex-1">
                  <div className="font-bold">{product.productId?.name || 'Product'}</div>
                  <div className="text-sm text-gray-600">
                    {product.productId?.type === 'biogas' ? '🔥 Biogas Unit' : '🌱 Fertilizer'}
                  </div>
                  <div className="text-xs text-gray-500">Qty: {product.quantity} × ₹{product.price}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{(product.price * product.quantity).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No products found</div>
          )}
        </div>

        <div className="flex justify-between mt-4 p-3 bg-gray-50 rounded-lg">
          <div><strong>Total Amount:</strong></div>
          <div className="font-bold text-lg">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</div>
        </div>

        {order.deliveryDate && (
          <div className="flex justify-between mt-2 p-3 bg-blue-50 rounded-lg">
            <div><strong>Delivery Date:</strong></div>
            <div className="font-bold">{formatDate(order.deliveryDate)}</div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button 
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs" 
            onClick={() => window.location.href = `/orders/${order._id}`}
          >
            View Details
          </button>
          {order.orderStatus === 'Delivered' && (
            <button 
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50 text-xs" 
              onClick={() => alert('Review feature coming soon!')}
            >
              Write Review
            </button>
          )}
          {order.orderStatus === 'Processing' && (
            <button 
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-red-100 hover:bg-red-200 text-red-700 text-xs" 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  // Handle cancel order
                  cancelOrder(order._id).then(() => {
                    alert('Order cancelled successfully');
                    fetchOrders();
                  }).catch(err => {
                    alert(err.message || 'Failed to cancel order');
                  });
                }
              }}
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg shadow-gray-900/5">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg mb-5 flex justify-between items-center">
            {successMessage}
            <button onClick={() => setSuccessMessage('')} className="text-xl cursor-pointer text-green-800 bg-transparent border-none p-0 w-5 h-5 flex items-center justify-center">×</button>
          </div>
        )}
        {showCheckout && cart ? <CheckoutForm /> : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="gradient-text">My Orders</h1>
              <div className="text-sm text-gray-600">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-5">📦</div>
                <h3 className="text-gray-600 mb-3">No orders yet</h3>
                <p className="text-gray-400 mb-5">Start shopping to see your orders here!</p>
                <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50" onClick={() => window.location.href = '/shop'}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {orders.map((order) => <OrderCard key={order._id} order={order} />)}
              </div>
            )}

            {orders.length > 0 && (
              <div className="mt-8 p-5 bg-gray-50 rounded-lg">
                <h3 className="mb-4 font-bold">Order Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: orders.length, color: 'text-gray-800' },
                    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'Processing').length, color: 'text-orange-500' },
                    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, color: 'text-blue-500' },
                    { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'Cancelled').length, color: 'text-red-500' }
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center p-4 bg-white rounded-lg">
                      <div className={`text-xl font-bold ${color}`}>{value}</div>
                      <div className="text-gray-600 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
