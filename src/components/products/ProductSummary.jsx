import React from 'react';

const ProductSummary = ({ products }) => {
  const biogasProducts = products.filter(p => p.type === 'biogas');
  const fertilizerProducts = products.filter(p => p.type === 'fertilizer');

  return (
    <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Product Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-gray-900 mb-2">{products.length}</div>
          <div className="text-gray-600">Total Products</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-orange-500 mb-2">{biogasProducts.length}</div>
          <div className="text-gray-600">Biogas Units</div>
        </div>
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-green-500 mb-2">{fertilizerProducts.length}</div>
          <div className="text-gray-600">Fertilizers</div>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;