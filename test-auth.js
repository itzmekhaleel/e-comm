const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing authentication flow...');
    
    // Test login
    const loginResponse = await axios.post('http://localhost:8082/api/auth/signin', {
      email: 'admintest@gmail.com',
      password: 'admin@test'
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginResponse.data);
    
    // Check if we have a token
    const token = loginResponse.data.token || loginResponse.data.accessToken;
    console.log('Token found:', token ? 'Yes' : 'No');
    console.log('Token value:', token);
    
    // Test accessing protected endpoint with token
    if (token) {
      console.log('Testing cart access with token...');
      const cartResponse = await axios.get('http://localhost:8082/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Cart response status:', cartResponse.status);
      console.log('Cart response data:', cartResponse.data);
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAuth();