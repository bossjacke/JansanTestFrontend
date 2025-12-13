import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, createCheckoutSession, createOrder } from '../../api.js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ amount, items, shippingAddress, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create payment
    try {
      const response = await createPayment({
        amount,
        items,
        subtotal: amount,
        tax: 0,
        shipping_fee: 0,
        delivery_address: shippingAddress
      });

      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout since we're using the simplified flow
      window.location.href = response.checkoutUrl;
      return;

      // Confirm payment with card details
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.fullName,
            address: {
              line1: shippingAddress.addressLine1,
              city: shippingAddress.city,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country
            }
          }
        }
      });

      if (paymentError) {
        setError(paymentError.message);
        onPaymentError(paymentError);
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        onPaymentSuccess({
          paymentIntentId: paymentIntent.id,
          paymentMethod: 'stripe_card',
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        });
      }

    } catch (err) {
      setError(err.message || 'Payment failed');
      onPaymentError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
          {error}
        </div>
      )}

      {succeeded && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg">
          Payment successful!
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || succeeded}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            Processing...
          </span>
        ) : (
          `Pay ₹${amount.toLocaleString()}`
        )}
      </button>
    </form>
  );
};

// Main Dual Payment System Component
const DualPaymentSystem = ({ amount, items, shippingAddress, onPaymentSuccess, onPaymentError }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await createCheckoutSession({
        items,
        shippingAddress,
        successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      });

      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;

    } catch (err) {
      setError(err.message || 'Failed to create checkout session');
      onPaymentError(err);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      console.log('💳 Payment successful, creating order...');
      // Create order after successful payment
      const orderData = {
        items: items,
        shippingAddress: shippingAddress,
        totalAmount: amount,
        paymentMethod: paymentDetails.paymentMethod || 'stripe_card',
        paymentDetails: paymentDetails
      };

      console.log('📤 Creating order with payment details:', orderData);
      const orderResponse = await createOrder(orderData);
      console.log('✅ Order created successfully:', orderResponse);
      
      // Pass both payment and order details to parent
      onPaymentSuccess({
        ...paymentDetails,
        order: orderResponse.data
      });
    } catch (error) {
      console.error('❌ Error creating order after payment:', error);
      const errorMsg = error.message || 'Failed to create order after payment';
      onPaymentError(new Error(errorMsg));
    }
  };

  const handlePaymentError = (error) => {
    onPaymentError(error);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-gray-800 mb-5 text-xl font-semibold">Payment Method</h3>
      
      {/* Payment Method Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            paymentMethod === 'card'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Credit/Debit Card
        </button>
        <button
          onClick={() => setPaymentMethod('checkout')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            paymentMethod === 'checkout'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Stripe Checkout
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Payment Method Content */}
      {paymentMethod === 'card' && (
        <div>
          <p className="text-gray-600 mb-4">
            Enter your card details securely. Your payment information is encrypted and never stored.
          </p>
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={amount}
              items={items}
              shippingAddress={shippingAddress}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </Elements>
        </div>
      )}

      {paymentMethod === 'checkout' && (
        <div>
          <p className="text-gray-600 mb-4">
            Choose from multiple payment methods including UPI, NetBanking, and wallets.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">💳</div>
                <div className="text-xs text-gray-600">Cards</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs text-gray-600">UPI</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">🏦</div>
                <div className="text-xs text-gray-600">NetBanking</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">👛</div>
                <div className="text-xs text-gray-600">Wallets</div>
              </div>
            </div>

            <button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Redirecting to payment...
                </span>
              ) : (
                `Continue to Payment • ₹${amount.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1">🔒</span>
            Secure Payment
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1">✓</span>
            PCI DSS Compliant
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1">🛡️</span>
            SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualPaymentSystem;
