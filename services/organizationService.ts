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
  CashbackOffer?: {
    cashback_rate: string;
    terms_conditions: string;
    description: string;
  };
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
        categoryIds: org.categoryIds || [],
        subcategoryIds: org.subcategoryIds || [],
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
      const response = await fetch('/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_name: data.org_name,
          org_description: data.org_description || null,
          website_url: data.website_url || null,
          logo_url: data.logo_url || null,
          location: data.location || null,
          contact_info: data.contact_info || null,
          brand_colors: data.brand_colors || {
            primary: "#000000",
            secondary: "#FFFFFF",
            accent: "#000000"
          },
          CashbackOffer: data.CashbackOffer || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to create organization: ${errorData?.message || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<CreateOrganizationData>): Promise<Organization> => {
    try {
      console.log('Updating organization with data:', data);
      const response = await fetch(`${BACKEND_URL}/organizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          CashbackOffer: data.CashbackOffer || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to update organization: ${errorData?.message || response.statusText}`);
      }

      const updatedOrg = await response.json();
      console.log('Organization updated successfully:', updatedOrg);
      return updatedOrg;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`/organizations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to delete organization: ${errorData?.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  async updateCategories(orgId: number, data: { categoryIds: number[], subcategoryIds: number[] }) {
    const response = await fetch(`${BACKEND_URL}/organizations/${orgId}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update organization categories');
    }

    return response.json();
  },

  async removeCategories(orgId: number, data: { categoryIds: number[] }) {
    const response = await fetch(`${BACKEND_URL}/organizations/${orgId}/categories`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to remove organization categories');
    }

    return response.json();
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
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Categories fetch error:', errorData);
        throw new Error('Failed to fetch organization categories');
      }
      const data = await response.json();
      console.log('Categories data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching organization categories:', error);
      return [];
    }
  },

  getAllCategories: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const result = await response.json();
      console.log('All categories response:', result); // Debug log
      return result.data || [];
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  }
}; 