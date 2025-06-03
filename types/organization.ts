import { Logo } from './logo';

interface CashbackOffer {
  offer_id: number;
  cashback_rate: string;
  terms_conditions: string;
  description: string;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: boolean;
}

export interface Organization {
  org_id: number;
  org_name: string;
  org_description?: string;
  website_url?: string;
  logo_url?: string;
  location?: string;
  category_id?: number;
  subcategory_id?: number;
  categoryIds?: number[];
  subcategoryIds?: number[];
  terms_conditions?: string;
  contact_info?: {
    email: string;
    phone: string;
    address: string;
  };
  brand_colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logos?: Logo[];
  CashbackOffer?: CashbackOffer;
  offer_type?: string;
  cashback_rate?: string;
  offer_description?: string;
  offer_title?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  is_featured?: boolean;
  payment_option?: string;
  payment_option_2?: string;
  payment_org?: number;
} 