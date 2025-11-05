import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import cartService from '../services/cart.service';
import { useToast } from '../contexts/ToastContext';
import './Navbar.css';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('India');
  const [cartCount, setCartCount] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const loadCartCount = () => {
    const user = authService.getCurrentUser();
    if (user) {
      cartService.getCart()
        .then(response => {
          if (response.data && response.data.cartItems) {
            const count = response.data.cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
            setCartCount(count);
          }
        })
        .catch(error => {
          console.error('Error loading cart count:', error);
          // Don't dispatch cartUpdated event here to prevent circular dependency
        });
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    
    // Load cart count
    loadCartCount();
    
    // Listen for cart updates
    const handleCartUpdated = () => {
      // Add a small delay to prevent rapid successive calls
      setTimeout(() => {
        loadCartCount();
      }, 100);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdated);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  const logOut = () => {
    authService.logout();
    setCurrentUser(undefined);
    setCartCount(0);
    setShowProfileDropdown(false);
    addToast('You have been logged out successfully', 'info');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const closeProfileDropdown = () => {
    setShowProfileDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if clicked outside
      if (showProfileDropdown && !event.target.closest('.nav-account')) {
        closeProfileDropdown();
      }
      
      // Close location dropdown if clicked outside
      if (showLocationDropdown && !event.target.closest('.nav-location')) {
        setShowLocationDropdown(false);
      }
      
      // Close mega menu if clicked outside
      if (showMegaMenu && !event.target.closest('.categories-container') && !event.target.closest('.mega-menu')) {
        setShowMegaMenu(false);
        setActiveCategory(null);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showProfileDropdown) closeProfileDropdown();
        if (showLocationDropdown) setShowLocationDropdown(false);
        if (showMegaMenu) {
          setShowMegaMenu(false);
          setActiveCategory(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showProfileDropdown, showLocationDropdown, showMegaMenu]);

  // Define locations with their corresponding currencies
  const locations = [
    { name: "India", currency: "INR", symbol: "₹" },
    { name: "United States", currency: "USD", symbol: "$" },
    { name: "United Kingdom", currency: "GBP", symbol: "£" },
    { name: "Canada", currency: "CAD", symbol: "C$" },
    { name: "Australia", currency: "AUD", symbol: "A$" },
    { name: "Germany", currency: "EUR", symbol: "€" },
    { name: "France", currency: "EUR", symbol: "€" },
    { name: "Japan", currency: "JPY", symbol: "¥" },
    { name: "Brazil", currency: "BRL", symbol: "R$" },
    { name: "Mexico", currency: "MXN", symbol: "Mex$" }
  ];

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.name);
    // Store the selected currency in localStorage
    localStorage.setItem('selectedCurrency', JSON.stringify(location));
    setShowLocationDropdown(false);
    
    // Dispatch a custom event to notify other components of currency change
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: location 
    }));
    
    addToast(`Location changed to ${location.name}`, 'info');
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && !searchQuery.trim()) {
      e.preventDefault();
    }
    
    // Allow Escape to clear search and blur
    if (e.key === 'Escape') {
      setSearchQuery('');
      e.target.blur();
    }
  };

  // Mega menu categories and subcategories
  const megaMenuData = {
    "Electronics": [
      "Smartphones", "Laptops", "Tablets", "Cameras", "Headphones", 
      "Smart Watches", "Gaming Consoles", "TV & Home Theater"
    ],
    "Fashion": [
      "Men's Clothing", "Women's Clothing", "Kids Fashion", "Footwear", 
      "Watches", "Jewelry", "Bags & Wallets", "Eyewear"
    ],
    "Home & Kitchen": [
      "Furniture", "Home Decor", "Kitchen Appliances", "Cookware", 
      "Bedding", "Bath", "Storage & Organization", "Lighting"
    ],
    "Sports": [
      "Fitness Equipment", "Team Sports", "Outdoor Activities", 
      "Cycling", "Swimming", "Yoga", "Running", "Tennis"
    ]
  };

  const handleCategoryHover = (category) => {
    setActiveCategory(category);
    setShowMegaMenu(true);
  };

  const handleCategoryLeave = () => {
    // Add a small delay to allow moving to the mega menu
    setTimeout(() => {
      if (!document.querySelector('.mega-menu:hover')) {
        setShowMegaMenu(false);
        setActiveCategory(null);
      }
    }, 300);
  };

  const handleMegaMenuLeave = () => {
    setShowMegaMenu(false);
    setActiveCategory(null);
  };

  // Handle mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          {/* Left section: MyKart logo and location */}
          <div className="nav-left">
            <Link to="/" className="nav-logo" aria-label="MyKart home">
              MyKart
            </Link>
            <div 
              className="nav-location"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowLocationDropdown(!showLocationDropdown);
                }
              }}
              tabIndex="0"
              role="button"
              aria-expanded={showLocationDropdown}
              aria-haspopup="true"
              aria-label="Select delivery location"
            >
              <span className="location-icon">🚚</span>
              <div className="location-text">
                <span className="location-deliver">Deliver to</span>
                <span className="location-name">{selectedLocation}</span>
              </div>
            </div>
            
            {/* Location Dropdown */}
            {showLocationDropdown && (
              <div className="location-dropdown" role="menu">
                <div className="dropdown-header">
                  <h3>Choose your location</h3>
                  <button 
                    className="close-dropdown" 
                    onClick={() => setShowLocationDropdown(false)}
                    aria-label="Close location selection"
                  >
                    ×
                  </button>
                </div>
                <div className="location-options">
                  {locations.map((location, index) => (
                    <div 
                      key={index}
                      className={`location-option ${selectedLocation === location.name ? 'selected' : ''}`}
                      onClick={() => handleLocationSelect(location)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLocationSelect(location);
                        }
                      }}
                      tabIndex="0"
                      role="menuitem"
                    >
                      {location.name} ({location.symbol})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center section: Search bar */}
          <div className="nav-center">
            <form className="search-form" onSubmit={handleSearch}>
              <select className="search-category" aria-label="Search category">
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Fashion</option>
              </select>
              <input
                type="text"
                className={`search-input ${isSearchFocused ? 'focused' : ''}`}
                placeholder="Search MyKart"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search products"
              />
              <button type="submit" className="search-button" aria-label="Search">
                🔍
              </button>
            </form>
          </div>

          {/* Right section: Language, account, and cart */}
          <div className="nav-right">
            <div className="nav-language">
              <span className="language-icon">🌐</span>
              <select className="language-select" aria-label="Select language">
                <option>EN</option>
                <option>HI</option>
                <option>TA</option>
              </select>
            </div>

            {currentUser ? (
              <div className="nav-account">
                <div 
                  className="account-link"
                  onClick={toggleProfileDropdown}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleProfileDropdown();
                    }
                  }}
                  tabIndex="0"
                  role="button"
                  aria-expanded={showProfileDropdown}
                  aria-haspopup="true"
                  aria-label="Account menu"
                >
                  <div className="account-info">
                    <span className="account-greeting">Hello, {currentUser.firstName}</span>
                    <span className="account-label">Account & Lists</span>
                  </div>
                </div>
                
                {/* Profile Dropdown */}
                {showProfileDropdown && (
                  <div className="profile-dropdown" role="menu">
                    <div className="profile-dropdown-header">
                      <div className="profile-user-info">
                        <div className="profile-user-name">{currentUser.firstName} {currentUser.lastName}</div>
                        <div className="profile-user-email">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="profile-dropdown-content">
                      <div className="profile-section">
                        <h3>Your Account</h3>
                        <Link to="/profile" className="profile-dropdown-link" onClick={closeProfileDropdown}>
                          <span className="link-icon">👤</span> Your Profile
                        </Link>
                        <Link to="/orders" className="profile-dropdown-link" onClick={closeProfileDropdown}>
                          <span className="link-icon">📦</span> Your Orders
                        </Link>
                        <Link to="/wishlist" className="profile-dropdown-link" onClick={closeProfileDropdown}>
                          <span className="link-icon">❤️</span> Your Wish List
                        </Link>
                      </div>
                      <div className="profile-section">
                        <h3>Customer Service</h3>
                        <button className="profile-dropdown-link" onClick={(e) => {
                          e.preventDefault();
                          addToast('Help & Support coming soon!', 'info');
                        }}>
                          <span className="link-icon">❓</span> Help & Support
                        </button>
                        <button className="profile-dropdown-link" onClick={(e) => {
                          e.preventDefault();
                          addToast('Returns & Refunds coming soon!', 'info');
                        }}>
                          <span className="link-icon">↩️</span> Returns & Refunds
                        </button>
                      </div>
                      <div className="profile-divider"></div>
                      <button className="logout-button" onClick={logOut}>
                        <span className="link-icon">🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-account">
                <Link to="/login" className="account-link">
                  <div className="account-info">
                    <span className="account-greeting">Hello, Sign in</span>
                    <span className="account-label">Account & Lists</span>
                  </div>
                </Link>
              </div>
            )}

            <Link to="/cart" className="nav-cart" aria-label={`Shopping cart with ${cartCount} items`}>
              <div className="cart-icon">🛒</div>
              <span className="cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
            
            {/* Mobile menu toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Secondary Navbar with Categories */}
      <nav className={`secondary-navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`} role="navigation" aria-label="Product categories">
        <div className="categories-container">
          {Object.keys(megaMenuData).map((category, index) => (
            <Link 
              to={`/products?category=${encodeURIComponent(category)}`} 
              className="category-link" 
              key={index}
              onMouseEnter={() => handleCategoryHover(category)}
              onMouseLeave={handleCategoryLeave}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {category}
            </Link>
          ))}
          <Link to="/products?category=Deals" className="category-link" onClick={() => setIsMobileMenuOpen(false)}>Deals</Link>
          <Link to="/products?category=Best Sellers" className="category-link" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers</Link>
        </div>
        
        {/* Mega Menu */}
        {showMegaMenu && activeCategory && megaMenuData[activeCategory] && (
          <div 
            className={`mega-menu ${showMegaMenu ? 'visible' : ''}`}
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="mega-menu-content">
              {Object.entries(megaMenuData).map(([category, subcategories]) => (
                <div 
                  className="mega-menu-column" 
                  key={category}
                  style={{ display: category === activeCategory ? 'block' : 'none' }}
                >
                  <h3>{category}</h3>
                  <div className="mega-menu-links">
                    {subcategories.map((subcategory, index) => (
                      <Link 
                        to={`/products?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`} 
                        className="mega-menu-link" 
                        key={index}
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveCategory(null);
                        }}
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;