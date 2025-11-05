const axios = require('axios');

// Test the complete cart functionality
async function testCartFunctionality() {
  try {
    console.log('Testing complete cart functionality...');
    
    // 1. Test guest cart functionality
    console.log('\n1. Testing guest cart functionality...');
    
    // Add item to guest cart
    console.log('Adding item to guest cart...');
    const guestAddResponse = await axios.post(
      'http://localhost:8082/api/cart/items?productId=1&quantity=2'
    );
    console.log('Guest add item response:', guestAddResponse.data);
    
    // Get guest cart
    console.log('Getting guest cart...');
    const guestCartResponse = await axios.get('http://localhost:8082/api/cart');
    console.log('Guest cart response:', JSON.stringify(guestCartResponse.data, null, 2));
    
    // 2. Create a test user
    console.log('\n2. Creating test user...');
    try {
      const signupResponse = await axios.post('http://localhost:8082/api/auth/signup', {
        firstName: 'Cart',
        lastName: 'Tester',
        email: 'carttester@example.com',
        password: 'password123'
      });
      console.log('Signup response:', signupResponse.data);
    } catch (error) {
      console.log('Signup error (might already exist):', error.response ? error.response.data : error.message);
    }
    
    // 3. Login with the test user
    console.log('\n3. Logging in...');
    const loginResponse = await axios.post('http://localhost:8082/api/auth/signin', {
      email: 'carttester@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('Login successful');
    
    // 4. Add items to authenticated user cart
    console.log('\n4. Adding items to authenticated user cart...');
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
    
    // 6. Update item quantity
    console.log('\n6. Updating item quantity...');
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
    console.log('\n7. Getting cart after updating quantity...');
    const cartAfterUpdateResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Cart after update response:', JSON.stringify(cartAfterUpdateResponse.data, null, 2));
    
    // 8. Remove item from cart
    console.log('\n8. Removing item from cart...');
    const removeItemResponse = await axios.delete(
      'http://localhost:8082/api/cart/items/1',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Remove item response:', removeItemResponse.data);
    
    // 9. Get the empty cart
    console.log('\n9. Getting empty cart...');
    const finalCartResponse = await axios.get('http://localhost:8082/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Final cart response:', JSON.stringify(finalCartResponse.data, null, 2));
    
    console.log('\nAll cart functionality tests passed!');
  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testCartFunctionality();