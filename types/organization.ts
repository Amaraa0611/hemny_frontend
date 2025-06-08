import { Logo } from './logo';
import { Category } from './category';

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
  created_at?: string;
  updated_at?: string;
  categories?: Array<{
    category_id: number;
    subcategory_id: number | null;
  }>;
  logos?: Array<{
    id: number;
    url: string;
    offer_type: string;
    format: string;
    color_scheme: string;
  }>;
  CashbackOffer?: {
    cashback_rate: string;
    terms_conditions: string;
    description: string;
  };
  offer_type?: string;
  offer_description?: string;
  start_date?: string;
  end_date?: string;
  payment_option?: string;
  payment_option_2?: string;
}

export interface CreateOrganizationData {
  org_name: string;
  org_description?: string;
  website_url?: string;
  logo_url?: string;
  location?: string;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  brand_colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  categories: Array<{
    category_id: number;
    subcategory_id: number | null;
  }>;
} 