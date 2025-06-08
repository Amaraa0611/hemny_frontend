import React, { useState, useEffect } from 'react';
import { Organization } from '../../../types/organization';
import { organizationService } from '../../../services/organizationService';

interface OrganizationFormProps {
  organization?: Organization;
  onSubmit: () => void;
}

interface OrganizationFormData {
  org_name: string;
  org_description: string;
  logo_url: string;
  website_url: string;
  contact_info: {
    email: string;
    phone: string;
    address: string;
  };
  is_active: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization, onSubmit }) => {
  const [formData, setFormData] = useState<OrganizationFormData>({
    org_name: '',
    org_description: '',
    logo_url: '',
    website_url: '',
    contact_info: {
      email: '',
      phone: '',
      address: ''
    },
    is_active: true
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (organization) {
      setFormData({
        org_name: organization.org_name || '',
        org_description: organization.org_description || '',
        logo_url: organization.logo_url || '',
        website_url: organization.website_url || '',
        contact_info: {
          email: organization.contact_info?.email || '',
          phone: organization.contact_info?.phone || '',
          address: organization.contact_info?.address || ''
        },
        is_active: true
      });
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (organization?.org_id) {
        await organizationService.update(organization.org_id, formData);
      } else {
        await organizationService.create(formData);
      }

      onSubmit();
    } catch (error) {
      console.error('Error submitting organization:', error);
      setError('Failed to submit organization');
    } finally {
      setIsSubmitting(false);
    }
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