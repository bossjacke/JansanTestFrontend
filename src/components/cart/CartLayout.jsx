import React from 'react';

const CartLayout = ({ children, itemCount }) => (
	<div className="min-h-[calc(100vh-64px)] p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
		<div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg shadow-gray-900/5">
			<div className="flex justify-between items-center mb-6">
				<h1 className="gradient-text">Shopping Cart</h1>
				<div className="text-sm text-gray-600">
					{itemCount} {itemCount === 1 ? 'Item' : 'Items'}
				</div>
			</div>
			{children}
		</div>
	</div>
);

export default CartLayout;
