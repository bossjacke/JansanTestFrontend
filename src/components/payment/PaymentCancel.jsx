import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. No charges were made to your account.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-blue-800 mb-2">
            <strong>What happened?</strong>
          </p>
          <p className="text-sm text-blue-700 mb-2">
            You cancelled the payment process before it was completed. This could be due to:
          </p>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Clicking the cancel button</li>
            <li>Closing the payment window</li>
            <li>Network connectivity issues</li>
            <li>Browser or device problems</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Review Cart
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If you believe this was an error or need assistance, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
