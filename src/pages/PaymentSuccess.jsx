// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { confirmPayment } from "../api.js";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirmPayment = async () => {
      // Retrieve order data from local storage
      const pendingOrderDataStr = localStorage.getItem('pendingOrderData');
      
      if (!pendingOrderDataStr) {
        console.error("No pending order data found in local storage.");
        setStatus("error");
        setLoading(false);
        return;
      }

      let pendingOrderData;
      try {
        pendingOrderData = JSON.parse(pendingOrderDataStr);
      } catch (err) {
        console.error("Failed to parse pending order data:", err);
        setStatus("error");
        setLoading(false);
        localStorage.removeItem('pendingOrderData');
        return;
      }

      // Check if the data is stale (older than 30 minutes)
      const dataAge = Date.now() - (pendingOrderData.timestamp || 0);
      if (dataAge > 30 * 60 * 1000) { // 30 minutes
        console.warn("Pending order data is stale, ignoring...");
        setStatus("error");
        setLoading(false);
        localStorage.removeItem('pendingOrderData');
        return;
      }

      try {
        console.log('🔄 Confirming payment with intent:', paymentIntentId);
        console.log('📋 Order data:', pendingOrderData);

        // Prepare order data for backend
        const orderData = {
          items: pendingOrderData.items,
          shippingAddress: pendingOrderData.shippingAddress,
          totalAmount: pendingOrderData.totalAmount,
          paymentMethod: 'stripe',
          paymentDetails: {
            paymentIntentId: paymentIntentId,
            status: 'succeeded'
          }
        };

        // Here, you would typically send the paymentIntentId and the order data
        // to your backend to create the order and mark it as paid.
        const response = await confirmPayment({ 
          paymentIntentId,
          orderData
        });

        console.log('📥 Payment confirmation response:', response);

        if (response && response.success) {
          setStatus("success");
          // Clear the pending order data from local storage
          localStorage.removeItem('pendingOrderData');
          // Redirect to Orders page after 2 seconds
          setTimeout(() => navigate("/orders"), 2000);
        } else {
          console.error("Payment confirmation failed:", response);
          setStatus("failed");
          // Don't clear local storage on failure, allow retry
        }
      } catch (err) {
        console.error("Error confirming payment:", err);
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          setStatus("error");
          setError("Authentication error. Please login again.");
        } else if (err.response?.status === 400) {
          setStatus("error");
          setError("Invalid payment data. Please contact support.");
        } else if (err.response?.status === 409) {
          // Order already exists - this is actually success
          setStatus("success");
          localStorage.removeItem('pendingOrderData');
          setTimeout(() => navigate("/orders"), 2000);
        } else {
          setStatus("error");
          setError(err.message || "Failed to confirm payment");
        }
        
        // Don't clear local storage on error unless it's a success case
        if (status !== "success") {
          // Keep data for potential retry, but mark it as failed
          localStorage.setItem('pendingOrderData', JSON.stringify({
            ...pendingOrderData,
            failed: true,
            lastError: err.message
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    if (paymentIntentId) {
      handleConfirmPayment();
    } else {
      console.error("No payment_intent found in URL");
      setStatus("error");
      setLoading(false);
    }
  }, [paymentIntentId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-20 text-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
        <p className="mt-4">Verifying your payment and placing order...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-20 text-center">
      {status === "success" && (
        <>
          <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
          <p className="mt-2 text-lg text-gray-700">
            Thank you! Your order has been successfully processed.
          </p>

          <Link
            to="/orders"
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            View My Orders
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed</h1>
          <p className="mt-2 text-lg text-gray-600">Something went wrong while processing your order after payment.</p>

          <Link
            to="/cart"
            className="mt-6 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Return to Cart
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <h1 className="text-3xl font-bold text-orange-600">⚠️ Verification Error</h1>
          <p className="mt-2 text-lg text-gray-600">
            {error || "We couldn't confirm your payment or find order details."}
          </p>

          <Link
            to="/cart"
            className="mt-6 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Try Again
          </Link>
        </>
      )}
    </div>
  );
}
