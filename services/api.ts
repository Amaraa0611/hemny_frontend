import axios from 'axios';

// Import APIs
import { cashbackApi } from './cashbackApi';
import { discountApi } from './discountApi';
import { loyaltyApi } from './loyaltyApi';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
const API_BASE_PATH = process.env.NODE_ENV === 'production' ? '' : '';

// Immediate logging when the file is loaded
console.log('API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  API_URL,
  API_BASE_PATH,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timestamp: new Date().toISOString()
});

export const axiosInstance = axios.create({
  baseURL: `${API_URL}${API_BASE_PATH}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // More specific status validation
  validateStatus: (status) => status >= 200 && status < 300,
});

// Export the API URL for use in other services
export const BACKEND_URL = API_URL;

// Export all APIs
export { cashbackApi, discountApi, loyaltyApi };

// Auth API remains in api.ts since it's a core functionality
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },
  // ... other auth methods
}; 