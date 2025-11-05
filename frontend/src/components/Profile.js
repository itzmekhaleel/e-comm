import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './Profile.css';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [activeSection, setActiveSection] = useState('account');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, []);

  const logOut = () => {
    authService.logout();
    addToast('You have been logged out successfully', 'info');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real application, this would call an API to update the user profile
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleCancelEdit = () => {
    // Reset to original data
    const user = authService.getCurrentUser();
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="profile">
        <div className="profile-container">
          <div className="not-logged-in">
            <h2>Access Your Account</h2>
            <p>Please log in to view your profile and account information.</p>
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">Sign In</Link>
              <Link to="/register" className="btn btn-secondary">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-initials">
              {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
            </span>
          </div>
          <div className="profile-user-info">
            <h1>Hello, {currentUser.firstName}</h1>
            <p>Welcome to your MyKart account</p>
            <p className="user-email">{currentUser.email}</p>
          </div>
        </div>
        
        <div className="profile-navigation">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              Account Settings
            </button>
            <button 
              className={`nav-tab ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              Your Orders
            </button>
            <button 
              className={`nav-tab ${activeSection === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveSection('wishlist')}
            >
              Wish List
            </button>
            <button 
              className={`nav-tab ${activeSection === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveSection('addresses')}
            >
              Address Book
            </button>
            <button 
              className={`nav-tab ${activeSection === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveSection('payment')}
            >
              Payment Methods
            </button>
          </div>
        </div>
        
        <div className="profile-content">
          {activeSection === 'account' && (
            <div className="profile-section">
              <h2>Account Settings</h2>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <label>User ID:</label>
                  <span>{currentUser.id}</span>
                </div>
                <div className="profile-info-item">
                  <label>First Name:</label>
                  <span>{currentUser.firstName}</span>
                </div>
                <div className="profile-info-item">
                  <label>Last Name:</label>
                  <span>{currentUser.lastName}</span>
                </div>
                <div className="profile-info-item">
                  <label>Email:</label>
                  <span>{currentUser.email}</span>
                </div>
                <div className="profile-info-item">
                  <label>Member Since:</label>
                  <span>January 2025</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn btn-secondary" onClick={() => addToast('Edit profile feature coming soon!', 'info')}>Edit Profile</button>
                <button className="btn btn-secondary" onClick={() => addToast('Change password feature coming soon!', 'info')}>Change Password</button>
              </div>
            </div>
          )}
          
          {activeSection === 'orders' && (
            <div className="profile-section">
              <h2>Your Orders</h2>
              <div className="profile-card">
                <div className="card-content">
                  <p>You haven't placed any orders yet.</p>
                  <p>Once you make a purchase, your order history will appear here.</p>
                </div>
                <div className="card-actions">
                  <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'wishlist' && (
            <div className="profile-section">
              <h2>Wish List</h2>
              <div className="profile-card">
                <div className="card-content">
                  <p>You haven't added any items to your wish list yet.</p>
                  <p>Save items you like for later by adding them to your wish list.</p>
                </div>
                <div className="card-actions">
                  <Link to="/products" className="btn btn-primary">Browse Products</Link>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'addresses' && (
            <div className="profile-section">
              <h2>Address Book</h2>
              <div className="profile-card">
                <div className="card-content">
                  <p>You haven't added any addresses yet.</p>
                  <p>Add your delivery addresses for faster checkout.</p>
                </div>
                <div className="card-actions">
                  <button className="btn btn-secondary">Add Address</button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'payment' && (
            <div className="profile-section">
              <h2>Payment Methods</h2>
              <div className="profile-card">
                <div className="card-content">
                  <p>You haven't added any payment methods yet.</p>
                  <p>Add your preferred payment methods for faster checkout.</p>
                </div>
                <div className="card-actions">
                  <button className="btn btn-secondary">Add Payment Method</button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-footer">
          <button className="btn btn-danger" onClick={logOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;