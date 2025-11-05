const axios = require('axios');

// Test the add to cart functionality
async function testAddToCart() {
  try {
    console.log('Testing add to cart functionality...');
    
    // 1. Create a test user
    console.log('Creating test user...');
    const signupResponse = await axios.post('http://localhost:8082/api/auth/signup', {
      firstName: 'Test',
      lastName: 'User',
      email: 'admintest@gmail.com',
      password: 'admin@test'
    });
    console.log('Signup response:', signupResponse.data);
    
    // 2. Login with the test user
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:8082/api/auth/signin', {
      email: 'admintest@gmail.com',
      password: 'admin@test'
    });
    const token = loginResponse.data.token;
    console.log('Login successful, token:', token.substring(0, 20) + '...');
    
    // 3. Add an item to the cart
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
    
    // 4. Get the cart with items
    console.log('Getting cart with items...');
    const cartWithItemsResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Cart with items response:', cartWithItemsResponse.data);
    
    console.log('Add to cart test passed!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testAddToCart();