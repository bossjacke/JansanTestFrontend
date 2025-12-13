import React, { useState } from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Handle null or undefined item
  if (!item) {
    return (
      <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4 border">
        <div className="text-red-500">Error: Item data is missing</div>
      </div>
    );
  }

  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (item._id) {
      onUpdateQuantity(item._id, newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (item._id) {
        onUpdateQuantity(item._id, newQuantity);
      }
    }
  };

  const handleRemove = () => {
    if (item._id) {
      onRemove(item._id);
    }
  };

  return (
    <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4 border">
      <div className="w-20 h-20 mr-4 flex-shrink-0">
        {item.productId?.image ? (
          <img src={item.productId.image} alt={item.productId?.name || 'Product'} className="w-full h-full object-cover rounded" />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">No Image</div>
        )}
      </div>

      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-800">{item.productId?.name || 'Unknown Product'}</h4>
        <p className="text-sm text-gray-600">{item.productId?.type || 'Unknown Type'}</p>
        <p className="text-sm font-medium text-gray-800">₹{(item.price || 0).toLocaleString()}</p>

        <div className="flex items-center mt-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            -
          </button>

          <span className="px-3 py-1 bg-gray-100">{quantity}</span>

          <button
            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r"
            onClick={handleIncrease}
          >
            +
          </button>
        </div>

        <p className="text-sm font-medium mt-2 text-gray-800">Total: ₹{((item.price || 0) * quantity).toLocaleString()}</p>

        <button type="button" className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm font-medium" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
