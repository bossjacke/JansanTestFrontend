import React, { useState } from "react";
import { RegisterUser } from "../../api.js";
import { Link, useNavigate } from 'react-router-dom';

function Register({ onRegister, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const { confirmPassword, acceptTerms, ...formData } = form;

    try {
      console.log('📝 Attempting registration with data:', { ...formData, password: '***' });
      const res = await RegisterUser(formData);
      console.log('✅ Registration successful:', res);
      setSuccessMessage(res.message || "Registration successful! Redirecting to login...");

      if (onRegister) onRegister(res);
      if (onClose) onClose();

      setTimeout(() => {
        try {
          navigate('/login');
        } catch (e) {
          window.location.href = '/login';
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Registration error:", error);
      const errorMsg = error?.message || error?.response?.data?.message || "Registration failed. Please try again.";
      setErrors({
        general: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left side - Form */}
      <div className="w-1.8/4 flex items-center justify-center p-8">
        <div className="w-1.8/4 ">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">X</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Join us today and get started</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleInputChange('name')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

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
                onChange={handleInputChange('email')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleInputChange('phone')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Enter your location (e.g., Colombo, Sri Lanka)"
                value={form.location}
                onChange={handleInputChange('location')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${errors.location ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={errors.location ? 'true' : 'false'}
                aria-describedby={errors.location ? 'location-error' : undefined}
              />
              {errors.location && (
                <p id="location-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.location}
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
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleInputChange('password')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-200 ${errors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Acceptance */}
            <div>
              <div className="flex items-start">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={handleInputChange('acceptTerms')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 dark:bg-gray-800 dark:border-gray-700"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p id="acceptTerms-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
              <Link
                to="/login"
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 hidden lg:block lg:w-3/4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-700">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Education dashboard"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-slate-900/70 dark:bg-slate-900/50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl opacity-90">
              Connect with thousands of learners and unlock your potential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
