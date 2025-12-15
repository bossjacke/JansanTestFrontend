import React, { useState } from 'react';
import { createCheckoutSession, createOrder } from '../../api.js';

// Stripe Checkout Payment Component
const StripeCheckoutPayment = ({ amount, items, shippingAddress, onPaymentSuccess, onPaymentError }) => {
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
        paymentMethod: paymentDetails.paymentMethod || 'stripe_checkout',
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
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stripe Checkout Payment */}
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

export default StripeCheckoutPayment;
