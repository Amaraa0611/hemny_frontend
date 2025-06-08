import { Logo } from '../types/logo';
import { BACKEND_URL } from './api';

interface LogoData {
  originalPath: string;  // Absolute path for backend processing
  orgId: number;
  orgName: string;
  logoDetails: {
    offer_type: string;
    format: string;
    color_scheme: string;
    url: string;  // Relative path for frontend display
  };
}

export interface CreateLogoData {
  org_id: number;
  url: string;
  offer_type?: string;
  format?: string;
  color_scheme?: string;
}

const convertToRelativePath = (absolutePath: string): string => {
  // Remove the domain and any leading paths to get just the relative path
  const url = new URL(absolutePath);
  return url.pathname;
};

const logoService = {
  getByOrgId: async (orgId: number): Promise<Logo[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/logos/${orgId}`);
      if (!response.ok) {
        console.warn('Failed to fetch logos, returning empty array');
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn('Error fetching logos:', error);
      return [];
    }
  },

  create: async (logoData: CreateLogoData): Promise<Logo> => {
    try {
      const response = await fetch(`${BACKEND_URL}/logos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData),
      });

      if (!response.ok) {
        throw new Error('Failed to create logo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating logo:', error);
      throw error;
    }
  },

  upload: async (logoData: LogoData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/logos/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  },

  deleteLogo: async (logoId: number): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/logos/${logoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete logo');
      }

      return true;
    } catch (error) {
      console.error('Error deleting logo:', error);
      throw error;
    }
  },
};

export default logoService; 