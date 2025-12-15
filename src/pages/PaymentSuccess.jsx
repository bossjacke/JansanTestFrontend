// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { confirmPayment } from "../api.js";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("checking");
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirmPayment = async () => {
      // Retrieve order data from local storage
      const pendingOrderData = JSON.parse(localStorage.getItem('pendingOrderData'));
      
      if (!pendingOrderData) {
        console.error("No pending order data found in local storage.");
        setStatus("error");
        setLoading(false);
        return;
      }

      try {
        // Here, you would typically send the paymentIntentId and the order data
        // to your backend to create the order and mark it as paid.
        const response = await confirmPayment({ 
          paymentIntentId,
          orderData: {
            items: pendingOrderData.items,
            shippingAddress: pendingOrderData.shippingAddress,
            totalAmount: pendingOrderData.totalAmount,
            paymentMethod: 'stripe',
            paymentDetails: {
              paymentIntentId: paymentIntentId,
              status: 'succeeded'
            }
          }
        });

        if (response.success) {
          setStatus("success");
          // Clear the pending order data from local storage
          localStorage.removeItem('pendingOrderData');
          // Redirect to Orders page after 2 seconds
          setTimeout(() => navigate("/orders"), 2000);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      } finally {
        // Always clean up local storage
        localStorage.removeItem('pendingOrderData');
        setLoading(false);
      }
    };

    if (paymentIntentId) {
      handleConfirmPayment();
    } else {
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
          <p className="mt-2 text-lg text-gray-600">We couldn't confirm your payment or find order details.</p>

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