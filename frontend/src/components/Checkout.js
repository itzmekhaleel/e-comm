import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cart.service';
import CurrencyService from '../services/currency.service';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './Checkout.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      addToast('Please login to checkout', 'warning');
      navigate('/login');
      return;
    }
    
    loadCart();
    
    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || ''
    }));
  }, [navigate, addToast]);

  const loadCart = async () => {
    try {
      const response = await cartService.getCart();
      if (response && response.cartItems) {
        const itemsArray = Array.from(response.cartItems);
        setCartItems(itemsArray);
        
        // Calculate order summary
        const subtotal = itemsArray.reduce((total, item) => total + (item.price || 0), 0);
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
        const tax = subtotal * 0.18; // 18% GST
        const total = subtotal + shipping + tax;
        
        setOrderSummary({
          subtotal,
          shipping,
          tax,
          total
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      addToast('Failed to load cart items', 'error');
      setLoading(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (activeStep === 1) {
      // Validate shipping info
      if (!formData.firstName || !formData.lastName || !formData.address || 
          !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
        addToast('Please fill in all required shipping information', 'warning');
        return;
      }
    } else if (activeStep === 2) {
      // Validate payment info
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber || !formData.cardName || 
            !formData.cardExpiry || !formData.cardCvv) {
          addToast('Please fill in all card details', 'warning');
          return;
        }
      }
    }
    
    setActiveStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const placeOrder = () => {
    // In a real application, this would call an API to create the order
    addToast('Order placed successfully!', 'success');
    
    // Clear cart (in a real app, this would be done on the backend)
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="checkout">
        <div className="checkout-container">
          <div className="loading">Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <div className="checkout-container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>You need to add items to your cart before checking out.</p>
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
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-progress">
            <div className={`progress-step ${activeStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Shipping</div>
            </div>
            <div className={`progress-step ${activeStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`progress-step ${activeStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Review</div>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {activeStep === 1 && (
              <div className="checkout-step">
                <h2>Shipping Information</h2>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="step-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="checkout-step">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="payment-info">
                        <h3>Cash on Delivery</h3>
                        <p>Pay when your order is delivered</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="payment-info">
                        <h3>Credit/Debit Card</h3>
                        <p>Pay with your credit or debit card</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="payment-info">
                        <h3>UPI Payment</h3>
                        <p>Pay using UPI apps like PhonePe, Google Pay, Paytm</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="payment-option">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="netbanking"
                        checked={formData.paymentMethod === 'netbanking'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="payment-info">
                        <h3>Net Banking</h3>
                        <p>Pay directly from your bank account</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardName">Name on Card *</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardExpiry">Expiry Date *</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardCvv">CVV *</label>
                        <input
                          type="text"
                          id="cardCvv"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.paymentMethod === 'upi' && (
                  <div className="upi-details">
                    <div className="form-group">
                      <label htmlFor="upiId">UPI ID *</label>
                      <input
                        type="text"
                        id="upiId"
                        name="upiId"
                        placeholder="yourname@upi"
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="upi-info">You will be redirected to your UPI app to complete the payment</p>
                  </div>
                )}
                
                <div className="step-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    Back to Shipping
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 3 && (
              <div className="checkout-step">
                <h2>Review Your Order</h2>
                <div className="order-review">
                  <div className="review-section">
                    <h3>Shipping Address</h3>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                    <p>Phone: {formData.phone}</p>
                  </div>
                  
                  <div className="review-section">
                    <h3>Payment Method</h3>
                    <p>
                      {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       formData.paymentMethod === 'card' ? 'Credit/Debit Card' :
                       formData.paymentMethod === 'upi' ? 'UPI Payment' :
                       'Net Banking'}
                    </p>
                    {formData.paymentMethod === 'card' && (
                      <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                    )}
                  </div>
                  
                  <div className="review-section">
                    <h3>Order Items</h3>
                    <div className="order-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-info">
                            <h4>{item.productName}</h4>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          <div className="item-price">
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="step-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    Back to Payment
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={placeOrder}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-items">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderSummary.subtotal)}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>{orderSummary.shipping === 0 ? 'FREE' : formatCurrency(orderSummary.shipping)}</span>
                </div>
                <div className="summary-item">
                  <span>Tax (18% GST)</span>
                  <span>{formatCurrency(orderSummary.tax)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span>Total</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>
              </div>
              
              <div className="cart-items-preview">
                <h3>Items in your order</h3>
                {cartItems.map(item => (
                  <div key={item.id} className="preview-item">
                    <div className="item-name">
                      {item.productName} × {item.quantity}
                    </div>
                    <div className="item-price">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="secure-checkout">
                <div className="secure-icon">🔒</div>
                <div className="secure-text">
                  <h4>Secure Checkout</h4>
                  <p>Your information is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;