import React from 'react';

const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
        <button
          onClick={onRetry}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default ErrorState;