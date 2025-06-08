import { Organization } from '../types/organization';
import { BACKEND_URL } from './api';

type CreateOrganizationData = {
  org_name: string;
  org_description?: string;
  website_url?: string;
  logo_url?: string;
  location?: string;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  brand_colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  categories?: Array<{
    category_id: number;
    subcategory_id: number | null;
  }>;
};

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/organizations`);
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const result = await response.json();
      const organizations = Array.isArray(result) ? result : (result.data || []);
      return organizations.map((org: any) => ({
        org_id: org.org_id,
        org_name: org.org_name,
        org_description: org.org_description,
        website_url: org.website_url,
        logo_url: org.logo_url,
        location: org.location,
        contact_info: org.contact_info,
        brand_colors: org.brand_colors,
        categories: org.categories || [],
        CashbackOffer: org.CashbackOffer || null,
      }));
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
  },

  create: async (data: CreateOrganizationData): Promise<Organization> => {
    try {
      console.log('Creating organization with data:', data);
      console.log('Categories in create data:', data.categories);
      
      // Ensure categories are included in the request
      const requestData = {
        ...data,
        categories: data.categories || []
      };
      
      console.log('Request data being sent:', requestData);
      
      const response = await fetch(`${BACKEND_URL}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Create failed with response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to create organization: ${JSON.stringify(errorData?.message) || response.statusText}`);
      }

      const result = await response.json();
      console.log('Create successful, response:', result);
      return result;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<CreateOrganizationData>): Promise<Organization> => {
    try {
      console.log('Updating organization with data:', data);
      console.log('Categories in update data:', data.categories);
      
      // Ensure categories are included in the request
      const requestData = {
        ...data,
        categories: data.categories || []
      };
      
      console.log('Request data being sent:', requestData);
      
      const response = await fetch(`${BACKEND_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Update failed with response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Failed to update organization: ${JSON.stringify(errorData?.message) || response.statusText}`);
      }

      const result = await response.json();
      console.log('Update successful, response:', result);
      return result;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      // First get the organization to check for logo
      const orgResponse = await fetch(`${BACKEND_URL}/organizations/${id}`);
      if (!orgResponse.ok) {
        throw new Error('Failed to fetch organization details');
      }
      const organization = await orgResponse.json();

      // Delete the organization (this should cascade delete categories relationships)
      const response = await fetch(`${BACKEND_URL}/organizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to delete organization: ${errorData?.message || response.statusText}`);
      }

      // If there's a logo, delete it from storage
      if (organization.logo_url) {
        try {
          const logoResponse = await fetch(`${BACKEND_URL}/upload/delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath: organization.logo_url }),
          });

          if (!logoResponse.ok) {
            console.warn('Failed to delete organization logo:', await logoResponse.text());
          }
        } catch (error) {
          console.warn('Error deleting organization logo:', error);
        }
      }

      // If there's a cashback offer, delete it
      if (organization.CashbackOffer) {
        try {
          const offerResponse = await fetch(`${BACKEND_URL}/cashback-offers/${organization.CashbackOffer.offer_id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!offerResponse.ok) {
            console.warn('Failed to delete cashback offer:', await offerResponse.text());
          }
        } catch (error) {
          console.warn('Error deleting cashback offer:', error);
        }
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  updateCategories: async (orgId: number, categories: Array<{ category_id: number; subcategory_id: number | null }>) => {
    try {
      const response = await fetch(`${BACKEND_URL}/organizations/${orgId}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to update organization categories: ${data?.message || response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating organization categories:', error);
      throw error;
    }
  },

  updateCategoryCombination: async (orgId: number, categoryId: number, subcategoryId: number | null) => {
    try {
      const response = await fetch(`${BACKEND_URL}/organizations/${orgId}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subcategory_id: subcategoryId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to update category combination: ${data?.message || response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating category combination:', error);
      throw error;
    }
  },

  deleteCategoryCombination: async (orgId: number, categoryId: number, subcategoryId?: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/organizations/${orgId}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoryId ? { subcategory_id: subcategoryId } : undefined),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to delete category combination: ${data?.message || response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error deleting category combination:', error);
      throw error;
    }
  },

  getById: async (id: number) => {
    const response = await fetch(`${BACKEND_URL}/organizations/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch organization');
    }
    return response.json();
  },

  getByName: async (orgName: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/organizations/search?name=${encodeURIComponent(orgName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch organization');
      }
      const result = await response.json();
      return result; // Return the full response object
    } catch (error) {
      console.error('Error fetching organization by name:', error);
      return null;
    }
  },

  getCategories: async (orgId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/organizations/${orgId}/categories`);
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to fetch organization categories:', result);
        return []; // Return empty array instead of throwing error
      }
      
      // Handle the nested data structure
      const categories = result.data || [];
      console.log('Parsed categories:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching organization categories:', error);
      return []; // Return empty array on error
    }
  },

  getAllCategories: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  }
};