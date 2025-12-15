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
      setMessage("Payment system is still loading. Please wait a moment and try again.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Save order data to local storage before redirecting
      const orderData = { 
        items, 
        shippingAddress, 
        totalAmount: amount,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingOrderData', JSON.stringify(orderData));

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        let errorMessage = error.message;
        if (error.type === "card_error") {
          errorMessage = "Your card was declined. Please try a different payment method.";
        } else if (error.type === "validation_error") {
          errorMessage = "Please check your payment details and try again.";
        } else if (error.type === "rate_limit_error") {
          errorMessage = "Too many requests. Please wait a moment and try again.";
        }
        
        setMessage(errorMessage);
        onPaymentError(error);
        localStorage.removeItem('pendingOrderData');
      } else if (paymentIntent) {
        if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess({
            paymentIntentId: paymentIntent.id,
            paymentMethod: 'stripe_element',
          });
          localStorage.removeItem('pendingOrderData');
        } else if (paymentIntent.status === 'processing') {
          setMessage("Your payment is being processed. Please wait...");
        } else {
          setMessage(`Payment status: ${paymentIntent.status}. Please contact support if this persists.`);
        }
      } else {
        console.log("Payment redirect initiated");
      }
    } catch (err) {
      console.error("Payment submission error:", err);
      setMessage("An unexpected error occurred. Please try again.");
      onPaymentError(err);
      localStorage.removeItem('pendingOrderData');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all mt-4">
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay now • ₹${(amount).toLocaleString()}`
          )}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 mt-2">{message}</div>}
    </form>
  );
};

const StripeCheckoutPayment = ({ amount, items, shippingAddress, onPaymentSuccess, onPaymentError }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized. Please login to continue with payment.');
        }
        
        console.log('Creating payment intent for amount:', Math.round(amount * 100));
        
        const res = await createPaymentIntent({ amount: Math.round(amount * 100) });
        console.log('Payment intent response:', res);
        
        let clientSecret = null;
        
        if (res) {
          if (res.clientSecret) {
            clientSecret = res.clientSecret;
          } else if (res.data && res.data.clientSecret) {
            clientSecret = res.data.clientSecret;
          } else if (typeof res === 'string') {
            clientSecret = res;
          } else if (res.payment_intent && res.payment_intent.client_secret) {
            clientSecret = res.payment_intent.client_secret;
          } else if (res.intent && res.intent.client_secret) {
            clientSecret = res.intent.client_secret;
          }
        }
        
        if (clientSecret) {
          setClientSecret(clientSecret);
          console.log('Client secret received successfully');
        } else {
          console.error('No clientSecret found in response. Available keys:', res ? Object.keys(res) : 'No response object');
          setError('Payment initialization failed: No client secret received from server');
          onPaymentError(new Error('No client secret received from server'));
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        
        let errorMsg = err?.message || 'Error creating payment intent.';
        
        if (err.message && (err.message.includes('Unauthorized') || err.message.includes('401'))) {
          errorMsg = 'Please login to continue with payment. Redirecting to login...';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (err.response?.status === 400) {
          errorMsg = 'Invalid payment amount. Please try again.';
        } else if (err.response?.status === 500) {
          errorMsg = 'Server error. Please try again later.';
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
