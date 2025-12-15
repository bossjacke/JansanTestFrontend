
import React, { useState } from 'react';
import { createCheckoutSession } from '../../api.js';

// This component replaces the previous Stripe Elements implementation.
// It handles the redirect to Stripe's hosted checkout page.
const StripeCheckoutPayment = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to continue with payment.');
      }

      // Validate items
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error('Your cart is empty. Please add items before proceeding to payment.');
      }


      // The backend expects a specific format for cart items.
      // Based on Checkout.jsx, item.productId can be an object or a string.
      // We'll standardize it to send only the necessary data.
      const lineItems = items.map(item => {
        return {
          // Adjust this structure based on what the backend endpoint expects
          id: item.productId?._id || item.productId,
          name: item.productId?.name || 'Product',
          price: item.price,
          quantity: item.quantity,
        };
      });

      // Calculate total amount from line items
      const totalAmount = lineItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);

      // Prepare payment data for the backend
      const paymentData = {
        items: lineItems,
        amount: totalAmount
      };


      // Use the standard API function from api.js
      const response = await createCheckoutSession(paymentData);

      console.log('💳 Stripe checkout response:', response);

      // Check for different possible response formats
      if (response && response.url) {
        // Direct URL response
        window.location.href = response.url;
      } else if (response && response.sessionUrl) {
        // Alternative property name
        window.location.href = response.sessionUrl;
      } else if (response && response.checkoutUrl) {
        // Another alternative property name
        window.location.href = response.checkoutUrl;
      } else if (response && response.data && response.data.url) {
        // Nested response structure
        window.location.href = response.data.url;
      } else if (response && response.data && response.data.sessionUrl) {
        // Nested alternative structure
        window.location.href = response.data.sessionUrl;
      } else {
        console.error('❌ Unexpected response format:', response);
        throw new Error('No checkout session URL returned. Response: ' + JSON.stringify(response));
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      
      // Handle specific error cases
      if (err.message.includes('login')) {
        setError(err.message);
      } else if (err.message.includes('empty')) {
        setError(err.message);
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      
      setLoading(false);
    }
    // No need to set loading to false on success, as the page will redirect.
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all mt-4"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </button>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </div>
  );
};

export default StripeCheckoutPayment;
