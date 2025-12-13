import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import img from '../../assets/logo.png';

function Login({ onLogin, onClose }) {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [oneTapSkipped, setOneTapSkipped] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      console.log('🔐 Attempting login with email:', form.email);
      const result = await login(form);
      console.log('✅ Login result:', result);
      if (result.success) {
        console.log('✅ Login successful, redirecting...');
        if (onLogin) onLogin();
        if (onClose) onClose();
        navigate('/');
      } else {
        console.error('❌ Login failed:', result.error);
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrors({ general: error.message || "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      console.log('🔐 Attempting Google login...');
      const result = await googleLogin(credentialResponse.credential);
      console.log('✅ Google login result:', result);
      if (result.success) {
        console.log('✅ Google login successful, redirecting...');
        if (onLogin) onLogin();
        if (onClose) onClose();
        navigate('/');
      } else {
        console.error('❌ Google login failed:', result.error);
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error("❌ Google login error:", error);
      setErrors({ general: error.message || "Google login failed. Please try again." });
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "367194647798-0qjrumukncrmjj543lv31q5gop97elfk.apps.googleusercontent.com",
        callback: handleGoogleLogin
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setOneTapSkipped(true);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left side - Form */}
      <div className="w-1.8/4 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
               <img src={img} alt="" /> 
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                  errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${
                  errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Google Login */}
            {oneTapSkipped && (
              <div className="mt-4">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "367194647798-0qjrumukncrmjj543lv31q5gop97elfk.apps.googleusercontent.com"}>
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setErrors({ general: "Google login failed" })}
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
            alt="Modern workspace"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-slate-900/70 dark:bg-slate-900/50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-xl opacity-90">
              Access powerful tools and resources to grow your business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
