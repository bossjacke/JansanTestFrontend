// src/pages/Cancel.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-pink-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
        <div className="text-red-500 text-6xl font-bold mb-4">
          ✕
        </div>

        <h2 className="text-3xl font-bold text-red-600 mt-4">
          Payment Cancelled
        </h2>

        <p className="text-gray-600 mt-2">
          Your payment was not completed. No worries — you can try again anytime.
        </p>

        <Link
          to="/cart"
          className="mt-6 inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
