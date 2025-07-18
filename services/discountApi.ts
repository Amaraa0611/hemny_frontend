import axios from 'axios';
import { axiosInstance } from './api';

export const discountApi = {
  getStores: async () => {
    try {
      console.log('Fetching discount stores...'); // Debug log
      const response = await axiosInstance.get('offers/discount/available');
      console.log('Response:', response); // Debug log
      console.log('Response data:', response.data); // Debug log
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Debug first item structure if available
      if (response.data && response.data.length > 0) {
        console.log('First item in response:', response.data[0]);
        console.log('First item keys:', Object.keys(response.data[0]));
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
      console.error('Error fetching discount stores:', error);
      throw error;
    }
  },

  getStoreById: async (id: string | number) => {
    try {
      const { data } = await axiosInstance.get(`offers/discount/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching discount store with id ${id}:`, error);
      throw error;
    }
  },

  // You can add more discount-related API calls here as needed
  // For example:
  // getDiscountDetails: async (id) => {
  //   const response = await axiosInstance.get(`/offers/discount/${id}`);
  //   return response.data;
  // },
};