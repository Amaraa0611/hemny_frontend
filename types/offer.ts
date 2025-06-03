export type OfferType = 'DISCOUNT' | 'CASHBACK' | 'LOYALTY';
export type DiscountType = 'Percentage' | 'Fixed';
export type PaymentOrg = 1 | 2; // You might want to make this more specific based on your needs

interface BaseOffer {
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
  payment_org: PaymentOrg;
  payment_option: string;
  payment_option_2?: string;
  terms_conditions: string;
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

export interface DiscountOffer extends BaseOffer {
  offer_type: 'DISCOUNT';
  discount_value: string;
  discount_type: DiscountType;
  offer_code: string;
}

export interface CashbackOffer extends BaseOffer {
  offer_type: 'CASHBACK';
  cashback_rate: string;
  description: string;
}

export interface LoyaltyOffer extends BaseOffer {
  offer_type: 'LOYALTY';
  loyalty_points: string;
  membership_requirement: string;
}

export type Offer = DiscountOffer | CashbackOffer | LoyaltyOffer; 