import React, { useState, useEffect } from 'react';
import cartService from '../services/cart.service';

const CartTest = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await cartService.getCart();
        console.log('Cart response in test:', response);
        setCartData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error in test:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <div>Loading cart data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Cart Test</h2>
      <pre>{JSON.stringify(cartData, null, 2)}</pre>
      {cartData?.cartItems?.length > 0 ? (
        <div>
          <h3>Cart Items:</h3>
          {cartData.cartItems.map(item => (
            <div key={item.id}>
              <p>Product: {item.productName}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price}</p>
              <img src={item.productImageUrl} alt={item.productName} style={{width: '100px', height: '100px'}} />
            </div>
          ))}
        </div>
      ) : (
        <p>No items in cart</p>
      )}
    </div>
  );
};

export default CartTest;