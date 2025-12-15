import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext.jsx';
import './App.css';
import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './components/home/Home.jsx';
import About from './components/about/About.jsx';
import ProductsPage from './components/products/ProductsPage.jsx';
import Cart from './components/cart/Cart.jsx';
import Login from './components/login/Login.jsx';
import Register from './components/Register/Register.jsx';
import ForgotPassword from './components/password/ForgotPassword.jsx';
import ResetPassword from './components/password/ResetPassword.jsx';
import Admin from './components/admin/Admin.jsx';
import Orders from './components/orders/Orders.jsx';
import OrderDetail from './components/orders/OrderDetail.jsx';
import Checkout from './components/orders/Checkout.jsx';
import Contact from './components/Contact/Contact.jsx';
import ChatButton from './components/chat bot/ChatButton.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import Success from './pages/Success.jsx';
import Cancel from './pages/Cancel.jsx';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Stripe Configuration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <AuthProvider>


          <div>
            <Navbar />
            <Elements stripe={stripePromise}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:orderId" element={<OrderDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
              </Routes>
            </Elements>
             {/* Chat Button - Global Component */}
          <ChatButton />
            <Footer />
          </div>
          
         


    </AuthProvider>

  );
}

export default App;
