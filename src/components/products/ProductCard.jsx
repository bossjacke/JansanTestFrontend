import React, { useState } from 'react';
import ZoomAnimation from '../transitions/ZoomAnimation.jsx';
import gasCylinderImage from '../../assets/gascylinder.avif';
import fertilizerImage from '../../assets/organicfertilizer.webp';

const ProductCard = ({ product, addToCart }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <ZoomAnimation isAnimating={isAnimating}>
      <div 
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-50 to-blue-50">
          <img
            src={product.image || (product.type === 'biogas' ? gasCylinderImage : fertilizerImage)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to a solid color background if image fails to load
              e.target.style.display = 'none';
              e.target.parentElement.className += ' flex items-center justify-center text-gray-400';
              e.target.parentElement.innerHTML = '<div class="text-center"><div class="text-4xl mb-2">' + (product.type === 'biogas' ? '⚡' : '🌱') + '</div><div class="text-sm">No Image</div></div>';
            }}
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              product.type === 'biogas' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {product.type === 'biogas' ? 'Biogas' : 'Fertilizer'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            {product.capacity && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Capacity:</span>
                <span>{product.capacity}</span>
              </div>
            )}
            {product.warrantyPeriod && (
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium mr-2">Warranty:</span>
                <span>{product.warrantyPeriod}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-2xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </ZoomAnimation>
  );
};

export default ProductCard;
