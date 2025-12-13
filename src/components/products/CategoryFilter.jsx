import React from 'react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory, products }) => {
  const biogasProducts = products.filter(p => p.type === 'biogas');
  const fertilizerProducts = products.filter(p => p.type === 'fertilizer');

  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex rounded-lg shadow-sm" role="group">
        <button
          type="button"
          className={`px-6 py-3 text-sm font-medium rounded-l-lg border ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedCategory('all')}
        >
          All Products ({products.length})
        </button>
        <button
          type="button"
          className={`px-6 py-3 text-sm font-medium border-t border-b ${
            selectedCategory === 'biogas'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedCategory('biogas')}
        >
          🔥 Biogas Units ({biogasProducts.length})
        </button>
        <button
          type="button"
          className={`px-6 py-3 text-sm font-medium rounded-r-lg border ${
            selectedCategory === 'fertilizer'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => setSelectedCategory('fertilizer')}
        >
          🌱 Fertilizers ({fertilizerProducts.length})
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;