import React, { useState, useEffect } from 'react';
import { Organization } from '../../../types/organization';
import { organizationService } from '../../../services/organizationService';
import { logoService } from '../../../services/logoService';
import { categoryService } from '../../../services/categoryService';
import { LogoUpload } from './LogoUpload';
import { Logo } from '../../../types/logo';
import { Category } from '../../../types/category';

interface OrganizationFormProps {
  organization: Organization | null;
  onClose: () => void;
  onSubmit: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    website: string;
    category_id: string;
    subcategory_id: string;
    logo_url: string;
    logo_file?: File;
  }>({
    name: '',
    description: '',
    website: '',
    category_id: '',
    subcategory_id: '',
    logo_url: '',
  });

  const getLogoUrl = (logoPath: string) => {
    if (!logoPath) return '';
    
    // If it's a full URL containing '/images/', extract the path after it
    if (logoPath.includes('/images/')) {
      const pathAfterImages = logoPath.split('/images/').pop();
      return `/images/${pathAfterImages}`;
    }
    
    // If it's a relative path, make it absolute from the root
    if (!logoPath.startsWith('/')) {
      logoPath = '/' + logoPath;
    }
    return logoPath;
  };

  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    subcategories: Array<{
      id: string;
      name: string;
    }>;
  }>>([]);

  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
    subcategories: Array<{
      id: string;
      name: string;
    }>;
  } | null>(null);

  useEffect(() => {
    if (organization) {
      console.log('Organization data received:', organization);
      setFormData({
        name: organization.org_name,
        description: organization.org_description || '',
        website: organization.website_url || '',
        logo_url: organization.logo_url || '',
        category_id: organization.category_id?.toString() || '',
        subcategory_id: organization.subcategory_id?.toString() || '',
        logo_file: undefined,
      });
    }
    fetchCategories();
  }, [organization]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data.map((cat: Category) => ({
        id: cat.id.toString(),
        name: cat.name_en,
        subcategories: (cat.children || []).map((subcat: Category) => ({
          id: subcat.id.toString(),
          name: subcat.name_en
        }))
      })));
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(category || null);
    setFormData(prev => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: '',
    }));
  };

  const handleLogoUpload = async (files: FileList | undefined, logoDetails: Partial<Logo> & { deleted?: boolean }) => {
    try {
      if (!organization) {
        console.error('No organization selected');
        return;
      }

      // Handle logo deletion
      if (logoDetails.deleted && logoDetails.id) {
        setFormData(prev => ({
          ...prev,
          logo_url: '',
        }));
        return;
      }

      // Handle logo upload
      if (files && files.length > 0) {
        const file = files[0]; // Take the first file
        const logoData = {
          originalPath: file.name,
          orgId: organization.org_id,
          orgName: formData.name.toLowerCase().replace(/\s+/g, '_'),
          logoDetails: {
            offer_type: logoDetails.offer_type || 'ORIGINAL',
            format: logoDetails.format || '',
            color_scheme: logoDetails.color_scheme || 'default',
            url: `/images/logo/${formData.name.toLowerCase().replace(/\s+/g, '_')}/${file.name}`
          }
        };

        console.log('Uploading logo with data:', logoData);

        const result = await logoService.upload(logoData);
        console.log('Upload result:', result);
        
        onSubmit(); // Refresh the organization data
      }
    } catch (error) {
      console.error('Error uploading logos:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload logos. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const submitData = {
        org_name: formData.name,
        org_description: formData.description,
        website_url: formData.website,
        logo_url: formData.logo_url,
        category_id: parseInt(formData.category_id),
        subcategory_id: parseInt(formData.subcategory_id)
      };

      if (organization?.org_id) {
        await organizationService.update(organization.org_id, submitData);
      } else {
        const newOrg = await organizationService.create(submitData);
        if (newOrg.org_id) {
          await organizationService.updateCategories(newOrg.org_id, {
            categoryIds: [parseInt(formData.category_id)],
            subcategoryIds: [parseInt(formData.subcategory_id)]
          });
        }
      }
      onSubmit();
    } catch (error) {
      setError('Failed to save organization');
      console.error('Error saving organization:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {organization ? 'Edit Organization' : 'Add Organization'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Organization Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block mb-1">Logo URL</label>
              <input
                type="url"
                value={getLogoUrl(formData.logo_url)}
                onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="/images/logo.png"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Categories</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.category_id === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {formData.category_id && (
              <div>
                <label className="block mb-2 font-medium">Subcategories</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                  {selectedCategory?.subcategories.map(subcat => (
                    <div key={subcat.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`subcat-${subcat.id}`}
                        checked={formData.subcategory_id === subcat.id}
                        onChange={() => setFormData({ ...formData, subcategory_id: subcat.id })}
                        className="mr-2"
                      />
                      <label htmlFor={`subcat-${subcat.id}`} className="text-sm">
                        {subcat.name}
                      </label>
                    </div>
                  ))}
                  {selectedCategory?.subcategories.length === 0 && (
                    <p className="text-gray-500 text-sm col-span-2">
                      No subcategories available for selected category
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <LogoUpload
            onUpload={handleLogoUpload}
            existingLogos={organization?.logos}
            organization={{
              org_id: organization?.org_id || 0,
              org_name: formData.name
            }}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm; 