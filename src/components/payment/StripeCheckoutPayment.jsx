import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from '../../api.js';

const CheckoutForm = ({ amount, items, shippingAddress, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    // Save order data to local storage before redirecting
    localStorage.setItem('pendingOrderData', JSON.stringify({ items, shippingAddress, totalAmount: amount }));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      onPaymentError(error);
      // Clear local storage if payment fails immediately
      localStorage.removeItem('pendingOrderData');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess({
        paymentIntentId: paymentIntent.id,
        paymentMethod: 'stripe_element',
      });
      // No need to clear local storage here, as PaymentSuccess page will handle it
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all mt-4">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : `Pay now • ₹${(amount).toLocaleString()}`}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 mt-2">{message}</div>}
    </form>
  );
}

const StripeCheckoutPayment = ({ amount, items, shippingAddress, onPaymentSuccess, onPaymentError }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized. Please login to continue with payment.');
        }
        
        console.log('🔄 Creating payment intent for amount:', Math.round(amount * 100));
        console.log('🔑 Using token:', token.substring(0, 20) + '...');
        
        const res = await createPaymentIntent({ amount: Math.round(amount * 100) }); // Amount in cents
        console.log('📥 Payment intent response:', res);
        
        if (res && res.success) {
          const secret = res.clientSecret || (res.data && res.data.clientSecret);
          if (secret) {
            setClientSecret(secret);
            console.log('✅ Client secret received successfully');
          } else {
            console.error('❌ No clientSecret in response data:', res.data);
            setError('Payment initialization failed: No client secret received');
            onPaymentError(new Error('No client secret received from server'));
          }
        } else {
          console.error('❌ Payment intent creation failed:', res);
          const errorMsg = res?.message || 'Failed to create payment intent.';
          setError(errorMsg);
          onPaymentError(new Error(errorMsg));
        }
      } catch (err) {
        console.error('❌ Error creating payment intent:', err);
        let errorMsg = err?.message || 'Error creating payment intent.';
        
        // Check if it's an authentication error
        if (err.message && err.message.includes('Unauthorized')) {
          errorMsg = 'Please login to continue with payment. Redirecting to login...';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        
        setError(errorMsg);
        onPaymentError(new Error(errorMsg));
      }
    };

    if (amount > 0) {
      fetchPaymentIntent();
    }
  }, [amount, onPaymentError]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="StripeApp">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {clientSecret ? (
        <CheckoutForm
          amount={amount}
          items={items}
          shippingAddress={shippingAddress}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
      ) : (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <p className="ml-3">Initializing Payment...</p>
        </div>
      )}
    </div>
  );
};

export default StripeCheckoutPayment;
