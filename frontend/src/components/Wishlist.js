import React from 'react';
import { Link } from 'react-router-dom';
import './Wishlist.css';

const Wishlist = () => {
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>Your Wish List</h1>
          <p>Save items you like for later</p>
        </div>
        <div className="no-wishlist">
          <div className="no-wishlist-icon">❤️</div>
          <h2>Your Wish List is Empty</h2>
          <p>You haven't added any items to your wish list yet.</p>
          <p>Save items you like by clicking the "Add to Wish List" button on product pages.</p>
          <div className="no-wishlist-actions">
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
        <div className="wishlist-tips">
          <h3>Wish List Tips</h3>
          <ul>
            <li>Add items to your wish list by clicking the heart icon on product pages</li>
            <li>Move items from your wish list to your cart when you're ready to purchase</li>
            <li>Share your wish list with friends and family</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;