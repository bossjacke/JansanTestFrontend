import React from 'react';

const CartSummary = ({ totalAmount, onContinueShopping, onCheckout }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Total Amount:</span>
          <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Delivery:</span>
          <span>Free (3-5 days)</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-4">
          <button
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-all duration-200"
            onClick={onContinueShopping}
          >
            Continue Shopping
          </button>

          <button
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 focus:ring-4 focus:ring-purple-200"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
