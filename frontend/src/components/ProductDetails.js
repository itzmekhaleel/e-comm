import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/product.service';
import cartItemService from '../services/cart-item.service';
import CurrencyService from '../services/currency.service';
import ImageService from '../services/image.service';
import authService from '../services/auth.service';
import { useToast } from '../contexts/ToastContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const { addToast } = useToast();

  useEffect(() => {
    console.log('Product ID from URL params:', id);
    loadProduct();
    loadRelatedProducts();
    
    // Listen for currency change events
    const handleCurrencyChange = (event) => {
      // Handle currency change if needed
    };
    
    window.addEventListener('currencyChange', handleCurrencyChange);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, [id]);

  const loadProduct = () => {
    if (!id) {
      console.error('No product ID provided');
      setLoading(false);
      return;
    }
    
    // Convert ID to number if it's a string
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(productId)) {
      console.error('Invalid product ID:', id);
      setLoading(false);
      return;
    }
    
    console.log('Fetching product with ID:', productId);
    
    // First try to get from API
    productService.get(productId)
      .then(response => {
        console.log('Product data received from API:', response.data);
        if (response.data && response.data.id) {
          setProduct(response.data);
          setLoading(false);
        } else {
          // If API doesn't return valid data, use fallback
          console.log('API returned invalid data, using fallback');
          generateFallbackProduct(productId);
        }
      })
      .catch(error => {
        console.error('Error loading product from API:', error);
        // If API fails, use fallback
        generateFallbackProduct(productId);
      });
  };

  const loadRelatedProducts = () => {
    if (!id) return;
    
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    // First get the current product to determine its category
    productService.get(productId)
      .then(response => {
        if (response.data && response.data.category) {
          // Get related products from the same category (excluding the current product)
          productService.getByCategory(response.data.category)
            .then(productsResponse => {
              // Filter out the current product and limit to 8 related products
              const related = productsResponse.data
                .filter(p => p.id !== productId)
                .slice(0, 8);
              setRelatedProducts(related);
            })
            .catch(error => {
              console.error('Error loading related products:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error loading product for related products:', error);
      });
  };

  const generateFallbackProduct = (productId) => {
    console.log('Using fallback product data for ID:', productId);
    // Create a fallback product object
    const fallbackProduct = {
      id: productId,
      name: `Product ${productId}`,
      description: `This is a sample product with ID ${productId}. High-quality materials and construction. Built for durability and long-lasting use. Designed for optimal performance. Comes with manufacturer warranty.`,
      price: Math.floor(Math.random() * 100000) + 1000,
      category: "Electronics",
      imageUrl: ImageService.generateProductImageUrl(productId, "Electronics", `Product ${productId}`),
      stockQuantity: Math.floor(Math.random() * 50) + 1,
      brand: "MyKart",
      model: `Model-${productId}`,
      warranty: "1 Year Manufacturer Warranty",
      rating: (Math.random() * 1 + 4).toFixed(1), // Rating between 4.0 and 5.0
      discountPercentage: Math.floor(Math.random() * 26) + 5 // Random discount between 5-30%
    };
    
    setProduct(fallbackProduct);
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    // Convert from INR to selected currency
    const convertedAmount = CurrencyService.convertFromINR(amount);
    return CurrencyService.formatCurrency(convertedAmount);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      addToast('Please login to add items to cart', 'warning');
      navigate('/login');
      return;
    }
    
    // Check stock availability
    if ((product.stockQuantity || 0) === 0) {
      addToast('This product is currently out of stock', 'error');
      return;
    }
    
    // Validate quantity
    if (quantity < 1 || quantity > (product.stockQuantity || 10)) {
      addToast(`Please select a quantity between 1 and ${product.stockQuantity || 10}`, 'warning');
      return;
    }
    
    // Set loading state
    setAddingToCart(true);
    
    cartItemService.addToCart(product.id, quantity)
      .then(response => {
        // Reset loading state
        setAddingToCart(false);
        
        // Show success message
        addToast(`${quantity} ${product.name}(s) added to cart successfully!`, 'success');
        
        // Dispatch a custom event to notify other components (like navbar) about cart update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        
        // Reset loading state
        setAddingToCart(false);
        
        // Show error message
        addToast(`Failed to add ${product.name} to cart. Please try again.`, 'error');
      });
  };

  const handleBuyNow = () => {
    // In a real application, this would redirect to checkout
    addToast('Proceeding to checkout...', 'info');
    setTimeout(() => {
      alert('Redirecting to checkout page...');
    }, 1000);
  };

  const handleRelatedProductClick = (productId) => {
    // Navigate to the clicked related product
    navigate(`/products/${productId}`);
    // Scroll to top to show the new product
    window.scrollTo(0, 0);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stockQuantity || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="product-details loading">Loading product details...</div>;
  }

  // Always render product details, even with fallback data
  if (!product) {
    return (
      <div className="product-details">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <p>Product ID: {id}</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Calculate discounted price if there's a discount
  const discountedPrice = product.discountPercentage && product.discountPercentage > 0
    ? product.price * (100 - product.discountPercentage) / 100
    : product.price;

  // Generate additional images for the product gallery using ImageService
  const productImages = ImageService.generateGalleryImages(
    product.id, 
    product.category, 
    product.name
  );

  return (
    <div className="product-details">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/products">Products</Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>
      
      <div className="product-details-container" tabIndex="-1">
        {/* Product Images Section */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              onError={(e) => {
                e.target.src = '/images/placeholder.png';
              }}
            />
            {product.discountPercentage && product.discountPercentage > 0 && (
              <div className="discount-badge-large">
                {product.discountPercentage}% OFF
              </div>
            )}
          </div>
          <div className="thumbnail-images">
            {productImages.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${product.name} ${index + 1}`}
                className={selectedImage === index ? 'selected' : ''}
                onClick={() => setSelectedImage(index)}
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Product Information Section */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <div className="product-rating">
            <div className="stars">
              {product.rating ? (
                <>
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </>
              ) : (
                '★★★★☆'
              )}
            </div>
            <span className="rating-count">({product.rating ? product.rating.toFixed(1) : '4.0'} ratings)</span>
          </div>
          
          {/* Price Section with Discount */}
          <div className="price-section">
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <>
                <p className="product-price discounted">
                  {formatCurrency(discountedPrice)}
                  <span className="discount-percentage"> ({product.discountPercentage}% off)</span>
                </p>
                <p className="original-price">
                  M.R.P.: <span className="strikethrough">{formatCurrency(product.price)}</span>
                </p>
                <p className="savings">
                  You Save: {formatCurrency(product.price - discountedPrice)}
                </p>
              </>
            ) : (
              <p className="product-price">{formatCurrency(product.price)}</p>
            )}
          </div>
          
          <div className="product-highlights">
            <h3>Product Highlights</h3>
            <ul>
              <li>High-quality materials and construction</li>
              <li>Built for durability and long-lasting use</li>
              <li>Designed for optimal performance</li>
              <li>Comes with manufacturer warranty</li>
            </ul>
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-specifications">
            <h3>Specifications</h3>
            <table>
              <tbody>
                <tr>
                  <td>Brand</td>
                  <td>{product.brand || 'MyKart'}</td>
                </tr>
                <tr>
                  <td>Model</td>
                  <td>{product.model || product.name.replace(/\s+/g, '-')}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td>Warranty</td>
                  <td>{product.warranty || '1 Year Manufacturer Warranty'}</td>
                </tr>
                <tr>
                  <td>Availability</td>
                  <td>{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stockQuantity || 10}
                  className="quantity-input"
                  aria-label="Quantity"
                />
                <button 
                  className="quantity-btn"
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.stockQuantity || 10)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={(product.stockQuantity || 0) === 0 || addingToCart}
              aria-label="Add to cart"
            >
              {(product.stockQuantity || 0) === 0 ? 'Out of Stock' : (addingToCart ? 'Adding to Cart...' : 'Add to Cart')}
            </button>
            
            <button 
              className="buy-now-btn" 
              onClick={handleBuyNow}
              disabled={(product.stockQuantity || 0) === 0}
            >
              Buy Now
            </button>
          </div>
          
          {(product.stockQuantity || 0) > 0 ? (
            <p className="stock-info">
              In Stock: {product.stockQuantity} available
            </p>
          ) : (
            <p className="stock-info out-of-stock">
              Currently unavailable
            </p>
          )}
        </div>
      </div>
      
      {/* Product Information Tabs */}
      <div className="product-info-tabs">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h2>Product Description</h2>
              <p>
                {product.description} This premium {product.name} offers exceptional quality and performance. 
                Designed with the user in mind, it provides a seamless experience for all your needs. 
                Crafted with attention to detail, this product is built to last and deliver consistent results.
              </p>
              <p>
                Whether you're a professional or a casual user, this {product.name} is perfect for enhancing 
                your daily routine. With its innovative features and reliable construction, you can trust 
                it to perform when it matters most.
              </p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="tab-pane">
              <h2>Product Specifications</h2>
              <table className="specifications-table">
                <tbody>
                  <tr>
                    <td>Brand</td>
                    <td>{product.brand || 'MyKart'}</td>
                  </tr>
                  <tr>
                    <td>Model</td>
                    <td>{product.model || product.name.replace(/\s+/g, '-')}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td>Warranty</td>
                    <td>{product.warranty || '1 Year Manufacturer Warranty'}</td>
                  </tr>
                  <tr>
                    <td>Availability</td>
                    <td>{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="tab-pane">
              <h2>Customer Reviews</h2>
              <div className="reviews-summary">
                <div className="rating-summary">
                  <div className="average-rating">{product.rating ? product.rating.toFixed(1) : '4.0'}</div>
                  <div className="stars">
                    {product.rating ? (
                      <>
                        {'★'.repeat(Math.round(product.rating))}
                        {'☆'.repeat(5 - Math.round(product.rating))}
                      </>
                    ) : (
                      '★★★★☆'
                    )}
                  </div>
                  <div className="review-count">{product.reviewCount || 1245} reviews</div>
                </div>
              </div>
              
              <div className="reviews-list">
                <div className="review">
                  <div className="review-header">
                    <span className="reviewer-name">Rahul Sharma</span>
                    <div className="stars">★★★★★</div>
                  </div>
                  <p className="review-date">October 15, 2025</p>
                  <p className="review-text">
                    Excellent product! Exactly what I was looking for. The quality is outstanding 
                    and it arrived earlier than expected. Highly recommended!
                  </p>
                </div>
                
                <div className="review">
                  <div className="review-header">
                    <span className="reviewer-name">Priya Patel</span>
                    <div className="stars">★★★★☆</div>
                  </div>
                  <p className="review-date">October 5, 2025</p>
                  <p className="review-text">
                    Very satisfied with my purchase. The product works as described and the build 
                    quality is good. Will buy again from this seller.
                  </p>
                </div>
                
                <div className="review">
                  <div className="review-header">
                    <span className="reviewer-name">Amit Kumar</span>
                    <div className="stars">★★★★★</div>
                  </div>
                  <p className="review-date">September 28, 2025</p>
                  <p className="review-text">
                    Outstanding value for money. The product exceeded my expectations in terms of 
                    quality and performance. The delivery was also very prompt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => {
              // Calculate discounted price if there's a discount
              const relatedDiscountedPrice = relatedProduct.discountPercentage && relatedProduct.discountPercentage > 0
                ? relatedProduct.price * (100 - relatedProduct.discountPercentage) / 100
                : relatedProduct.price;
              
              return (
                <div 
                  key={relatedProduct.id} 
                  className="related-product-card"
                  onClick={() => handleRelatedProductClick(relatedProduct.id)}
                >
                  <div className="related-product-image">
                    <img 
                      src={relatedProduct.imageUrl || ImageService.generateProductImageUrl(
                        relatedProduct.id, 
                        relatedProduct.category, 
                        relatedProduct.name
                      )} 
                      alt={relatedProduct.name}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                    {relatedProduct.discountPercentage && relatedProduct.discountPercentage > 0 && (
                      <div className="related-discount-badge">
                        {relatedProduct.discountPercentage}% off
                      </div>
                    )}
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-name">{relatedProduct.name}</h3>
                    <p className="related-product-category">{relatedProduct.category}</p>
                    <div className="related-product-rating">
                      <div className="stars">
                        {relatedProduct.rating ? (
                          <>
                            {'★'.repeat(Math.round(relatedProduct.rating))}
                            {'☆'.repeat(5 - Math.round(relatedProduct.rating))}
                          </>
                        ) : (
                          '★★★★☆'
                        )}
                      </div>
                      <span className="rating-count">({relatedProduct.rating ? relatedProduct.rating.toFixed(1) : '4.0'})</span>
                    </div>
                    <div className="related-product-price-container">
                      {relatedProduct.discountPercentage && relatedProduct.discountPercentage > 0 ? (
                        <>
                          <p className="related-product-price discounted">
                            {formatCurrency(relatedDiscountedPrice)}
                          </p>
                          <p className="related-original-price">
                            <span className="strikethrough">{formatCurrency(relatedProduct.price)}</span>
                          </p>
                        </>
                      ) : (
                        <p className="related-product-price">{formatCurrency(relatedProduct.price)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;