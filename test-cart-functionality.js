const axios = require('axios');

// Test the cart functionality
async function testCartFunctionality() {
  try {
    console.log('Testing cart functionality...');
    
    // 1. Create a test user
    console.log('Creating test user...');
    const signupResponse = await axios.post('http://localhost:8082/api/auth/signup', {
      firstName: 'Test',
      lastName: 'User',
      email: 'test6@example.com',
      password: 'password123'
    });
    console.log('Signup response:', signupResponse.data);
    
    // 2. Login with the test user
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:8082/api/auth/signin', {
      email: 'test6@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');
    
    // 3. Get the empty cart
    console.log('Getting empty cart...');
    const emptyCartResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Empty cart response:', emptyCartResponse.data);
    
    // 4. Add an item to the cart
    console.log('Adding item to cart...');
    const addItemResponse = await axios.post(
      'http://localhost:8082/api/cart/items?productId=1&quantity=2',
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Add item response:', addItemResponse.data);
    
    // 5. Get the cart with items
    console.log('Getting cart with items...');
    const cartWithItemsResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Cart with items response:', cartWithItemsResponse.data);
    
    // 6. Update item quantity
    console.log('Updating item quantity...');
    const updateQuantityResponse = await axios.put(
      'http://localhost:8082/api/cart/items/1?quantity=3',
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Update quantity response:', updateQuantityResponse.data);
    
    // 7. Get the cart after updating quantity
    console.log('Getting cart after updating quantity...');
    const cartAfterUpdateResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Cart after update response:', cartAfterUpdateResponse.data);
    
    // 8. Remove item from cart
    console.log('Removing item from cart...');
    const removeItemResponse = await axios.delete(
      'http://localhost:8082/api/cart/items/1',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Remove item response:', removeItemResponse.data);
    
    // 9. Get the empty cart again
    console.log('Getting empty cart again...');
    const finalCartResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Final cart response:', finalCartResponse.data);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testCartFunctionality();