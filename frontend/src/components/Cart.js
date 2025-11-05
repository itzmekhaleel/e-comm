import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cart.service';
import CurrencyService from '../services/currency.service';
import { useToast } from '../contexts/ToastContext';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  /**
   * Load cart items from backend
   */
  const loadCart = async () => {
    try {
      console.log("loading from BE");
      
      setLoading(true);
      const response = await cartService.getCart();
      
      if (response && response.cartItems) {
        // Convert Set to Array for easier manipulation
        const itemsArray = Array.from(response.cartItems);
        setCartItems(itemsArray);
      } else {
        setCartItems([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      addToast('Failed to load cart. Please try again.', 'error');
      setLoading(false);
      setCartItems([]);
    }
  };

  /**
   * Update item quantity
   */
  const updateQuantity = async (itemId, productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId, productId);
      return;
    }
    
    try {
      setUpdatingItemId(itemId);
      await cartService.updateItemQuantity(productId, newQuantity);
      await loadCart(); // Reload cart to get updated data
      addToast('Cart updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating quantity:', error);
      addToast('Failed to update cart item. Please try again.', 'error');
    } finally {
      setUpdatingItemId(null);
    }
  };

  /**
   * Remove item from cart
   */
  const removeItem = async (itemId, productId) => {
    try {
      setUpdatingItemId(itemId);
      await cartService.removeItem(productId);
      await loadCart(); // Reload cart to get updated data
      addToast('Item removed from cart!', 'success');
    } catch (error) {
      console.error('Error removing item:', error);
      addToast('Failed to remove item from cart. Please try again.', 'error');
    } finally {
      setUpdatingItemId(null);
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (cartItems.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartService.clearCart();
        setCartItems([]);
        addToast('Cart cleared successfully!', 'success');
      } catch (error) {
        console.error('Error clearing cart:', error);
        addToast('Failed to clear cart. Please try again.', 'error');
      }
    }
  };

  /**
   * Continue shopping
   */
  const continueShopping = () => {
    navigate('/products');
  };

  /**
   * Proceed to checkout
   */
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'warning');
      return;
    }
    navigate('/checkout');
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    try {
      const convertedAmount = CurrencyService.convertFromINR(amount);
      return CurrencyService.formatCurrency(convertedAmount);
    } catch (err) {
      console.error('Error formatting currency:', err);
      return `₹${amount.toFixed(2)}`;
    }
  };

  /**
   * Calculate total price
   */
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  };

  /**
   * Calculate total items
   */
  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);
  };

  /**
   * Load cart on component mount
   */
  useEffect(() => {
    loadCart();
    
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  /**
   * Render the component
   */
  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>
        
        {loading ? (
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={continueShopping}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-content">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.productImageUrl || '/images/placeholder.png'} 
                        alt={item.productName}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.productName}</h3>
                      <p className="item-price">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                        disabled={updatingItemId === item.id}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                        disabled={updatingItemId === item.id}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      <p className="item-total-price">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="item-actions">
                      <button 
                        className="remove-btn"
                        onClick={() => removeItem(item.id, item.productId)}
                        disabled={updatingItemId === item.id}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-content">
                  <h2>Order Summary</h2>
                  <div className="summary-row">
                    <span>Items ({calculateTotalItems()}):</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{calculateTotal() > 500 ? 'FREE' : formatCurrency(50)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (18% GST):</span>
                    <span>{formatCurrency(calculateTotal() * 0.18)}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span className="total-price">{formatCurrency(calculateTotal() + (calculateTotal() > 500 ? 0 : 50) + (calculateTotal() * 0.18))}</span>
                  </div>
                  <div className="summary-actions">
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Clear Cart
                    </button>
                    <button className="checkout-btn" onClick={proceedToCheckout}>
                      Proceed to Checkout
                    </button>
                  </div>
                  <button className="continue-shopping-btn" onClick={continueShopping}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;