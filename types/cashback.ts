export interface CashbackMerchant {
  offer_id: number;
  org_id: number;
  category_id: number;
  offer_type: string;
  offer_title: string;
  offer_description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  picture_url: string;
  created_at: string;
  updated_at: string;
  CashbackOffer: {
    offer_id: number;
    cashback_rate: string;
    terms_conditions: string;
    description: string;
    image_url: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string;
  };
}