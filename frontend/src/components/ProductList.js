import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import productService from '../services/product.service';
import cartItemService from '../services/cart-item.service';
import CurrencyService from '../services/currency.service';
import ImageService from '../services/image.service';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  /**
   * Load products from backend
   */
  const loadProducts = useCallback((sortBy = null, sortDirection = null) => {
    setLoading(true);
    productService.getAll(sortBy, sortDirection)
      .then(response => {
        if (response && response.data) {
          const productsData = Array.isArray(response.data) ? response.data : [];
          setProducts(productsData);
        } else {
          const sampleProducts = generateSampleProducts();
          setProducts(sampleProducts);
          addToast('Failed to load products from server. Showing sample data.', 'warning');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading products:', error);
        const sampleProducts = generateSampleProducts();
        setProducts(sampleProducts);
        addToast('Failed to load products from server. Showing sample data.', 'warning');
        setLoading(false);
      });
  }, [addToast]);

  /**
   * Load categories for filter dropdown
   */
  const loadCategories = () => {
    const sampleCategories = [
      "Electronics", "Home & Kitchen", "Sports", "Books", 
      "Fashion", "Beauty", "Toys", "Automotive"
    ];
    setCategories(sampleCategories);
  };

  /**
   * Load brands for filter dropdown
   */
  const loadBrands = () => {
    const sampleBrands = [
      "MyKart", "Samsung", "Apple", "Nike", "Adidas", 
      "Sony", "KitchenAid", "Levi's", "Patagonia"
    ];
    setBrands(sampleBrands);
  };

  /**
   * Search products
   */
  const searchProducts = useCallback((query, sortBy = null, sortDirection = null) => {
    setLoading(true);
    productService.search(query, sortBy, sortDirection)
      .then(response => {
        if (response && response.data) {
          const productsData = Array.isArray(response.data) ? response.data : [];
          setProducts(productsData);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error searching products:', error);
        setLoading(false);
        addToast('Search failed. Please try again.', 'error');
      });
  }, [addToast]);

  /**
   * Filter products by category
   */
  const filterProductsByCategory = useCallback((category, sortBy = null, sortDirection = null) => {
    if (!category) {
      loadProducts(sortBy, sortDirection);
      return;
    }
    
    setLoading(true);
    productService.getByCategory(category, sortBy, sortDirection)
      .then(response => {
        if (response && response.data) {
          const productsData = Array.isArray(response.data) ? response.data : [];
          setProducts(productsData);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error filtering products:', error);
        setLoading(false);
        addToast('Failed to filter products. Please try again.', 'error');
      });
  }, [addToast, loadProducts]);

  /**
   * Load products and categories on component mount
   */
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
      searchProducts(searchQuery);
    } else if (categoryQuery) {
      setCategoryFilter(categoryQuery);
      filterProductsByCategory(categoryQuery);
    } else {
      if (products.length === 0) {
        loadProducts();
      }
    }
    
    if (categories.length === 0) {
      loadCategories();
    }
    if (brands.length === 0) {
      loadBrands();
    }
  }, [searchParams, searchProducts, filterProductsByCategory, loadProducts, products.length, categories.length, brands.length]);

  /**
   * Handle search form submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === '') {
      loadProducts();
      return;
    }
    searchProducts(searchTerm);
    setCurrentPage(1);
  };

  /**
   * Handle search input focus
   */
  const handleSearchFocus = (e) => {
    e.target.select();
  };

  /**
   * Handle search key down
   */
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && !searchTerm.trim()) {
      e.preventDefault();
    }
  };

  /**
   * Handle category filter change
   */
  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
    
    let sortBy = null;
    let sortDirection = null;
    
    if (sortOption) {
      const [sortField, direction] = sortOption.split('-');
      sortBy = sortField;
      sortDirection = direction;
    }
    
    filterProductsByCategory(category, sortBy, sortDirection);
    setCurrentPage(1);
  };

  /**
   * Handle sort option change
   */
  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);
    
    let sortBy = null;
    let sortDirection = null;
    
    if (option) {
      const [sortField, direction] = option.split('-');
      sortBy = sortField;
      sortDirection = direction;
    }
    
    if (categoryFilter) {
      filterProductsByCategory(categoryFilter, sortBy, sortDirection);
    } else if (searchTerm) {
      searchProducts(searchTerm, sortBy, sortDirection);
    } else {
      loadProducts(sortBy, sortDirection);
    }
  };

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 100000 });
    setCategoryFilter('');
    setSearchTerm('');
    setSortOption('');
    setCurrentPage(1);
    addToast('Filters reset', 'info');
  };

  /**
   * Generate sample products for fallback
   */
  const generateSampleProducts = () => {
    const productData = [
      { name: "iPhone 15 Pro", category: "Electronics", price: 129999, brand: "Apple", discount: 15, rating: 4.5, reviews: 1245 },
      { name: "Samsung Galaxy S24", category: "Electronics", price: 99999, brand: "Samsung", discount: 12, rating: 4.3, reviews: 980 },
      { name: "MacBook Air M2", category: "Electronics", price: 119999, brand: "Apple", discount: 10, rating: 4.7, reviews: 2100 },
      { name: "Dell XPS 13", category: "Electronics", price: 89999, brand: "Dell", discount: 8, rating: 4.2, reviews: 650 },
      { name: "Sony WH-1000XM5", category: "Electronics", price: 29999, brand: "Sony", discount: 20, rating: 4.6, reviews: 1800 }
    ];

    return Array.from({ length: 5 }, (_, i) => {
      const productInfo = productData[i % productData.length];
      
      const productId = i + 1;
      const imageUrl = ImageService.generateProductImageUrl(productId, productInfo.category, productInfo.name);
      
      return {
        id: productId,
        name: productInfo.name,
        description: `High-quality ${productInfo.name} with excellent features and durability.`,
        price: productInfo.price,
        discountedPrice: Math.round(productInfo.price * (100 - productInfo.discount) / 100),
        discountPercentage: productInfo.discount,
        category: productInfo.category,
        brand: productInfo.brand,
        rating: productInfo.rating,
        reviewCount: productInfo.reviews,
        imageUrl: imageUrl,
        stockQuantity: Math.floor(Math.random() * 50) + 1
      };
    });
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
   * Handle add to cart
   */
  const handleAddToCart = async (productId, productName) => {
    console.log('Attempting to add product to cart:', productId, productName);
    
    try {
      // Set loading state for this specific product
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const updatedProducts = [...products];
        updatedProducts[productIndex].addingToCart = true;
        setProducts(updatedProducts);
      }
      
      // Add item to cart
      const response = await cartItemService.addToCart(productId, 1);
      
      // Reset loading state and update button state
      const productIndexAfter = products.findIndex(p => p.id === productId);
      if (productIndexAfter !== -1) {
        const updatedProducts = [...products];
        updatedProducts[productIndexAfter].addingToCart = false;
        updatedProducts[productIndexAfter].inCart = true;
        setProducts(updatedProducts);
      }
      
      // Show success message
      if (response) {
        addToast(`${productName} added to cart successfully!`, 'success');
        // Dispatch a custom event to notify other components (like navbar) about cart update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Reset loading state
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const updatedProducts = [...products];
        updatedProducts[productIndex].addingToCart = false;
        setProducts(updatedProducts);
      }
      
      // Show error message with proper formatting
      let errorMessage = 'Failed to add item to cart';
      if (error && error.message) {
        errorMessage = error.message;
      } else if (error) {
        errorMessage = error.toString();
      }
      
      addToast(`Failed to add ${productName} to cart: ${errorMessage}`, 'error');
    }
  };

  /**
   * Handle go to cart
   */
  const handleGoToCart = () => {
    navigate('/cart');
  };

  /**
   * Render the component
   */
  return (
    <div className="product-list">
      <div className="product-list-container">
        {/* Header with search and filters */}
        <div className="product-list-header">
          <h1>Products</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onFocus={handleSearchFocus}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          <button 
            className="reset-filters-btn"
            onClick={resetFilters}
            aria-label="Reset all filters"
          >
            Reset Filters
          </button>
        </div>

        {/* Filters and Sorting */}
        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select 
              id="category-filter"
              value={categoryFilter}
              onChange={handleCategoryFilter}
              className="filter-select"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="brand-filter">Brand:</label>
            <select 
              id="brand-filter"
              value={selectedBrands[0] || ''}
              onChange={(e) => setSelectedBrands(e.target.value ? [e.target.value] : [])}
              className="filter-select"
              aria-label="Filter by brand"
            >
              <option value="">All Brands</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-group sort-options">
            <label htmlFor="sort-filter">Sort By:</label>
            <select 
              id="sort-filter"
              value={sortOption}
              onChange={handleSort}
              className="filter-select"
              aria-label="Sort products"
            >
              <option value="">Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="discount-desc">Discount (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Products grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="products-info">
              <p>Showing {products.length} product{products.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`}>
                    <div className="product-image">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                      {product.discountPercentage > 0 && (
                        <div className="discount-badge">{product.discountPercentage}% off</div>
                      )}
                      <div className="rating-badge">
                        <span className="stars">★</span> {product.rating.toFixed(1)}
                      </div>
                    </div>
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">
                      <span className="current-price">{formatCurrency(product.discountedPrice)}</span>
                      {product.discountPercentage > 0 && (
                        <span className="original-price">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                    <div className="product-reviews">
                      ({product.reviewCount} reviews)
                    </div>
                  </Link>
                  <button 
                    className="add-to-cart-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (product.inCart) {
                        handleGoToCart();
                      } else {
                        handleAddToCart(product.id, product.name);
                      }
                    }}
                    disabled={product.addingToCart || (product.stockQuantity || 0) === 0}
                    aria-label={product.inCart ? `Go to cart with ${product.name}` : `Add ${product.name} to cart`}
                  >
                    {(product.stockQuantity || 0) === 0 ? 'Out of Stock' : 
                     (product.addingToCart ? 'Adding...' : 
                     (product.inCart ? 'Go to Cart' : 'Add to Cart'))}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No results state */}
        {!loading && products.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;