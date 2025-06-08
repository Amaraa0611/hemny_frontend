import React, { useState, useEffect } from 'react';
import { Organization, CreateOrganizationData } from '@/types/organization';
import { organizationService } from '@/services/organizationService';
import { Category } from '@/types/category';

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
      accent: '#000000'
    },
    categories: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await organizationService.getAllCategories();
        setCategories(data);
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
        org_description: organization.org_description || '',
        website_url: organization.website_url || '',
        logo_url: organization.logo_url || '',
        location: organization.location || '',
        contact_info: organization.contact_info || {
          email: '',
          phone: '',
          address: ''
        },
        brand_colors: organization.brand_colors || {
          primary: '#000000',
          secondary: '#FFFFFF',
          accent: '#000000'
        },
        categories: organization.categories || []
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
    console.log('Add category button clicked');
    console.log('Current state:', {
      selectedCategory,
      selectedSubcategory,
      currentCategories: formData.categories
    });

    if (!selectedCategory) {
      console.log('No category selected, cannot add');
      return;
    }

    const newCategory = {
      category_id: selectedCategory,
      subcategory_id: selectedSubcategory || null
    };
    console.log('Attempting to add new category:', newCategory);
    
    setFormData((prev: CreateOrganizationData) => {
      // Check if category already exists
      const categoryExists = prev.categories.some(
        (cat: { category_id: number; subcategory_id: number | null }) => 
          cat.category_id === selectedCategory && cat.subcategory_id === selectedSubcategory
      );
      
      console.log('Category exists check:', {
        exists: categoryExists,
        currentCategories: prev.categories,
        newCategory
      });

      if (categoryExists) {
        console.log('Category already exists, not adding');
        return prev;
      }

      const updatedCategories = [...prev.categories, newCategory];
      console.log('Updated categories array:', updatedCategories);
      
      const newFormData = {
        ...prev,
        categories: updatedCategories
      };
      console.log('New form data:', newFormData);
      
      return newFormData;
    });
    
    // Reset selections after adding
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleRemoveCategory = (index: number) => {
    setFormData((prev: CreateOrganizationData) => ({
      ...prev,
      categories: prev.categories.filter((_: unknown, i: number) => i !== index)
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value ? Number(e.target.value) : null;
    console.log('Category changed:', {
      categoryId,
      currentSelectedCategory: selectedCategory,
      currentSelectedSubcategory: selectedSubcategory
    });
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value ? Number(e.target.value) : null;
    console.log('Subcategory changed:', {
      subcategoryId,
      currentSelectedCategory: selectedCategory,
      currentSelectedSubcategory: selectedSubcategory
    });
    setSelectedSubcategory(subcategoryId);
  };

  const getSubcategories = (categoryId: number) => {
    return categories.filter(cat => cat.parent_id === categoryId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting form submission...');
    console.log('Current form data:', formData);
    console.log('Categories in form data:', formData.categories);

    if (!formData.org_name) {
      setError('Organization name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Preparing submission data...');
      
      // Ensure categories are properly formatted and not empty
      const formattedCategories = formData.categories.map(cat => ({
        category_id: Number(cat.category_id),
        subcategory_id: cat.subcategory_id ? Number(cat.subcategory_id) : null
      }));
      
      console.log('Formatted categories:', formattedCategories);
      
      // Create the submission data with explicit category structure
      const submissionData = {
        org_name: formData.org_name,
        org_description: formData.org_description || '',
        website_url: formData.website_url || '',
        logo_url: formData.logo_url || '',
        location: formData.location || '',
        contact_info: formData.contact_info,
        brand_colors: formData.brand_colors,
        categories: formattedCategories // Ensure categories are included
      };
      
      console.log('Final submission data:', submissionData);
      console.log('Categories in submission:', submissionData.categories);

      if (organization) {
        console.log('Updating existing organization with ID:', organization.org_id);
        // First update the organization
        const result = await organizationService.update(organization.org_id, submissionData);
        console.log('Update result:', result);
        
        // Then update the categories separately
        if (formattedCategories.length > 0) {
          console.log('Updating categories separately:', formattedCategories);
          await organizationService.updateCategories(organization.org_id, formattedCategories);
        }
      } else {
        console.log('Creating new organization...');
        const result = await organizationService.create(submissionData);
        console.log('Create result:', result);
        
        // If creation was successful and we have categories, update them
        if (result.org_id && formattedCategories.length > 0) {
          console.log('Updating categories for new organization:', formattedCategories);
          await organizationService.updateCategories(result.org_id, formattedCategories);
        }
      }
      console.log('Operation completed successfully');
      onSuccess();
    } catch (err) {
      console.error('Error during submission:', err);
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
          <div className="flex gap-4">
            <select
              value={selectedCategory || ''}
              onChange={handleCategoryChange}
              className="flex-1 rounded-md border border-gray-300 p-2"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name_en}
                </option>
              ))}
            </select>
            
            {selectedCategory && (
              <select
                value={selectedSubcategory || ''}
                onChange={handleSubcategoryChange}
                className="flex-1 rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Subcategory</option>
                {getSubcategories(selectedCategory).map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name_en}
                  </option>
                ))}
              </select>
            )}
            
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={!selectedCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Add Category
            </button>
          </div>
          
          {/* Display selected categories */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Selected Categories:</h4>
            <div className="space-y-2">
              {formData.categories.map((cat, index) => {
                const category = categories.find(c => c.id === cat.category_id);
                const subcategory = cat.subcategory_id 
                  ? getSubcategories(cat.category_id).find(s => s.id === cat.subcategory_id)
                  : null;
                
                return (
                  <div key={index} className="flex items-center gap-2">
                    <span>{category?.name_en}</span>
                    {subcategory && <span>- {subcategory.name_en}</span>}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
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