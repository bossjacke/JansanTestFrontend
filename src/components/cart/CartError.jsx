import React from 'react';

const CartError = ({ error }) => (
	<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
		{error}
	</div>
);

export default CartError;
