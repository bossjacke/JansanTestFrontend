import React, { useState } from 'react';

// This component replaces the previous Stripe Elements implementation.
// It handles the redirect to Stripe's hosted checkout page.
const StripeCheckoutPayment = ({ items }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
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

      const response = await fetch('http://localhost:5174/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Token அவசியம்!
        },
        body: JSON.stringify({ items: lineItems }),
      });
      // 

      if (!response.ok) {
        throw new Error('Failed to create checkout session.');
      }

      const data = await response.json();

      if (data.url) {
        // Redirect the user to the Stripe Checkout page
        window.location.href = data.url;
      } else {
        throw new Error('No checkout session URL returned.');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
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
