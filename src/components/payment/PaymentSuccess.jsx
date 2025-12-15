// src/components/payment/PaymentSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
        <div className="text-green-500 text-6xl font-bold mb-4">
          ✓
        </div>

        <h2 className="text-3xl font-bold text-purple-700 mt-4">
          Payment Successful!
        </h2>

        <p className="text-gray-600 mt-2">
          Thank you for your purchase! Your order has been successfully processed.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
