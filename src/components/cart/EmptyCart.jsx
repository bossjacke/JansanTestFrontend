import React from 'react';

const EmptyCart = ({ onStartShopping }) => (
	<div className="text-center py-16">
		<div className="text-6xl mb-4">🛒</div>
		<h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
		<p className="text-gray-500 mb-6">Add some products to get started!</p>
		<button 
			className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-primary-gradient text-white focus:ring-4 focus:ring-purple-200/50"
			onClick={onStartShopping}
		>
			Start Shopping
		</button>
	</div>
);

export default EmptyCart;
