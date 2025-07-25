export interface Category {
  id: number;
  name_en: string;
  name_mn: string;
  parent_id: number | null;
  description_en: string | null;
  description_mn: string | null;
  children?: Category[];
  subcategoryId?: number | null;
  OrganizationCategory?: {
    subcategory_id: number;
    subcategory: {
      id: number;
      name_en: string;
      name_mn: string;
      parent_id: number;
      description_en: string | null;
      description_mn: string | null;
    };
  };
} 