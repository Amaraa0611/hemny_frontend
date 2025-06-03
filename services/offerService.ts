import { Offer, OfferType } from '../types/offer';
import { BACKEND_URL } from './api';

export const offerService = {
  getAll: async (): Promise<Offer[]> => {
    const response = await fetch(`${BACKEND_URL}/offers/`);
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    const data = await response.json();
    
    // Transform the data to include type-specific fields
    return data.map((offer: any) => {
      const baseOffer = {
        offer_id: offer.offer_id,
        org_id: offer.org_id,
        category_id: offer.category_id,
        offer_type: offer.offer_type,
        offer_title: offer.offer_title,
        offer_description: offer.offer_description,
        start_date: offer.start_date,
        end_date: offer.end_date,
        is_active: offer.is_active,
        is_featured: offer.is_featured,
        picture_url: offer.picture_url,
        payment_org: offer.payment_org,
        payment_option: offer.payment_option,
        payment_option_2: offer.payment_option_2,
        terms_conditions: offer.terms_conditions,
      };

      // Add type-specific fields based on offer_type
      if (offer.offer_type === 'DISCOUNT' && offer.DiscountOffer) {
        return {
          ...baseOffer,
          discount_value: offer.DiscountOffer.discount_value,
          discount_type: offer.DiscountOffer.discount_type,
          offer_code: offer.DiscountOffer.offer_code,
          terms_conditions: offer.DiscountOffer.terms_conditions || offer.terms_conditions,
        };
      } else if (offer.offer_type === 'CASHBACK' && offer.CashbackOffer) {
        return {
          ...baseOffer,
          cashback_rate: offer.CashbackOffer.cashback_rate,
          description: offer.CashbackOffer.description,
          CashbackOffer: offer.CashbackOffer
        };
      } else if (offer.offer_type === 'LOYALTY' && offer.LoyaltyOffer) {
        return {
          ...baseOffer,
          loyalty_points: offer.LoyaltyOffer.loyalty_points,
          membership_requirement: offer.LoyaltyOffer.membership_requirement,
        };
      }

      return baseOffer;
    });
  },

  getByType: async (type: OfferType): Promise<Offer[]> => {
    const response = await fetch(`${BACKEND_URL}/api/offers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} offers`);
    }
    const offers = await response.json();
    return offers.filter((offer: Offer) => offer.offer_type === type);
  },

  create: async (offer: Omit<Offer, 'id'>): Promise<Offer> => {
    try {
      console.log('Sending offer data:', JSON.stringify(offer, null, 2));
      const response = await fetch(`${BACKEND_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offer),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`Failed to create offer: ${errorData?.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create offer error:', error);
      throw error;
    }
  },

  update: async (id: number, offer: Partial<Offer>): Promise<Offer> => {
    try {
      console.log('Updating offer with data:', JSON.stringify(offer, null, 2));
      const response = await fetch(`${BACKEND_URL}/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offer),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(`Failed to update offer: ${errorData?.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update offer error:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/api/offers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete offer');
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
}; 