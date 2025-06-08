import React, { useState } from 'react';
import { Logo } from '../../../types/logo';
import logoService from '../../../services/logoService';
import Image from 'next/image';

interface LogoUploadProps {
  onUpload: (files: FileList | undefined, logoDetails: Partial<Logo> & { deleted?: boolean }) => void;
  existingLogos?: Logo[];
  organization: { org_id: number; org_name: string };
}

export const LogoUpload: React.FC<LogoUploadProps> = ({ onUpload, existingLogos, organization }) => {
  const [dragActive, setDragActive] = useState(false);
  const [logoDetails, setLogoDetails] = useState({
    offer_type: '',
    format: '',
    color_scheme: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLogoUpload(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleLogoUpload(e.target.files);
    }
  };

  const handleLogoUpload = async (files: FileList) => {
    if (isUploading) return;
    
    try {
      setIsUploading(true);

      if (!organization || !organization.org_name || !organization.org_id) {
        throw new Error('Organization data is required for logo upload');
      }

      const file = files[0];
      if (!file) {
        throw new Error('No file selected');
      }

      console.log('Starting upload for file:', file.name);

      const fileFormat = file.name.split('.').pop()?.toUpperCase() || 'PNG';
      const fileName = `${organization.org_name.toLowerCase().replace(/\s+/g, '_')}_original.${fileFormat.toLowerCase()}`;
      
      // Construct the relative path for frontend display
      const relativePath = `/images/logo/merchant_logo/${fileName}`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', relativePath);

      console.log('Saving file locally...');

      // Save file locally using a separate endpoint
      const saveResponse = await fetch('/api/files/save', {
        method: 'POST',
        body: formData
      });

      const saveResult = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(`Failed to save file locally: ${saveResult.error || 'Unknown error'}`);
      }

      console.log('File saved successfully at:', saveResult.path);

      // Create logo data with both absolute and relative paths
      const logoData = {
        originalPath: saveResult.path, // Absolute path for backend processing
        orgId: organization.org_id,
        orgName: organization.org_name,
        logoDetails: {
          offer_type: 'ORIGINAL',
          format: fileFormat,
          color_scheme: 'default',
          url: relativePath // Relative path for frontend display
        }
      };
      
      console.log('Sending metadata to backend:', logoData);

      const result = await logoService.upload(logoData);
      console.log('Logo processed successfully:', result);
      
      if (result && Array.isArray(result)) {
        const originalLogo = result.find(logo => logo.offer_type === 'ORIGINAL');
        if (originalLogo) {
          onUpload(files, {
            id: originalLogo.id,
            offer_type: originalLogo.offer_type,
            format: fileFormat,
            color_scheme: 'default',
            url: relativePath // Use the relative path for frontend
          });
        }
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLogo = async (logoId: number | undefined) => {
    if (!logoId) return;
    
    try {
      await logoService.deleteLogo(logoId);
      // Instead of passing null files, just pass the logo details
      onUpload(undefined, { 
        id: logoId, 
        deleted: true 
      });
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete logo');
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Organization Logos
      </label>
      
      {/* Existing Logos Preview */}
      {existingLogos && existingLogos.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-4">
          {existingLogos.map((logo) => (
            <div key={logo.id} className="relative group">
              <button
                onClick={() => handleDeleteLogo(logo.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                title="Delete logo"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="border rounded overflow-hidden">
                <Image
                  src={logo.url}
                  alt="Logo"
                  width={200}
                  height={96}
                  className="w-full h-24 object-contain"
                />
                <div className="text-xs p-2 bg-gray-50">
                  <p>{logo.offer_type}</p>
                  <p>{logo.format}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600">Offer Type</label>
          <input
            type="text"
            value={logoDetails.offer_type}
            onChange={(e) => setLogoDetails({ ...logoDetails, offer_type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Standard, Premium"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Format</label>
          <select
            value={logoDetails.format}
            onChange={(e) => setLogoDetails({ ...logoDetails, format: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Format</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="SVG">SVG</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Color Scheme</label>
          <input
            type="text"
            value={logoDetails.color_scheme}
            onChange={(e) => setLogoDetails({ ...logoDetails, color_scheme: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Dark, Light"
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="mt-2 text-sm text-gray-600">
            Drag and drop logos here, or click to select files
          </span>
          <span className="mt-1 text-xs text-gray-500">
            Supports: PNG, JPG, GIF (Max 5MB each)
          </span>
        </label>
      </div>
    </div>
  );
}; 