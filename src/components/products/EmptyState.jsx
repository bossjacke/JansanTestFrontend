import React from 'react';

const EmptyState = ({ selectedCategory, onViewAll }) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">📦</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {selectedCategory === 'all'
        ? 'No products available at the moment'
        : `No ${selectedCategory} products available`}
    </h3>
    <p className="text-gray-600 mb-6">
      {selectedCategory === 'all'
        ? 'Check back later for new products'
        : `Try selecting a different category`}
    </p>
    <button
      onClick={onViewAll}
      className="btn btn-primary"
    >
      View All Products
    </button>
  </div>
);

export default EmptyState;