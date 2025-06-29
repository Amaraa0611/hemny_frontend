import { Organization } from './organization';

export type OfferType = 'CASHBACK' | 'DISCOUNT' | 'LOYALTY';
export type DiscountType = 'Percentage' | 'Fixed';
export type PaymentOrg = 1 | 2; // You might want to make this more specific based on your needs

export interface BaseOffer {
  offer_id: number;
  org_id: number;
  category_id: number;
  offer_type: OfferType;
  offer_title: string;
  offer_description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  picture_url: string;
  payment_org: PaymentOrg | null;
  payment_option: string;
  payment_option_2?: string;
  terms_conditions: string;
  organization?: Organization;
  CashbackOffer?: {
    offer_id: number;
    cashback_rate: string;
    terms_conditions: string;
    description: string;
    image_url: string | null;
    start_date: string | null;
    end_date: string | null;
    status: boolean;
  };
}

export interface DiscountOffer {
  offer_id?: number;
  discount_value: string;
  discount_type: string;
  offer_code: string;
  terms_conditions: string;
}

export interface CashbackOffer {
  offer_id: number;
  cashback_rate: string;
  terms_conditions: string;
  description: string;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: boolean;
}

export interface LoyaltyOffer {
  offer_id: number;
  loyalty_points: string;
  membership_requirement: string;
}

export interface Offer {
  offer_id: number;
  org_id: number;
  category_id: number;
  offer_type: OfferType;
  offer_title: string;
  offer_description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  picture_url: string;
  payment_org: number | null;
  payment_option: string;
  payment_option_2: string;
  source_link: string | null;
  terms_conditions: string;
  DiscountOffer: DiscountOffer | null;
  CashbackOffer: CashbackOffer | null;
  LoyaltyOffer: LoyaltyOffer | null;
  GiveawayOffer: any | null;
  ChallengeOffer: any | null;
  organization?: Organization;
} 