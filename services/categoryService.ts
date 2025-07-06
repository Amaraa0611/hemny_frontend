import { BACKEND_URL } from './api';

interface Category {
  id: number;
  name_en: string;
  name_mn: string;
  parent_id: number | null;
  description_en: string | null;
  description_mn: string | null;
  children?: Category[];
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Category> {
    const response = await fetch(`${BACKEND_URL}/categories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  async createCategory(data: Omit<Category, 'id' | 'children'>): Promise<Category> {
    const response = await fetch(`${BACKEND_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  async updateCategory(id: number, data: Omit<Category, 'id' | 'children'>): Promise<Category> {
    const response = await fetch(`${BACKEND_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  async deleteCategory(id: number): Promise<{ message: string }> {
    const response = await fetch(`${BACKEND_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
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