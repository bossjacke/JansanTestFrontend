import React from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to the main checkout page
    navigate("/checkout", { replace: true });
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-center">
      <div className="text-lg">Redirecting to checkout...</div>
    </div>
  );
}
