import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/products/';

class ProductService {
  async getAll(sortBy = null, sortDirection = null) {
    try {
      let url = API_URL;
      const params = new URLSearchParams();
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      if (sortDirection) {
        params.append('sortDirection', sortDirection);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      // Validate that we received data
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      return response;
    } catch (error) {
      this.handleError(error, 'Failed to load products');
    }
  }

  async get(id) {
    try {
      const response = await axios.get(API_URL + id);
      // Validate that we received data
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      return response;
    } catch (error) {
      this.handleError(error, `Failed to load product with ID ${id}`);
    }
  }

  async search(query, sortBy = null, sortDirection = null) {
    try {
      let url = API_URL + 'search?query=' + query;
      const params = new URLSearchParams();
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      if (sortDirection) {
        params.append('sortDirection', sortDirection);
      }
      
      if (params.toString()) {
        url += `&${params.toString()}`;
      }
      
      const response = await axios.get(url);
      // Validate that we received data
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      return response;
    } catch (error) {
      this.handleError(error, 'Failed to search products');
    }
  }

  async getByCategory(category, sortBy = null, sortDirection = null) {
    try {
      let url = API_URL + 'category/' + category;
      const params = new URLSearchParams();
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      if (sortDirection) {
        params.append('sortDirection', sortDirection);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      // Validate that we received data
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      return response;
    } catch (error) {
      this.handleError(error, `Failed to load products in category ${category}`);
    }
  }

  async create(data) {
    try {
      const response = await axios.post(API_URL, data, { headers: authHeader() });
      return response;
    } catch (error) {
      this.handleError(error, 'Failed to create product');
    }
  }

  async update(id, data) {
    try {
      const response = await axios.put(API_URL + id, data, { headers: authHeader() });
      return response;
    } catch (error) {
      this.handleError(error, 'Failed to update product');
    }
  }

  async delete(id) {
    try {
      const response = await axios.delete(API_URL + id, { headers: authHeader() });
      return response;
    } catch (error) {
      this.handleError(error, 'Failed to delete product');
    }
  }
  
  handleError(error, defaultMessage) {
    console.error('API Error:', error); // Log the actual error for debugging
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data && error.response.data.message) || 
                     error.response.data || 
                     defaultMessage;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Something else happened
      throw new Error(defaultMessage || 'An unexpected error occurred. Please try again.');
    }
  }
}

const productService = new ProductService();
export default productService;