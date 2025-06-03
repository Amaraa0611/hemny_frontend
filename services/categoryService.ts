import { BACKEND_URL } from './api';

interface Category {
  id: number;
  name_en: string;
  name_mn: string;
  parent_id: number | null;
  description_en: string | null;
  description_mn: string | null;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Helper function to organize categories
  organizeCategories(categories: Category[]) {
    const topCategories = categories.filter(cat => !cat.parent_id);
    const categoriesWithSubs = topCategories.map(cat => ({
      ...cat,
      subcategories: categories.filter(subCat => subCat.parent_id === cat.id)
    }));
    return categoriesWithSubs;
  }
}; 