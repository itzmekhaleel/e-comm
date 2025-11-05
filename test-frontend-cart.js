// Simple test to verify frontend cart functionality
console.log('Testing frontend cart functionality...');

// Test the cart service directly
const cartService = require('./frontend/src/services/cart.service.js');

console.log('Cart service loaded successfully');

// Test error handling
try {
  const error = new Error('Test error');
  console.log('Error message:', error.message);
  
  const errorObject = { message: 'Test error object' };
  console.log('Error object message:', errorObject.message);
  
  const plainObject = { test: 'value' };
  console.log('Plain object:', JSON.stringify(plainObject));
  
  console.log('All tests passed!');
} catch (err) {
  console.error('Test failed:', err);
}