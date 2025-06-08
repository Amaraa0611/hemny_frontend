import React, { useState, useEffect } from 'react';
import { Organization } from '../../../types/organization';
import { organizationService } from '../../../services/organizationService';
import { Category } from '../../../types/category';

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: () => void;
}

interface OrganizationFormData {
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
    categoryId: number;
    subcategoryId: number | null;
  }>;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization, onSubmit }) => {
  const [formData, setFormData] = useState<OrganizationFormData>({
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

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

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
          categoryId: cat.id,
          subcategoryId: cat.OrganizationCategory?.subcategory_id || null
        })) || []
      });

      // Set initial category and subcategory if they exist
      if (organization.categories?.[0]) {
        setSelectedCategory(organization.categories[0].id);
        setSelectedSubcategory(organization.categories[0].OrganizationCategory?.subcategory_id || null);
      }
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        categoryIds: formData.categories
      };

      if (organization?.org_id) {
        await organizationService.update(organization.org_id, submitData);
      } else {
        await organizationService.create(submitData);
      }

      onSubmit();
    } catch (error) {
      console.error('Error submitting organization:', error);
      setError('Failed to submit organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = () => {
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        categories: [
          ...prev.categories,
          {
            categoryId: selectedCategory,
            subcategoryId: selectedSubcategory
          }
        ]
      }));
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  };

  const handleRemoveCategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const getSubcategories = (categoryId: number) => {
    return categories.find(cat => cat.id === categoryId)?.children || [];
  };

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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.org_name}
              onChange={e => setFormData({ ...formData, org_name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              value={formData.org_description}
              onChange={e => setFormData({ ...formData, org_description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Logo URL</label>
            <input
              type="text"
              value={formData.logo_url}
              onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="/images/logos/example.png"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the path to the organization logo (e.g., /images/logos/example.png)
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={e => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="City, Country"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={formData.contact_info.email}
              onChange={e => setFormData({
                ...formData,
                contact_info: { ...formData.contact_info, email: e.target.value }
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="contact@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Phone</label>
            <input
              type="tel"
              value={formData.contact_info.phone}
              onChange={e => setFormData({
                ...formData,
                contact_info: { ...formData.contact_info, phone: e.target.value }
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="+1234567890"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Address</label>
            <textarea
              value={formData.contact_info.address}
              onChange={e => setFormData({
                ...formData,
                contact_info: { ...formData.contact_info, address: e.target.value }
              })}
              className="w-full border rounded px-3 py-2"
              rows={2}
              placeholder="123 Main St, City, Country"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Brand Colors</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Primary</label>
                <input
                  type="color"
                  value={formData.brand_colors.primary}
                  onChange={e => setFormData({
                    ...formData,
                    brand_colors: { ...formData.brand_colors, primary: e.target.value }
                  })}
                  className="w-full h-10 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Secondary</label>
                <input
                  type="color"
                  value={formData.brand_colors.secondary}
                  onChange={e => setFormData({
                    ...formData,
                    brand_colors: { ...formData.brand_colors, secondary: e.target.value }
                  })}
                  className="w-full h-10 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Accent</label>
                <input
                  type="color"
                  value={formData.brand_colors.accent}
                  onChange={e => setFormData({
                    ...formData,
                    brand_colors: { ...formData.brand_colors, accent: e.target.value }
                  })}
                  className="w-full h-10 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Categories</label>
            <div className="space-y-2">
              {formData.categories.map((cat, index) => {
                const category = categories.find(c => c.id === cat.categoryId);
                const subcategory = category?.children?.find(s => s.id === cat.subcategoryId);
                return (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>
                      {category?.name_en} {subcategory ? `- ${subcategory.name_en}` : ''}
                    </span>
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
              <div className="flex gap-2">
                <select
                  value={selectedCategory || ''}
                  onChange={e => {
                    setSelectedCategory(Number(e.target.value));
                    setSelectedSubcategory(null);
                  }}
                  className="flex-1 border rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <select
                    value={selectedSubcategory || ''}
                    onChange={e => setSelectedSubcategory(Number(e.target.value))}
                    className="flex-1 border rounded px-3 py-2"
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
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
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