import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/product.service';
import cartItemService from '../services/cart-item.service';
import CurrencyService from '../services/currency.service';
import ImageService from '../services/image.service';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (wishlist.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      // Load all products in the wishlist
      const productPromises = wishlist.map(id => productService.get(id));
      const productResponses = await Promise.all(productPromises);
      
      const loadedProducts = productResponses.map(response => response.data);
      setWishlistItems(loadedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading wishlist products:', error);
      addToast('Failed to load wishlist products', 'error');
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const newWishlist = wishlist.filter(id => id !== productId.toString());
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    
    // Also remove from selected items if it was selected
    setSelectedItems(selectedItems.filter(id => id !== productId));
    
    addToast('Product removed from wishlist', 'info');
  };

  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      localStorage.setItem('wishlist', JSON.stringify([]));
      setWishlistItems([]);
      setSelectedItems([]);
      addToast('Wishlist cleared', 'info');
    }
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

  const toggleSelectItem = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const selectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const moveToCart = async (productId) => {
    try {
      await cartItemService.addToCart(productId, 1);
      removeFromWishlist(productId);
      addToast('Product moved to cart', 'success');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error moving to cart:', error);
      addToast('Failed to move product to cart', 'error');
    }
  };

  const moveToCartSelected = async () => {
    if (selectedItems.length === 0) {
      addToast('Please select items to move to cart', 'warning');
      return;
    }
    
    try {
      // Move all selected items to cart
      const promises = selectedItems.map(id => cartItemService.addToCart(id, 1));
      await Promise.all(promises);
      
      // Remove from wishlist
      const newWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        .filter(id => !selectedItems.includes(parseInt(id)));
      
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setWishlistItems(wishlistItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      
      addToast(`${selectedItems.length} product(s) moved to cart`, 'success');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error moving selected items to cart:', error);
      addToast('Failed to move selected items to cart', 'error');
    }
  };

  const shareWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.length === 0) {
      addToast('Your wishlist is empty', 'info');
      return;
    }
    
    const message = `Check out my wishlist with ${wishlist.length} amazing products!`;
    const url = `${window.location.origin}/wishlist`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: message,
        url: url
      }).catch(error => {
        console.log('Error sharing:', error);
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        addToast('Wishlist link copied to clipboard!', 'success');
      })
      .catch(err => {
        addToast('Failed to copy link', 'error');
      });
  };

  if (loading) {
    return (
      <div className="wishlist">
        <div className="wishlist-container">
          <div className="loading">Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
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
  }

  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>Your Wish List ({wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''})</h1>
          <div className="wishlist-actions">
            <button 
              className="btn btn-outline"
              onClick={selectAll}
            >
              {selectedItems.length === wishlistItems.length ? 'Deselect All' : 'Select All'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={moveToCartSelected}
              disabled={selectedItems.length === 0}
            >
              Move Selected to Cart
            </button>
            <button 
              className="btn btn-outline"
              onClick={shareWishlist}
            >
              Share Wishlist
            </button>
            <button 
              className="btn btn-outline"
              onClick={clearWishlist}
            >
              Clear Wishlist
            </button>
          </div>
        </div>

        <div className="wishlist-items">
          {wishlistItems.map(product => {
            const discountedPrice = product.discountPercentage && product.discountPercentage > 0
              ? product.price * (100 - product.discountPercentage) / 100
              : product.price;
            
            const isSelected = selectedItems.includes(product.id);
            
            return (
              <div 
                key={product.id} 
                className={`wishlist-item ${isSelected ? 'selected' : ''}`}
              >
                <div className="wishlist-item-select">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectItem(product.id)}
                    aria-label={`Select ${product.name}`}
                  />
                </div>
                
                <div className="wishlist-item-image">
                  <img 
                    src={product.imageUrl || ImageService.generateProductImageUrl(
                      product.id, 
                      product.category, 
                      product.name
                    )} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <div className="discount-badge">{product.discountPercentage}% off</div>
                  )}
                </div>
                
                <div className="wishlist-item-details">
                  <h3>
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-rating">
                    <div className="stars">
                      {'★'.repeat(Math.round(product.rating || 4))}
                      {'☆'.repeat(5 - Math.round(product.rating || 4))}
                    </div>
                    <span className="rating-count">({(product.rating || 4).toFixed(1)})</span>
                  </div>
                  <div className="product-price">
                    <span className={`current-price ${product.discountPercentage > 0 ? 'discounted' : ''}`}>
                      {formatCurrency(discountedPrice)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="original-price">
                        <span className="strikethrough">{formatCurrency(product.price)}</span>
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="wishlist-item-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => moveToCart(product.id)}
                  >
                    Move to Cart
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedItems.length > 0 && (
          <div className="selected-summary">
            <p>{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</p>
            <button 
              className="btn btn-secondary"
              onClick={moveToCartSelected}
            >
              Move Selected to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;