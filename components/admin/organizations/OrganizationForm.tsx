import React, { useState, useEffect } from 'react';
import { Category } from '../../../types/category';
import { Organization } from '../../../types/organization';
import { organizationService } from '../../../services/organizationService';
import { categoryService } from '../../../services/categoryService';

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string) => {
  return /^\+?[\d\s-]{8,}$/.test(phone);
};

interface OrganizedCategory extends Category {
  subcategories: Category[];
}

interface OrganizationCategory {
  category_id: number;
  subcategory_id: number | null;
}

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: () => void;
}

interface FormData {
  org_name: string;
  org_description: string;
  logo_url: string;
  website_url: string;
  location: string;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  brand_colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  categories: Array<{
    category_id: number;
    subcategory_id: number | null;
  }>;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    org_name: '',
    org_description: '',
    logo_url: '',
    website_url: '',
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

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (organization) {
      setFormData({
        org_name: organization.org_name || '',
        org_description: organization.org_description || '',
        logo_url: organization.logo_url || '',
        website_url: organization.website_url || '',
        location: organization.location || '',
        contact_info: {
          email: organization.contact_info?.email || '',
          phone: organization.contact_info?.phone || '',
          address: organization.contact_info?.address || ''
        },
        brand_colors: organization.brand_colors || {
          primary: '#000000',
          secondary: '#FFFFFF',
          accent: '#000000'
        },
        categories: organization.categories?.map(cat => ({
          category_id: cat.id,
          subcategory_id: cat.OrganizationCategory?.subcategory_id || null
        })) || []
      });

      // Set initial category and subcategory if they exist
      if (organization.categories?.[0]) {
        setSelectedCategory(organization.categories[0].id);
        setSelectedSubcategory(organization.categories[0].OrganizationCategory?.subcategory_id || null);
      }
    } else {
      // Reset form data for new organization
      setFormData({
        org_name: '',
        org_description: '',
        logo_url: '',
        website_url: '',
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
    }
  }, [organization]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const getSubcategories = (categoryId: number) => {
    return categories.filter(cat => cat.parent_id === categoryId);
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
    
    setFormData(prev => {
      // Check if category already exists
      const categoryExists = prev.categories.some(
        cat => cat.category_id === selectedCategory && cat.subcategory_id === selectedSubcategory
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

  const handleRemoveCategory = async (index: number) => {
    const categoryToRemove = formData.categories[index];
    
    try {
      if (organization?.org_id) {
        // For existing organization, remove category immediately
        await organizationService.deleteCategoryCombination(
          organization.org_id,
          categoryToRemove.category_id,
          categoryToRemove.subcategory_id || undefined
        );
      }

      setFormData(prev => {
        const newCategories = prev.categories.filter((_, i) => i !== index);
        return {
          ...prev,
          categories: newCategories
        };
      });
    } catch (error) {
      console.error('Error removing category:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove category');
    }
  };

  const validateForm = () => {
    const newErrors: {
      org_name?: string;
      logo_url?: string;
      website_url?: string;
      email?: string;
      phone?: string;
    } = {};

    if (!formData.org_name.trim()) {
      newErrors.org_name = 'Organization name is required';
    }

    if (formData.website_url && !isValidUrl(formData.website_url)) {
      newErrors.website_url = 'Invalid website URL';
    }

    if (formData.contact_info.email && !isValidEmail(formData.contact_info.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.contact_info.phone && !isValidPhone(formData.contact_info.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors).join(', '));
      return false;
    }

    return true;
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
      setIsSubmitting(true);
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
      onSubmit();
    } catch (err) {
      console.error('Error during submission:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {organization ? 'Edit Organization' : 'Create New Organization'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Organization Name *</label>
            <input
              type="text"
              value={formData.org_name}
              onChange={e => setFormData(prev => ({ ...prev, org_name: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={formData.org_description}
              onChange={e => setFormData(prev => ({ ...prev, org_description: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1">Logo URL</label>
            <input
              type="text"
              value={formData.logo_url}
              onChange={e => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block mb-1">Website URL</label>
            <input
              type="text"
              value={formData.website_url}
              onChange={e => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1">Contact Information</label>
            <div className="space-y-2">
              <input
                type="email"
                value={formData.contact_info.email}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  contact_info: { ...prev.contact_info, email: e.target.value }
                }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Email"
              />
              <input
                type="tel"
                value={formData.contact_info.phone}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  contact_info: { ...prev.contact_info, phone: e.target.value }
                }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Phone"
              />
              <textarea
                value={formData.contact_info.address}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  contact_info: { ...prev.contact_info, address: e.target.value }
                }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Address"
                rows={2}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Brand Colors</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm">Primary</label>
                <input
                  type="color"
                  value={formData.brand_colors.primary}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    brand_colors: { ...prev.brand_colors, primary: e.target.value }
                  }))}
                  className="w-full h-10"
                />
              </div>
              <div>
                <label className="block text-sm">Secondary</label>
                <input
                  type="color"
                  value={formData.brand_colors.secondary}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    brand_colors: { ...prev.brand_colors, secondary: e.target.value }
                  }))}
                  className="w-full h-10"
                />
              </div>
              <div>
                <label className="block text-sm">Accent</label>
                <input
                  type="color"
                  value={formData.brand_colors.accent}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    brand_colors: { ...prev.brand_colors, accent: e.target.value }
                  }))}
                  className="w-full h-10"
                />
              </div>
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

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onSubmit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm; 