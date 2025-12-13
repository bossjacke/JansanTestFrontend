// src/components/StripeCheckoutButton.jsx
import React, { useState } from "react";
import API from "../api/axiosClient";

export default function StripeCheckoutButton({ amount }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/payments/create", { amount });
      // Redirect user to Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleCheckout}
      className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
    >
      {loading ? "Processing..." : `Pay $${amount}`}
    </button>
  );
}
