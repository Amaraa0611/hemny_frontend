import React, { useState, useEffect, useCallback } from 'react';
import { Organization } from '../../../types/organization';
import { organizationService } from '../../../services/organizationService';
import OrganizationForm from './OrganizationForm';
import Image from 'next/image';

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      const data = await organizationService.getAll();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('Failed to fetch organizations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowForm(true);
  };

  const handleDeleteClick = (org: Organization) => {
    setOrgToDelete(org);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orgToDelete) return;

    try {
      await organizationService.delete(orgToDelete.org_id);
      setOrganizations(organizations.filter(org => org.org_id !== orgToDelete.org_id));
      setShowDeleteModal(false);
      setOrgToDelete(null);
    } catch (error) {
      console.error('Error deleting organization:', error);
      setError('Failed to delete organization');
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setSelectedOrganization(null);
    fetchOrganizations();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <button
          onClick={() => {
            setSelectedOrganization(null);
            setShowForm(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Organization
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map(organization => (
          <div
            key={organization.org_id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                {organization.logo_url && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={organization.logo_url}
                      alt={`${organization.org_name} logo`}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold">{organization.org_name}</h2>
                  <p className="text-gray-600 mb-2">{organization.org_description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(organization)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(organization)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Website: {organization.website_url || 'N/A'}</p>
              <p>Email: {organization.contact_info?.email || 'N/A'}</p>
              <p>Phone: {organization.contact_info?.phone || 'N/A'}</p>
              <p>Address: {organization.contact_info?.address || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <OrganizationForm
          organization={selectedOrganization || undefined}
          onSubmit={handleFormSubmit}
        />
      )}

      {showDeleteModal && orgToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete {orgToDelete.org_name}?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOrgToDelete(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage; 