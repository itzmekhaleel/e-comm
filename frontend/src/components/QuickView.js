/* New component: QuickView.js */
const QuickView = ({ product, onClose }) => {
  return (
    <div className="quick-view-modal">
      <div className="quick-view-content">
        <img src={product.imageUrl} alt={product.name} />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">{formatCurrency(product.price)}</p>
          <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};