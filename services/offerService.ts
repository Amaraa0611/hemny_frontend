import { Offer, OfferType } from '../types/offer';
import { BACKEND_URL, axiosInstance } from './api';

export const offerService = {
  getAll: async (): Promise<Offer[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/offers`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Offer> => {
    try {
      const response = await fetch(`${BACKEND_URL}/offers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch offer');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching offer:', error);
      throw error;
    }
  },

  getByType: async (type: OfferType): Promise<Offer[]> => {
    const response = await fetch(`${BACKEND_URL}/api/offers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} offers`);
    }
    const offers = await response.json();
    return offers.filter((offer: Offer) => offer.offer_type === type);
  },

  create: async (offerData: Omit<Offer, 'offer_id'>): Promise<Offer> => {
    try {
      console.log('Creating offer with data:', offerData);
      const response = await fetch(`${BACKEND_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`Failed to create offer: ${errorData?.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  },

  update: async (id: number, offerData: Partial<Offer>): Promise<Offer> => {
    try {
      console.log('Updating offer with data:', offerData);
      const response = await fetch(`${BACKEND_URL}/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`Failed to update offer: ${errorData?.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BACKEND_URL}/offers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`Failed to delete offer: ${errorData?.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  },

  getAvailableCashbackOffers: async (): Promise<Offer[]> => {
    const response = await fetch(`${BACKEND_URL}/api/offers/cashback/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available cashback offers');
    }
    return response.json();
  },

  getAvailableDiscountOffers: async (): Promise<Offer[]> => {
    const response = await fetch(`${BACKEND_URL}/api/offers/discount/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available discount offers');
    }
    return response.json();
  },

  getAvailableLoyaltyOffers: async (): Promise<Offer[]> => {
    const response = await fetch(`${BACKEND_URL}/api/offers/loyalty/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available loyalty offers');
    }
    return response.json();
  },

  getByOrganization: async (orgId: number) => {
    try {
      const response = await axiosInstance.get(`/offers/organization/${orgId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching offers for organization:', error);
      throw error;
    }
  },

  // Fetch organizations with active offers by parent category
  getOrganizationsByCategory: async (category_id: number) => {
    const response = await fetch(`/api/offers/category/${category_id}/organizations`);
    if (!response.ok) {
      throw new Error('Failed to fetch organizations by category');
    }
    return response.json();
  },
}; 