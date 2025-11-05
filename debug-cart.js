const axios = require('axios');

// Debug the cart functionality
async function debugCart() {
  try {
    console.log('Debugging cart functionality...');
    
    // 1. Try to add an item to cart without authentication (guest cart)
    console.log('\n1. Testing guest cart (no authentication)...');
    try {
      const guestAddResponse = await axios.post(
        'http://localhost:8082/api/cart/items?productId=1&quantity=1',
        {},
        {
          timeout: 10000
        }
      );
      console.log('Guest add item response:', guestAddResponse.data);
    } catch (error) {
      console.log('Guest add item error:', error.response ? error.response.data : error.message);
    }
    
    // 2. Create a test user
    console.log('\n2. Creating test user...');
    try {
      const signupResponse = await axios.post('http://localhost:8082/api/auth/signup', {
        firstName: 'Debug',
        lastName: 'User',
        email: 'debug@example.com',
        password: 'password123'
      });
      console.log('Signup response:', signupResponse.data);
    } catch (error) {
      console.log('Signup error (might already exist):', error.response ? error.response.data : error.message);
    }
    
    // 3. Login with the test user
    console.log('\n3. Logging in...');
    const loginResponse = await axios.post('http://localhost:8082/api/auth/signin', {
      email: 'debug@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');
    
    // 4. Add an item to the cart
    console.log('\n4. Adding item to cart...');
    const addItemResponse = await axios.post(
      'http://localhost:8082/api/cart/items?productId=1&quantity=1',
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Add item response:', addItemResponse.data);
    
    // 5. Get the cart with items
    console.log('\n5. Getting cart with items...');
    const cartWithItemsResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Cart with items response:', JSON.stringify(cartWithItemsResponse.data, null, 2));
    
    // 6. Try adding the same item again
    console.log('\n6. Adding same item to cart again...');
    const addItemAgainResponse = await axios.post(
      'http://localhost:8082/api/cart/items?productId=1&quantity=1',
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Add same item response:', addItemAgainResponse.data);
    
    // 7. Get the cart again to see updated quantity
    console.log('\n7. Getting cart after adding same item...');
    const cartAfterAddAgainResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Cart after adding same item:', JSON.stringify(cartAfterAddAgainResponse.data, null, 2));
    
    console.log('\nDebug test completed!');
  } catch (error) {
    console.error('Debug test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the debug test
debugCart();