import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/cart/';

class CartService {
  /**
   * Get cart for current user (authenticated or guest)
   */
  async getCart() {
    try {
      const headers = authHeader();
      
      // Make API call with authentication header if available
      console.log("Making API call for getCart");
      
      const response = await axios.get(API_URL, { 
        headers: headers.Authorization ? headers : {},
        timeout: 10000
      });
      console.log("response ",response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getCart:', error);
      
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Handle specific HTTP errors
      if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle general errors
      let message = 'Failed to load cart';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      }
      throw new Error(message);
    }
  }

  /**
   * Add item to cart
   */
  async addItem(productId, quantity) {
    try {
      const headers = authHeader();
      
      // Validate parameters
      if (!productId || !quantity || quantity <= 0) {
        throw new Error('Invalid product ID or quantity');
      }
      
      // Make API call with authentication header if available
      console.log("before making the add to cart ");
      
      const response = await axios.post(
        `${API_URL}items?productId=${productId}&quantity=${quantity}`, 
        {}, 
        { 
          headers: headers.Authorization ? headers : {},
          timeout: 10000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error in addItem:', error);
      
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Handle specific HTTP errors
      if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle general errors
      let message = 'Failed to add item to cart';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      }
      throw new Error(message);
    }
  }

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(productId, quantity) {
    try {
      const headers = authHeader();
      
      // Validate parameters
      if (!productId || !quantity || quantity < 0) {
        throw new Error('Invalid product ID or quantity');
      }
      
      // Make API call with authentication header
      const response = await axios.put(
        `${API_URL}items/${productId}?quantity=${quantity}`, 
        {}, 
        { 
          headers: headers,
          timeout: 10000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error in updateItemQuantity:', error);
      
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Handle specific HTTP errors
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please login to continue.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Please check your permissions.');
      } else if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle general errors
      let message = 'Failed to update item quantity';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      }
      throw new Error(message);
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(productId) {
    try {
      const headers = authHeader();
      
      // Validate parameter
      if (!productId) {
        throw new Error('Invalid product ID');
      }
      
      // Make API call with authentication header
      const response = await axios.delete(
        `${API_URL}items/${productId}`, 
        { 
          headers: headers,
          timeout: 10000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error in removeItem:', error);
      
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Handle specific HTTP errors
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please login to continue.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Please check your permissions.');
      } else if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle general errors
      let message = 'Failed to remove item from cart';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      }
      throw new Error(message);
    }
  }

  /**
   * Clear cart
   */
  async clearCart() {
    try {
      const headers = authHeader();
      
      // Make API call with authentication header
      const response = await axios.delete(
        API_URL, 
        { 
          headers: headers,
          timeout: 10000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error in clearCart:', error);
      
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      // Handle specific HTTP errors
      if (error.response.status === 401) {
        throw new Error('Authentication required. Please login to continue.');
      } else if (error.response.status === 403) {
        throw new Error('Access forbidden. Please check your permissions.');
      } else if (error.response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Handle general errors
      let message = 'Failed to clear cart';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else {
          message = JSON.stringify(error.response.data);
        }
      }
      throw new Error(message);
    }
  }
}

export default new CartService();