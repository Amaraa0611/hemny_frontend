import axios from 'axios';
import { axiosInstance } from './api';

export const loyaltyApi = {
  getStores: async () => {
    try {
      console.log('Fetching loyalty stores...'); // Debug log
      const response = await axiosInstance.get('offers/loyalty/available');
      console.log('Response:', response); // Debug log
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
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
      console.error('Error fetching loyalty stores:', error);
      throw error;
    }
  },

  getStoreById: async (id: string | number) => {
    try {
      const { data } = await axiosInstance.get(`offers/loyalty/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching loyalty store with id ${id}:`, error);
      throw error;
    }
  },

  // You can add more loyalty-related API calls here as needed
  // For example:
  // getLoyaltyDetails: async (id) => {
  //   const response = await axiosInstance.get(`/offers/loyalty/${id}`);
  //   return response.data;
  // },
}; 