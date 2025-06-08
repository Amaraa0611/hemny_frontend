import React, { useState, useEffect } from 'react';
import { Organization, CreateOrganizationData } from '@/types/organization';
import { organizationService } from '@/services/organizationService';
import { Category } from '@/types/category';
import { categoryService } from '@/services/categoryService';

interface OrganizationFormProps {
  organization?: Organization;
  onSuccess: () => void;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateOrganizationData>({
    org_name: '',
    org_description: '',
    website_url: '',
    logo_url: '',
    location: '',
    contact_info: {
      email: '',
      phone: '',
      address: ''
    },
    brand_colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#CCCCCC'
    },
    categories: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        console.log('Fetched categories:', response);
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (organization) {
      setFormData({
        org_name: organization.org_name,
        org_description: organization.org_description,
        website_url: organization.website_url,
        logo_url: organization.logo_url,
        location: organization.location,
        contact_info: {
          email: organization.contact_info?.email || '',
          phone: organization.contact_info?.phone || '',
          address: organization.contact_info?.address || ''
        },
        brand_colors: organization.brand_colors || {
          primary: '#000000',
          secondary: '#FFFFFF',
          accent: '#CCCCCC'
        },
        categories: organization.categories?.map(cat => ({
          category_id: cat.id,
          subcategory_id: cat.OrganizationCategory?.subcategory_id || null
        })) || []
      });
    }
  }, [organization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact_')) {
      const field = name.replace('contact_', '');
      setFormData((prev: CreateOrganizationData) => ({
        ...prev,
        contact_info: {
          ...prev.contact_info,
          [field]: value
        }
      }));
    } else if (name.startsWith('brand_')) {
      const field = name.replace('brand_', '');
      setFormData((prev: CreateOrganizationData) => ({
        ...prev,
        brand_colors: {
          ...prev.brand_colors,
          [field]: value
        }
      }));
    } else {
      setFormData((prev: CreateOrganizationData) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddCategory = () => {
    if (!selectedCategory) return;

    const newCategory = {
      category_id: selectedCategory.id,
      subcategory_id: selectedSubcategory?.id || null
    };

    // Check if category already exists
    const exists = formData.categories.some(
      cat => cat.category_id === newCategory.category_id && 
             cat.subcategory_id === newCategory.subcategory_id
    );

    if (!exists) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
    }

    // Reset selections
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleRemoveCategory = (index: number) => {
    setFormData((prev: CreateOrganizationData) => ({
      ...prev,
      categories: prev.categories.filter((_: unknown, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Submitting form data:', formData);
      
      // Format categories for submission
      const formattedCategories = formData.categories.map(cat => ({
        category_id: cat.category_id,
        subcategory_id: cat.subcategory_id
      }));

      const submissionData = {
        ...formData,
        categories: formattedCategories
      };

      console.log('Formatted categories:', formattedCategories);
      console.log('Final submission data:', submissionData);

      let result;
      if (organization) {
        // Update existing organization
        result = await organizationService.update(organization.org_id, submissionData);
        console.log('Update result:', result);
        
        // Update categories separately
        if (formattedCategories.length > 0) {
          const categoryResult = await organizationService.updateCategories(
            organization.org_id,
            formattedCategories
          );
          console.log('Category update result:', categoryResult);
        }
      } else {
        // Create new organization
        result = await organizationService.create(submissionData);
        console.log('Create result:', result);
      }

      onSuccess();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to monitor formData changes
  useEffect(() => {
    console.log('formData changed:', formData);
  }, [formData]);

  // Add useEffect to monitor selectedCategory and selectedSubcategory changes
  useEffect(() => {
    console.log('Selected category/subcategory changed:', {
      selectedCategory,
      selectedSubcategory
    });
  }, [selectedCategory, selectedSubcategory]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="org_name" className="block text-sm font-medium text-gray-700">
            Organization Name *
          </label>
          <input
            type="text"
            id="org_name"
            name="org_name"
            value={formData.org_name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="org_description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="org_description"
            name="org_description"
            value={formData.org_description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            id="website_url"
            name="website_url"
            value={formData.website_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
            Logo URL
          </label>
          <input
            type="text"
            id="logo_url"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_info.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={formData.contact_info.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contact_address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="contact_address"
              name="contact_address"
              value={formData.contact_info.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Brand Colors</h3>
          <div>
            <label htmlFor="brand_primary" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              id="brand_primary"
              name="brand_primary"
              value={formData.brand_colors.primary}
              onChange={handleInputChange}
              className="mt-1 block w-full h-10 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="brand_secondary" className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <input
              type="color"
              id="brand_secondary"
              name="brand_secondary"
              value={formData.brand_colors.secondary}
              onChange={handleInputChange}
              className="mt-1 block w-full h-10 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="brand_accent" className="block text-sm font-medium text-gray-700">
              Accent Color
            </label>
            <input
              type="color"
              id="brand_accent"
              name="brand_accent"
              value={formData.brand_colors.accent}
              onChange={handleInputChange}
              className="mt-1 block w-full h-10 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={selectedCategory?.id || ''}
                onChange={(e) => {
                  const category = categories.find(cat => cat.id === Number(e.target.value));
                  setSelectedCategory(category || null);
                  setSelectedSubcategory(null);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories
                  .filter(cat => !cat.parent_id)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={selectedSubcategory?.id || ''}
                  onChange={(e) => {
                    const subcategory = selectedCategory.children?.find(
                      sub => sub.id === Number(e.target.value)
                    );
                    setSelectedSubcategory(subcategory || null);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a subcategory (optional)</option>
                  {selectedCategory.children?.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name_en}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddCategory}
            disabled={!selectedCategory}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Category
          </button>

          {formData.categories.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Categories:</h4>
              <div className="space-y-2">
                {formData.categories.map((cat, index) => {
                  const category = categories.find(c => c.id === cat.category_id);
                  const subcategory = category?.children?.find(s => s.id === cat.subcategory_id);
                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>
                        {category?.name_en}
                        {subcategory && ` > ${subcategory.name_en}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : organization ? 'Update Organization' : 'Create Organization'}
        </button>
      </div>
    </form>
  );
}; 