import axios from 'axios';
import { axiosInstance } from './api';
import { CashbackMerchant } from '../types/cashback';

export const cashbackApi = {
  getStores: async (): Promise<CashbackMerchant[]> => {
    try {
      const response = await axiosInstance.get('/offers/cashback/available');
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