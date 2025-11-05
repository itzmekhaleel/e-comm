import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CurrencyService from '../services/currency.service';
import ImageService from '../services/image.service';
import LoadingSpinner from './LoadingSpinner';
import './Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deals, setDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(CurrencyService.getSelectedCurrency());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate sample data for different sections
    generateSampleData();
    
    // Listen for currency change events
    const handleCurrencyChange = (event) => {
      setSelectedCurrency(event.detail);
    };
    
    window.addEventListener('currencyChange', handleCurrencyChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  const generateSampleData = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API loading delay
    setTimeout(() => {
      try {
        // Sample deals data with product-specific images using ImageService
        const dealsData = [
          { id: 1, name: "iPhone 15 Pro", price: 129999, originalPrice: 139999, discount: "7% off", imageUrl: ImageService.generateProductImageUrl(1, "Electronics", "iPhone 15 Pro"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 2, name: "Samsung Galaxy S24", price: 99999, originalPrice: 109999, discount: "9% off", imageUrl: ImageService.generateProductImageUrl(2, "Electronics", "Samsung Galaxy S24"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 3, name: "MacBook Air M2", price: 119999, originalPrice: 129999, discount: "8% off", imageUrl: ImageService.generateProductImageUrl(3, "Electronics", "MacBook Air M2"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 4, name: "Sony WH-1000XM5", price: 29999, originalPrice: 34999, discount: "14% off", imageUrl: ImageService.generateProductImageUrl(4, "Electronics", "Sony WH-1000XM5"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 5, name: "iPad Pro 12.9", price: 109999, originalPrice: 119999, discount: "8% off", imageUrl: ImageService.generateProductImageUrl(5, "Electronics", "iPad Pro 12.9"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 6, name: "Apple Watch Series 9", price: 49999, originalPrice: 54999, discount: "9% off", imageUrl: ImageService.generateProductImageUrl(6, "Electronics", "Apple Watch Series 9"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 7, name: "Nintendo Switch", price: 24999, originalPrice: 29999, discount: "17% off", imageUrl: ImageService.generateProductImageUrl(7, "Electronics", "Nintendo Switch"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 8, name: "Instant Pot Duo", price: 9999, originalPrice: 12999, discount: "23% off", imageUrl: ImageService.generateProductImageUrl(8, "Home & Kitchen", "Instant Pot Duo"), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 }
        ];
        
        // Sample best sellers data with product-specific images using ImageService
        const bestSellerData = [
          { id: 1, name: "KitchenAid Mixer", price: 34999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 1245, imageUrl: ImageService.generateProductImageUrl(11, "Home & Kitchen", "KitchenAid Mixer") },
          { id: 2, name: "Nike Air Max", price: 12999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 876, imageUrl: ImageService.generateProductImageUrl(12, "Fashion", "Nike Air Max") },
          { id: 3, name: "Levi's Jeans", price: 3999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 2103, imageUrl: ImageService.generateProductImageUrl(13, "Fashion", "Levi's Jeans") },
          { id: 4, name: "Dumbbell Set", price: 14999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 567, imageUrl: ImageService.generateProductImageUrl(14, "Sports", "Dumbbell Set") },
          { id: 5, name: "Harry Potter Set", price: 2999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 3421, imageUrl: ImageService.generateProductImageUrl(15, "Books", "Harry Potter Set") },
          { id: 6, name: "Face Cream", price: 2999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 987, imageUrl: ImageService.generateProductImageUrl(16, "Beauty", "Face Cream") },
          { id: 7, name: "Board Game", price: 2999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 432, imageUrl: ImageService.generateProductImageUrl(17, "Toys", "Board Game") },
          { id: 8, name: "Car Battery", price: 7999, rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: 654, imageUrl: ImageService.generateProductImageUrl(18, "Automotive", "Car Battery") }
        ];
        
        // Sample trending data with product-specific images using ImageService
        const trendingData = [
          { id: 1, name: "Dell XPS 13", price: 89999, originalPrice: 99999, discount: "10% off", imageUrl: ImageService.generateProductImageUrl(21, "Electronics", "Dell XPS 13"), tag: "Hot Deal", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 2, name: "Patagonia Jacket", price: 19999, originalPrice: 24999, discount: "20% off", imageUrl: ImageService.generateProductImageUrl(22, "Fashion", "Patagonia Jacket"), tag: "New Arrival", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 3, name: "Robot Vacuum", price: 29999, originalPrice: 39999, discount: "25% off", imageUrl: ImageService.generateProductImageUrl(23, "Home & Kitchen", "Robot Vacuum"), tag: "Limited Stock", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 4, name: "Coffee Maker", price: 8999, originalPrice: 11999, discount: "25% off", imageUrl: ImageService.generateProductImageUrl(24, "Home & Kitchen", "Coffee Maker"), tag: "Best Seller", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 5, name: "Running Shoes", price: 7999, originalPrice: 9999, discount: "20% off", imageUrl: ImageService.generateProductImageUrl(25, "Sports", "Running Shoes"), tag: "Trending", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 6, name: "Vitamix Blender", price: 19999, originalPrice: 24999, discount: "20% off", imageUrl: ImageService.generateProductImageUrl(26, "Home & Kitchen", "Vitamix Blender"), tag: "Top Rated", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 7, name: "Tennis Racket", price: 8999, originalPrice: 11999, discount: "25% off", imageUrl: ImageService.generateProductImageUrl(27, "Sports", "Tennis Racket"), tag: "Sale", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 },
          { id: 8, name: "Smart TV 55\"", price: 59999, originalPrice: 69999, discount: "14% off", imageUrl: ImageService.generateProductImageUrl(28, "Electronics", "Smart TV 55\""), tag: "Clearance", rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), reviewCount: Math.floor(Math.random() * 1000) + 100 }
        ];
        
        // Sample categories
        const categoriesData = [
          { name: "Electronics", icon: "📱", id: "electronics" },
          { name: "Fashion", icon: "👕", id: "fashion" },
          { name: "Home & Kitchen", icon: "🏠", id: "home" },
          { name: "Sports", icon: "⚽", id: "sports" },
          { name: "Books", icon: "📚", id: "books" },
          { name: "Beauty", icon: "💄", id: "beauty" },
          { name: "Toys", icon: "🧸", id: "toys" },
          { name: "Automotive", icon: "🚗", id: "automotive" }
        ];
        
        setDeals(dealsData);
        setBestSellers(bestSellerData);
        setTrending(trendingData);
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load home page data. Please try again.');
        setIsLoading(false);
      }
    }, 800); // Simulate network delay
  };

  const formatCurrency = (amount) => {
    // Convert from INR to selected currency
    const convertedAmount = CurrencyService.convertFromINR(amount);
    return CurrencyService.formatCurrency(convertedAmount);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchFocus = (e) => {
    e.target.select();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && !searchTerm.trim()) {
      e.preventDefault();
    }
  };

  const scrollLeft = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading home page..." />;
  }

  if (error) {
    return (
      <div className="home-error">
        <div className="error-content">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={generateSampleData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Banner */}
        <div className="hero-banner">
          <div className="hero-content">
            <h1>Great Deals Await You</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <Link to="/products" className="hero-button">Shop Now</Link>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="home-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onFocus={handleSearchFocus}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
        
        {/* Categories Section */}
        <div className="section categories-section">
          <div className="section-header">
            <h2>Shop by Category</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="category-card" key={index}>
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Deals of the Day */}
        <div className="section">
          <div className="section-header">
            <h2>Deals of the Day</h2>
            <Link to="/products?category=deals" className="view-all">See all deals</Link>
          </div>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={() => scrollLeft('deals-section')} aria-label="Scroll left">
              ‹
            </button>
            <div className="products-scroll" id="deals-section">
              {deals.map(deal => (
                <div key={deal.id} className="product-card">
                  <Link to={`/products/${deal.id}`}>
                    <div className="product-image">
                      <img 
                        src={deal.imageUrl} 
                        alt={deal.name} 
                        onError={(e) => {
                          e.target.src = '/images/placeholder.svg';
                        }}
                      />
                      <div className="discount-badge">{deal.discount}</div>
                      <div className="rating-badge">
                        <span className="stars">★</span> {deal.rating.toFixed(1)}
                      </div>
                    </div>
                    <h3>{deal.name}</h3>
                    <div className="product-price">
                      <span className="current-price">{formatCurrency(deal.price)}</span>
                      <span className="original-price">{formatCurrency(deal.originalPrice)}</span>
                    </div>
                    <div className="review-count">
                      ({deal.reviewCount} reviews)
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollRight('deals-section')} aria-label="Scroll right">
              ›
            </button>
          </div>
        </div>
        
        {/* Best Sellers */}
        <div className="section">
          <div className="section-header">
            <h2>Best Sellers</h2>
            <Link to="/products?category=bestsellers" className="view-all">See all best sellers</Link>
          </div>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={() => scrollLeft('bestsellers-section')} aria-label="Scroll left">
              ‹
            </button>
            <div className="products-scroll" id="bestsellers-section">
              {bestSellers.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`}>
                    <div className="product-image">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        onError={(e) => {
                          e.target.src = '/images/placeholder.svg';
                        }}
                      />
                      <div className="rating-badge">
                        <span className="stars">★</span> {product.rating.toFixed(1)}
                      </div>
                    </div>
                    <h3>{product.name}</h3>
                    <div className="product-price">
                      <span className="current-price">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="review-count">
                      ({product.reviewCount} reviews)
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollRight('bestsellers-section')} aria-label="Scroll right">
              ›
            </button>
          </div>
        </div>
        
        {/* Trending Now */}
        <div className="section">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/products?category=trending" className="view-all">See all trending</Link>
          </div>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={() => scrollLeft('trending-section')} aria-label="Scroll left">
              ‹
            </button>
            <div className="products-scroll" id="trending-section">
              {trending.map(item => (
                <div key={item.id} className="product-card">
                  <Link to={`/products/${item.id}`}>
                    <div className="product-image">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        onError={(e) => {
                          e.target.src = '/images/placeholder.svg';
                        }}
                      />
                      <div className="discount-badge">{item.discount}</div>
                      <div className="tag-badge">{item.tag}</div>
                      <div className="rating-badge">
                        <span className="stars">★</span> {item.rating.toFixed(1)}
                      </div>
                    </div>
                    <h3>{item.name}</h3>
                    <div className="product-price">
                      <span className="current-price">{formatCurrency(item.price)}</span>
                      <span className="original-price">{formatCurrency(item.originalPrice)}</span>
                    </div>
                    <div className="review-count">
                      ({item.reviewCount} reviews)
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scrollRight('trending-section')} aria-label="Scroll right">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;