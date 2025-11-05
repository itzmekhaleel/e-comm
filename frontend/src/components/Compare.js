import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/product.service';
import CurrencyService from '../services/currency.service';
import ImageService from '../services/image.service';
import { useToast } from '../contexts/ToastContext';
import './Compare.css';

const Compare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    loadCompareProducts();
  }, []);

  const loadCompareProducts = async () => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    if (compareList.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      // Load all products in the compare list
      const productPromises = compareList.map(id => productService.get(id));
      const productResponses = await Promise.all(productPromises);
      
      const loadedProducts = productResponses.map(response => response.data);
      setProducts(loadedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading compare products:', error);
      addToast('Failed to load comparison products', 'error');
      setLoading(false);
    }
  };

  const removeFromCompare = (productId) => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const newCompareList = compareList.filter(id => id !== productId.toString());
    
    localStorage.setItem('compareList', JSON.stringify(newCompareList));
    setProducts(products.filter(product => product.id !== productId));
    
    if (newCompareList.length === 0) {
      navigate('/products');
    }
    
    addToast('Product removed from comparison', 'info');
  };

  const clearAll = () => {
    localStorage.setItem('compareList', JSON.stringify([]));
    setProducts([]);
    navigate('/products');
    addToast('Comparison list cleared', 'info');
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

  if (loading) {
    return (
      <div className="compare-page">
        <div className="compare-container">
          <div className="loading">Loading comparison...</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="compare-page">
        <div className="compare-container">
          <div className="empty-compare">
            <h2>No Products to Compare</h2>
            <p>You haven't added any products to compare yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate sample products if API fails
  const generateSampleProduct = (index) => {
    return {
      id: index + 1,
      name: `Sample Product ${index + 1}`,
      price: Math.floor(Math.random() * 100000) + 1000,
      category: ["Electronics", "Home & Kitchen", "Sports"][index % 3],
      brand: ["MyKart", "Samsung", "Apple"][index % 3],
      rating: (Math.random() * 1 + 4).toFixed(1),
      discountPercentage: Math.floor(Math.random() * 26) + 5,
      imageUrl: ImageService.generateProductImageUrl(index + 1, "Electronics", `Sample Product ${index + 1}`),
      description: `This is a sample product for comparison purposes.`,
      stockQuantity: Math.floor(Math.random() * 50) + 1,
      model: `Model-${index + 1}`,
      warranty: "1 Year Manufacturer Warranty"
    };
  };

  // Ensure we have at least 2 products for comparison
  const displayProducts = products.length > 0 ? products : 
    Array.from({ length: Math.max(2, products.length) }, (_, i) => generateSampleProduct(i));

  return (
    <div className="compare-page">
      <div className="compare-container">
        <div className="compare-header">
          <h1>Compare Products</h1>
          <div className="compare-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
            >
              Add More Products
            </button>
            <button 
              className="btn btn-outline"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="compare-table-container">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-feature">Feature</th>
                {displayProducts.map(product => (
                  <th key={product.id} className="compare-product-header">
                    <button 
                      className="remove-product"
                      onClick={() => removeFromCompare(product.id)}
                      aria-label="Remove from comparison"
                    >
                      ×
                    </button>
                    <div className="product-image">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    <h3>{product.name}</h3>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="compare-feature">Price</td>
                {displayProducts.map(product => {
                  const discountedPrice = product.discountPercentage && product.discountPercentage > 0
                    ? product.price * (100 - product.discountPercentage) / 100
                    : product.price;
                  
                  return (
                    <td key={`${product.id}-price`} className="compare-value">
                      <div className="price-container">
                        <span className={`current-price ${product.discountPercentage > 0 ? 'discounted' : ''}`}>
                          {formatCurrency(discountedPrice)}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="original-price">
                            <span className="strikethrough">{formatCurrency(product.price)}</span>
                            <span className="discount-badge">{product.discountPercentage}% off</span>
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
              
              <tr>
                <td className="compare-feature">Rating</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-rating`} className="compare-value">
                    <div className="rating-container">
                      <div className="stars">
                        {'★'.repeat(Math.round(product.rating || 4))}
                        {'☆'.repeat(5 - Math.round(product.rating || 4))}
                      </div>
                      <span>{(product.rating || 4).toFixed(1)}</span>
                    </div>
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="compare-feature">Category</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-category`} className="compare-value">
                    {product.category || 'N/A'}
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="compare-feature">Brand</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-brand`} className="compare-value">
                    {product.brand || 'N/A'}
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="compare-feature">Model</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-model`} className="compare-value">
                    {product.model || 'N/A'}
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="compare-feature">Warranty</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-warranty`} className="compare-value">
                    {product.warranty || 'N/A'}
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="compare-feature">Stock</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-stock`} className="compare-value">
                    <span className={product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </td>
                ))}
              </tr>
              
              <tr>
                <td className="compare-feature">Actions</td>
                {displayProducts.map(product => (
                  <td key={`${product.id}-actions`} className="compare-value">
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn btn-outline btn-small"
                        onClick={() => removeFromCompare(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="compare-summary">
          <h2>Comparison Summary</h2>
          <div className="summary-cards">
            {displayProducts.map(product => {
              const discountedPrice = product.discountPercentage && product.discountPercentage > 0
                ? product.price * (100 - product.discountPercentage) / 100
                : product.price;
              
              return (
                <div key={`${product.id}-summary`} className="summary-card">
                  <h3>{product.name}</h3>
                  <div className="summary-price">
                    {formatCurrency(discountedPrice)}
                    {product.discountPercentage > 0 && (
                      <span className="summary-discount">Save {product.discountPercentage}%</span>
                    )}
                  </div>
                  <div className="summary-rating">
                    <div className="stars">
                      {'★'.repeat(Math.round(product.rating || 4))}
                      {'☆'.repeat(5 - Math.round(product.rating || 4))}
                    </div>
                    <span>{(product.rating || 4).toFixed(1)}</span>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    View Product
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;