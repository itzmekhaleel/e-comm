import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import authService from '../services/auth.service';
import ImageService from '../services/image.service';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      addToast('Please login to view orders', 'warning');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8082/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load orders');
      }
      return response.json();
    })
    .then(data => {
      setOrders(data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error loading orders:', error);
      addToast('Failed to load orders. Please try again.', 'error');
      setLoading(false);
    });
  }, [addToast, navigate]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="orders loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="orders-container">
          <h2>Your Orders</h2>
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <h2>Your Orders ({orders.length})</h2>
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{formatDate(order.orderDate)}</p>
                </div>
                <div className="order-status">
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="order-items">
                {order.orderItems && order.orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img 
                        src={item.product?.imageUrl || ImageService.generateFallbackImageUrl(item.product?.id, item.product?.category)} 
                        alt={item.product?.name} 
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.product?.name}</h4>
                      <p className="item-category">{item.product?.category}</p>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      <p>{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <p>Total: {formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;