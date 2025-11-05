import axios from 'axios';

const API_URL = 'http://localhost:8082/api/auth/';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(API_URL + 'signin', {
        email,
        password
      });
      
      console.log('Login response:', response);
      console.log('Login response data:', response.data);
      
      // Store the user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const message = (error.response.data && error.response.data.message) || 
                       error.response.data || 
                       'Login failed. Please check your credentials.';
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(firstName, lastName, email, password) {
    try {
      const response = await axios.post(API_URL + 'signup', {
        firstName,
        lastName,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const message = (error.response.data && error.response.data.message) || 
                       error.response.data || 
                       'Registration failed. Please try again.';
        throw new Error(message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
  
  isAuthenticated() {
    const user = this.getCurrentUser();
    // Check for both token and accessToken since the backend might return either
    return user && (user.token || user.accessToken);
  }
}

export default new AuthService();