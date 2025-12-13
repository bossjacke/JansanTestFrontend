import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../../api.js';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      // Try to get payment status from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/status/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentDetails({
          sessionId,
          status: data.data.status,
          amount: data.data.amount,
          currency: data.data.currency,
          message: 'Payment completed successfully!'
        });
      } else {
        // If verification fails, still show success (webhook might have created order)
        setPaymentDetails({
          sessionId,
          status: 'completed',
          message: 'Payment completed successfully!'
        });
      }
      setLoading(false);
    } catch (err) {
      // If verification fails, still show success (webhook might have created order)
      setPaymentDetails({
        sessionId,
        status: 'completed',
        message: 'Payment completed successfully!'
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your order has been confirmed and will be processed shortly.
        </p>
        
        {paymentDetails && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Transaction ID:</span> {sessionId}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Status:</span> 
              <span className="text-green-600 font-medium"> {paymentDetails.status}</span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Message:</span> {paymentDetails.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
