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

const convertToRelativePath = (absolutePath: string): string => {
  // If already relative or HTTP URL, return as is
  if (absolutePath.startsWith('/') || absolutePath.startsWith('http')) {
    return absolutePath;
  }
  
  // Convert absolute path to relative
  const relativePath = absolutePath.split('/public/').pop();
  return relativePath ? `/${relativePath}` : absolutePath;
};

export const logoService = {
  getByOrgId: async (orgId: number): Promise<Logo[]> => {
    try {
      if (!orgId) {
        throw new Error('Organization ID is required');
      }
      console.log('Fetching logos for org_id:', orgId);
      const response = await fetch(`${BACKEND_URL}/logos?org_id=${orgId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch logos: ${response.statusText}`);
      }
      const logos = await response.json();
      
      // Transform any absolute paths to relative URLs for frontend display
      const transformedLogos = logos.map((logo: Logo) => ({
        ...logo,
        url: logo.url.startsWith('/') ? logo.url : `/images/logo/merchant_logo/${logo.url.split('/').pop()}`
      }));
      
      console.log('Transformed logos:', transformedLogos);
      return transformedLogos;
    } catch (error) {
      console.error('Error in getByOrgId:', error);
      throw error;
    }
  },

  upload: async (logoData: LogoData) => {
    console.log('logoService.upload called with:', logoData);

    if (!logoData || !logoData.originalPath || !logoData.orgId) {
      console.error('Missing required fields:', {
        originalPath: !logoData?.originalPath,
        orgId: !logoData?.orgId
      });
      throw new Error('Invalid logo data provided');
    }

    // Send both paths to backend
    const response = await fetch(`${BACKEND_URL}/api/logos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoData), // Send as is, with both paths
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Upload failed with response:', responseData);
      throw new Error(responseData.message || responseData.error || 'Failed to upload logo');
    }
    
    console.log('Upload successful:', responseData);
    
    // Ensure frontend gets relative paths
    if (Array.isArray(responseData)) {
      return responseData.map(logo => ({
        ...logo,
        url: logo.url.startsWith('/') ? logo.url : `/images/logo/merchant_logo/${logo.url.split('/').pop()}`
      }));
    }
    
    return responseData;
  },

  deleteLogo: async (logoId: number) => {
    const response = await fetch(`${BACKEND_URL}/api/logos/${logoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to delete logo');
    }

    return true;
  }
}; 