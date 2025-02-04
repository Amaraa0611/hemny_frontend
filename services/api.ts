import axios from 'axios';
import { CashbackMerchant } from '../types/cashback';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  validateStatus: (status) => status < 500,
});

export const cashbackApi = {
  getStores: async (): Promise<CashbackMerchant[]> => {
    try {
      const response = await axiosInstance.get('offers/cashback/available');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          console.error('Unable to connect to the server. Is it running?');
        } else if (error.response) {
          console.error('Server responded with:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.message);
        }
      }
      console.error('Error fetching cashback stores:', error);
      throw error;
    }
  },

  // Add other API methods here
  getStoreById: async (id: string): Promise<CashbackMerchant> => {
    try {
      const { data } = await axiosInstance.get(`cashback/stores/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching cashback store with id ${id}:`, error);
      throw error;
    }
  },
};

// You can add other API services here
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await axiosInstance.post('/auth/login', credentials);
    return data;
  },
  // ... other auth methods
}; 