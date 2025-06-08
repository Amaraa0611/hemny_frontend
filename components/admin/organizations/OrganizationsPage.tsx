import React, { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/types/organization';
import { organizationService } from '@/services/organizationService';
import { OrganizationForm } from './OrganizationForm';

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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await organizationService.delete(id);
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <button
          onClick={() => {
            setSelectedOrganization(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Organization
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((organization) => (
          <div key={organization.org_id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{organization.org_name}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(organization)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(organization.org_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{organization.org_description}</p>
            <div className="space-y-2">
              <p><span className="font-medium">Website:</span> {organization.website_url}</p>
              <p><span className="font-medium">Location:</span> {organization.location}</p>
              <p><span className="font-medium">Email:</span> {organization.contact_info?.email}</p>
              <p><span className="font-medium">Phone:</span> {organization.contact_info?.phone}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal/Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedOrganization ? 'Edit Organization' : 'Add Organization'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedOrganization(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <OrganizationForm
              organization={selectedOrganization || undefined}
              onSuccess={() => {
                setShowForm(false);
                setSelectedOrganization(null);
                fetchOrganizations();
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
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
                onClick={() => handleDelete(orgToDelete.org_id)}
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