import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../../api.js';
import './Checkout.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(orderId);
      if (data.success) {
        setOrder(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderHandler = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const data = await cancelOrder(orderId);
      if (data.success) {
        alert('Order cancelled successfully');
        fetchOrderDetails(); // Refresh order details
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Network error. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return '#ffc107';
      case 'Delivered':
        return '#28a745';
      case 'Cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing':
        return '⏳ Processing';
      case 'Delivered':
        return '✅ Delivered';
      case 'Cancelled':
        return '❌ Cancelled';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ Cash on Delivery';
      case 'paid':
        return '✅ Paid';
      case 'failed':
        return '❌ Failed';
      case 'cancelled':
        return '❌ Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-container">
        <div className="error-message">
          {error}
          <button onClick={fetchOrderDetails} className="retry-btn">Retry</button>
        </div>
        <button onClick={() => navigate('/orders')} className="back-btn">
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="error-message">Order not found</div>
        <button onClick={() => navigate('/orders')} className="back-btn">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <button onClick={() => navigate('/orders')} className="back-btn">
          ← Back to Orders
        </button>
        <h1>Order Details</h1>
      </div>

      <div className="order-detail-content">
        {/* Order Header */}
        <div className="order-header-card">
          <div className="order-title-section">
            <h2>Order #{order.orderNumber}</h2>
            <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="order-statuses">
            <span 
              className="order-status"
              style={{ backgroundColor: getStatusColor(order.orderStatus) }}
            >
              {getStatusText(order.orderStatus)}
            </span>
            <span className="payment-status">
              {getPaymentStatusText('pending')}
            </span>
          </div>
        </div>

        {/* Order Timeline */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="order-timeline">
            <h3>Order Timeline</h3>
            <div className="timeline-items">
              {order.statusHistory.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-status">{getStatusText(item.status)}</span>
                    <span className="timeline-date">{formatDate(item.timestamp)}</span>
                    {item.note && <p className="timeline-note">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-details-grid">
          {/* Order Information */}
          <div className="order-info-card">
            <h3>Order Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Order Number:</label>
                <span>{order.orderNumber}</span>
              </div>
              <div className="info-item">
                <label>Order Date:</label>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Payment Method:</label>
                <span>Cash on Delivery</span>
              </div>
              <div className="info-item">
                <label>Payment Status:</label>
                <span>{getPaymentStatusText('pending')}</span>
              </div>
              <div className="info-item">
                <label>Order Status:</label>
                <span>{getStatusText(order.orderStatus)}</span>
              </div>
              {order.deliveryDate && (
                <div className="info-item">
                  <label>Delivery Date:</label>
                  <span>{formatDate(order.deliveryDate)}</span>
                </div>
              )}
              {order.estimatedDelivery && !order.deliveryDate && (
                <div className="info-item">
                  <label>Estimated Delivery:</label>
                  <span>{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="shipping-address-card">
            <h3>Shipping Address</h3>
            <div className="address-content">
              {order.shippingAddress ? (
                <>
                  <p><strong>{order.shippingAddress.fullName}</strong></p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p>📱 {order.shippingAddress.phone}</p>
                </>
              ) : (
                <p>{order.deliveryLocation}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="order-products-card">
          <h3>Products ({order.products.length})</h3>
          <div className="products-list">
            {order.products.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <h4>{product.productId?.name || 'Product'}</h4>
                  <p className="product-description">
                    {product.productId?.description || 'No description available'}
                  </p>
                  <p className="product-type">
                    Type: {product.productId?.type || 'N/A'}
                  </p>
                </div>
                <div className="product-details">
                  <div className="product-quantity">
                    <label>Quantity:</label>
                    <span>{product.quantity}</span>
                  </div>
                  <div className="product-price">
                    <label>Price:</label>
                    <span>₹{product.price?.toLocaleString()}</span>
                  </div>
                  <div className="product-subtotal">
                    <label>Subtotal:</label>
                    <span>₹{(product.price * product.quantity)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="summary-items">
            <div className="summary-row">
              <span>Subtotal ({order.products.length} items):</span>
              <span>₹{order.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{order.formattedTotal || `₹${order.totalAmount?.toLocaleString()}`}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="payment-info-card">
          <h3>Payment Information</h3>
          <div className="payment-details">
            <div className="payment-item">
              <label>Payment Method:</label>
              <span>Cash on Delivery</span>
            </div>
            <div className="payment-item">
              <label>Payment Status:</label>
              <span>{getPaymentStatusText('pending')}</span>
            </div>
            <div className="payment-item">
              <label>Amount:</label>
              <span>₹{order.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="payment-item">
              <label>Payment Instructions:</label>
              <span>Please pay when you receive your order</span>
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        {order.adminNotes && (
          <div className="admin-notes-card">
            <h3>Admin Notes</h3>
            <p>{order.adminNotes}</p>
          </div>
        )}

        {/* Order Actions */}
        <div className="order-actions-card">
          <h3>Actions</h3>
          <div className="action-buttons">
            {order.orderStatus === 'Processing' && (
              <button
                className="cancel-btn"
                onClick={cancelOrderHandler}
              >
                Cancel Order
              </button>
            )}
            <button 
              className="print-btn"
              onClick={() => window.print()}
            >
              Print Order
            </button>
            <button 
              className="support-btn"
              onClick={() => alert('Contact support at support@example.com')}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
