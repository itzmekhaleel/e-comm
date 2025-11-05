import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      addToast('Please login to view your profile', 'warning');
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setFormData({
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      city: currentUser.city || '',
      state: currentUser.state || '',
      zipCode: currentUser.zipCode || ''
    });
    setLoading(false);
  }, [navigate, addToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real application, this would call an API to update the user profile
    const updatedUser = {
      ...user,
      ...formData
    };
    
    // Update local storage (in a real app, this would be an API call)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user in auth service
    authService.updateCurrentUser(updatedUser);
    
    setUser(updatedUser);
    setEditMode(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || ''
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>
        
        <div className="profile-content">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <div className="profile-header">
              <div className="profile-avatar">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div className="profile-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="profile-email">
                {user.email}
              </div>
            </div>
            
            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon">👤</span>
                Personal Information
              </button>
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('orders');
                  navigate('/orders');
                }}
              >
                <span className="nav-icon">📦</span>
                Your Orders
              </button>
              <button 
                className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('wishlist');
                  navigate('/wishlist');
                }}
              >
                <span className="nav-icon">❤️</span>
                Wishlist
              </button>
              <button 
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <span className="nav-icon">🏠</span>
                Address Book
              </button>
              <button 
                className={`nav-item ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
              >
                <span className="nav-icon">💳</span>
                Payment Methods
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="profile-main">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  {!editMode && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <p className="help-text">Email cannot be changed</p>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={handleSave}
                      >
                        Save Changes
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="label">Full Name:</span>
                      <span className="value">{user.firstName} {user.lastName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">{user.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span className="value">{user.phone || 'Not provided'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Address Book</h2>
                  <button className="btn btn-outline">
                    Add New Address
                  </button>
                </div>
                
                <div className="addresses-list">
                  <div className="address-card">
                    <div className="address-header">
                      <h3>Home Address</h3>
                      <div className="address-actions">
                        <button className="btn-icon">✏️</button>
                        <button className="btn-icon">🗑️</button>
                      </div>
                    </div>
                    <div className="address-details">
                      <p>123 Main Street</p>
                      <p>Bangalore, Karnataka 560001</p>
                      <p>India</p>
                      <p>Phone: +91 98765 43210</p>
                    </div>
                    <div className="address-footer">
                      <button className="btn btn-sm btn-outline">Set as Default</button>
                    </div>
                  </div>
                  
                  <div className="address-card">
                    <div className="address-header">
                      <h3>Office Address</h3>
                      <div className="address-actions">
                        <button className="btn-icon">✏️</button>
                        <button className="btn-icon">🗑️</button>
                      </div>
                    </div>
                    <div className="address-details">
                      <p>456 Business Park</p>
                      <p>Mumbai, Maharashtra 400001</p>
                      <p>India</p>
                      <p>Phone: +91 98765 43211</p>
                    </div>
                    <div className="address-footer">
                      <button className="btn btn-sm btn-outline">Set as Default</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div className="profile-section">
                <div className="section-header">
                  <h2>Payment Methods</h2>
                  <button className="btn btn-outline">
                    Add Payment Method
                  </button>
                </div>
                
                <div className="payment-methods">
                  <div className="payment-card">
                    <div className="card-header">
                      <div className="card-type">💳</div>
                      <div className="card-info">
                        <h3>Credit Card</h3>
                        <p>**** **** **** 1234</p>
                        <p>Expires: 12/27</p>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-icon">✏️</button>
                      <button className="btn-icon">🗑️</button>
                    </div>
                  </div>
                  
                  <div className="payment-card">
                    <div className="card-header">
                      <div className="card-type">💳</div>
                      <div className="card-info">
                        <h3>Debit Card</h3>
                        <p>**** **** **** 5678</p>
                        <p>Expires: 06/26</p>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-icon">✏️</button>
                      <button className="btn-icon">🗑️</button>
                    </div>
                  </div>
                  
                  <div className="payment-option">
                    <div className="option-header">
                      <div className="option-icon">💰</div>
                      <div className="option-info">
                        <h3>Cash on Delivery</h3>
                        <p>Pay when your order is delivered</p>
                      </div>
                    </div>
                    <div className="option-status">
                      <span className="status active">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;