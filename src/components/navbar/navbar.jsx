// import React from 'react';
// import { Link } from 'react-router-dom';


// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="nav-left">
//         {/* Logo */}
//         <img src="/logo.png" alt="Logo" className="logo" />

//         {/* Navigation Links */}
//         <Link to="/Home" className="nav-item">Home</Link>
//         <Link to="/about" className="nav-item">About</Link>
//         <Link to="/products" className="nav-item">Products</Link>
//         <Link to="/cart" className="nav-item">Cart</Link>
//         <Link to="/login" className="nav-item">Login</Link>
//         <Link to="/register" className="nav-item">Register</Link>
        
//       </div>

//       <div className="nav-right">
//         <button className="close-btn">X</button>
//         <Link to="/signin" className="signin-link">Sign In</Link>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import img from '../../assets/logo.png';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    if (user?.name) {
      setInitial(user.name.trim().charAt(0).toUpperCase());
    } else if (user?.email) {
      setInitial(user.email.trim().charAt(0).toUpperCase());
    } else {
      // Try to derive user's first-letter from stored user info in localStorage.
      try {
        const rawUser = localStorage.getItem('user') || localStorage.getItem('profile');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          const name = u?.name || u?.fullName || u?.username || u?.email;
          if (name) return setInitial(name.trim().charAt(0).toUpperCase());
        }
      } catch (e) {
        // ignore parse errors
      }

      // fallback: check common simple keys
      const nameKey = localStorage.getItem('name') || localStorage.getItem('userName') || localStorage.getItem('username');
      if (nameKey) setInitial(String(nameKey).trim().charAt(0).toUpperCase());
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-50 dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
            <div className="w-10 h-10 text-white font-bold rounded-full flex items-center justify-center shadow-lg">
             <img src={img} alt="" />
            </div>
              <span className="text-sm bg-slate-900 text-white p-6 rounded-lg ml-2">Adams Fire</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Contact
            </Link>
            <Link 
              to="/cart" 
              className="relative text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cart</span>
              </div>
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {initial || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user?.name || user?.email}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
{/* mobile works */}
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-purple-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Hidden by default) */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="px-4 py-2 space-y-1">
          <Link 
            to="/" 
            className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </Link>
          <Link 
            to="/products" 
            className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Products
          </Link>
          <Link 
            to="/contact" 
            className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Contact
          </Link>
          <Link 
            to="/cart" 
            className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
          >
            Cart
          </Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="block text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
