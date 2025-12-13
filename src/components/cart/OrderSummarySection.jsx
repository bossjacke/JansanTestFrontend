import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyOrders, cancelOrder } from '../../api.js';

const OrderSummarySection = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data.data.orders || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      const response = await cancelOrder(orderId);
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: 'Cancelled' }
            : order
        )
      );
      
      setShowCancelConfirm(null);
      alert('Order cancelled successfully!');
    } catch (err) {
      console.error('❌ Error cancelling order:', err);
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const confirmCancelOrder = (orderId) => {
    setShowCancelConfirm(orderId);
  };

  const cancelConfirmation = () => {
    setShowCancelConfirm(null);
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

  if (!user) return null;

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div 
        className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:from-purple-100 hover:to-indigo-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Orders Summary
            </h2>
            <p className="text-gray-600 mt-1">View your recent orders and track their status</p>
          </div>
          <div className="flex items-center gap-3">
            {orders.length > 0 && (
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {orders.length} Orders
              </span>
            )}
            <svg 
              className={`w-6 h-6 text-gray-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
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
                  <div key={order._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Order #{order.orderNumber || order._id?.slice(-8)}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </div>
                        {order.orderStatus === 'Processing' && (
                          <button
                            onClick={() => confirmCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            className="px-2 py-1 rounded text-xs font-medium bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
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

                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Order Cancellation</h3>
                      <p className="text-gray-600 mb-6">
                        Are you sure you want to cancel this order? This action cannot be undone.
                      </p>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={cancelConfirmation}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                        >
                          No, Keep Order
                        </button>
                        <button
                          onClick={() => handleCancelOrder(showCancelConfirm)}
                          disabled={cancellingOrderId === showCancelConfirm}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {cancellingOrderId === showCancelConfirm ? 'Cancelling...' : 'Yes, Cancel Order'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  View All Orders
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummarySection;
