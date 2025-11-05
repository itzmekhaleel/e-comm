import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import CurrencyService from '../services/currency.service';
import { useToast } from '../contexts/ToastContext';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      addToast('Please login to view your orders', 'warning');
      navigate('/login');
      return;
    }

    // In a real application, this would fetch from an API
    loadOrders();
  }, [navigate, addToast]);

  const loadOrders = () => {
    // Simulate API call with sample data
    setTimeout(() => {
      const sampleOrders = [
        {
          id: 'ORD-2025-001',
          date: '2025-10-15',
          status: 'Delivered',
          total: 129999,
          items: [
            {
              id: 1,
              name: 'iPhone 15 Pro',
              price: 129999,
              quantity: 1,
              imageUrl: 'https://picsum.photos/100/100?random=1'
            }
          ]
        },
        {
          id: 'ORD-2025-002',
          date: '2025-10-20',
          status: 'Shipped',
          total: 89999,
          items: [
            {
              id: 2,
              name: 'Dell XPS 13',
              price: 89999,
              quantity: 1,
              imageUrl: 'https://picsum.photos/100/100?random=2'
            }
          ]
        },
        {
          id: 'ORD-2025-003',
          date: '2025-10-25',
          status: 'Processing',
          total: 59998,
          items: [
            {
              id: 3,
              name: 'Sony WH-1000XM5',
              price: 29999,
              quantity: 2,
              imageUrl: 'https://picsum.photos/100/100?random=3'
            }
          ]
        }
      ];
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    try {
      const convertedAmount = CurrencyService.convertFromINR(amount);
      return CurrencyService.formatCurrency(convertedAmount);
    } catch (err) {
      console.error('Error formatting currency:', err);
      return `₹${amount.toFixed(2)}`;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>You haven't placed any orders yet</h2>
            <p>Once you place an order, it will appear here</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-content">
            <div className="orders-list">
              <h2>Order History</h2>
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-id">Order #{order.id}</div>
                      <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div className={`order-status ${getStatusClass(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = '/images/placeholder.png';
                          }}
                        />
                        <div className="item-details">
                          <h3>{item.name}</h3>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-footer">
                    <div className="order-total">
                      Total: {formatCurrency(order.total)}
                    </div>
                    <button 
                      className="btn btn-outline"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedOrder && (
              <div className="order-details-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Order Details</h2>
                    <button 
                      className="close-modal"
                      onClick={closeOrderDetails}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Order ID:</span>
                        <span>{selectedOrder.id}</span>
                      </div>
                      <div className="summary-row">
                        <span>Order Date:</span>
                        <span>{new Date(selectedOrder.date).toLocaleDateString()}</span>
                      </div>
                      <div className="summary-row">
                        <span>Status:</span>
                        <span className={`status ${getStatusClass(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Total:</span>
                        <span className="total-amount">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items-details">
                      <h3>Items in this order</h3>
                      {selectedOrder.items.map(item => (
                        <div key={item.id} className="order-item-detail">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                            }}
                          />
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: {formatCurrency(item.price)} each</p>
                          </div>
                          <div className="item-total">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="shipping-info">
                      <h3>Shipping Information</h3>
                      <div className="info-row">
                        <span>Shipping Address:</span>
                        <span>
                          123 Main Street, Bangalore, Karnataka 560001, India
                        </span>
                      </div>
                      <div className="info-row">
                        <span>Estimated Delivery:</span>
                        <span>
                          {selectedOrder.status === 'Delivered' 
                            ? 'Delivered on Oct 20, 2025' 
                            : 'Oct 25, 2025'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button 
                      className="btn btn-primary"
                      onClick={closeOrderDetails}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;