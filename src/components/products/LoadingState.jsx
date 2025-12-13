import React from 'react';

const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-16">
        <div className="loading-spinner mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Products</h2>
        <p className="text-gray-600">Please wait while we fetch our amazing products...</p>
      </div>
    </div>
  </div>
);

export default LoadingState;