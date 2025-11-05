// Test script to verify cart functionality
console.log('Testing cart functionality...');

// Test the cart service directly
const axios = require('axios');

// Test getting cart
async function testGetCart() {
  try {
    console.log('Testing get cart...');
    const response = await axios.get('http://localhost:8082/api/cart/');
    console.log('Get cart response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting cart:', error.response ? error.response.data : error.message);
  }
}

// Test adding item to cart
async function testAddItemToCart() {
  try {
    console.log('Testing add item to cart...');
    const response = await axios.post('http://localhost:8082/api/cart/items?productId=1&quantity=1');
    console.log('Add item response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error.response ? error.response.data : error.message);
  }
}

// Test getting cart after adding item
async function testGetCartWithItems() {
  try {
    console.log('Testing get cart with items...');
    const response = await axios.get('http://localhost:8082/api/cart/');
    console.log('Get cart with items response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting cart with items:', error.response ? error.response.data : error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Running cart tests...');
  
  // Test 1: Get empty cart
  await testGetCart();
  
  // Test 2: Add item to cart
  await testAddItemToCart();
  
  // Test 3: Get cart with items
  await testGetCartWithItems();
  
  console.log('Tests completed.');
}

// Run the tests
runTests();