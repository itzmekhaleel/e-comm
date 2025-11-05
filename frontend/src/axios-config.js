import axios from 'axios';

// Configure axios to send credentials with all requests
axios.defaults.withCredentials = true;

export default axios;