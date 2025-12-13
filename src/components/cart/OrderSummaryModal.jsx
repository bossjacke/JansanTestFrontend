import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyOrders } from '../../api.js';

const OrderSummaryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔔 Modal isOpen:', isOpen, 'User:', !!user);
    if (isOpen && user) {
      fetchOrders();
    }
  }, [isOpen, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching orders...');
      const data = await getMyOrders();
      console.log('📦 Orders response:', data);
      console.log('📋 Orders data:', data.data);
      console.log('📝 Orders array:', data.data.orders);
      setOrders(data.data.orders || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-orange-500';
      case 'Delivered':
        return 'bg-blue-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">My Orders Summary</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer bg-transparent border-none p-0 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-10">
              <div className="text-lg text-gray-600">Loading orders...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-10">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={fetchOrders}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-5">📦</div>
              <h3 className="text-gray-600 mb-3">No orders yet</h3>
              <p className="text-gray-400">Start shopping to see your orders here!</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-3">Order Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Orders', value: orders.length, color: 'text-gray-800' },
                    { label: 'Processing', value: orders.filter(o => o.orderStatus === 'Processing').length, color: 'text-orange-500' },
                    { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, color: 'text-blue-500' },
                    { label: 'Cancelled', value: orders.filter(o => o.orderStatus === 'Cancelled').length, color: 'text-red-500' }
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center p-3 bg-white rounded-lg">
                      <div className={`text-lg font-bold ${color}`}>{value}</div>
                      <div className="text-gray-600 text-xs">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Order #{order.orderNumber || order._id?.slice(-8)}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.products && order.products.slice(0, 3).map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{product.productId?.name || 'Product'}</span>
                            <span className="text-gray-500 ml-2">×{product.quantity}</span>
                          </div>
                          <span className="font-medium">₹{(product.price * product.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      {order.products && order.products.length > 3 && (
                        <div className="text-xs text-gray-500">+{order.products.length - 3} more items</div>
                      )}
                    </div>

                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <div className="font-bold">Total:</div>
                      <div className="font-bold text-lg">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={() => window.location.href = '/orders'}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
