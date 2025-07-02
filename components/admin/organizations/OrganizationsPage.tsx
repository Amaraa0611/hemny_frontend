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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter organizations by search query first
  const searchedOrganizations = organizations.filter(org =>
    org.org_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('Search Query:', searchQuery);
  console.log('Searched Organizations:', searchedOrganizations.map(o => o.org_name));

  // Group the searched organizations by category
  const groupedOrganizations = searchedOrganizations.reduce((acc, org) => {
    if (org.categories && org.categories.length > 0) {
      org.categories.forEach(category => {
        const categoryName = category.name_en || category.name_mn || 'Uncategorized';
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(org);
      });
    } else {
      if (!acc['Uncategorized']) {
        acc['Uncategorized'] = [];
      }
      acc['Uncategorized'].push(org);
    }
    return acc;
  }, {} as Record<string, Organization[]>);
  console.log('Grouped Organizations:', groupedOrganizations);

  // Get all unique categories from the searched results
  const categories = Object.keys(groupedOrganizations).sort();

  // Filter organizations for the grid view when a specific category is selected
  const filteredOrganizations = groupedOrganizations[selectedCategory] || [];
  console.log('Selected Category:', selectedCategory);
  console.log('Filtered Organizations:', filteredOrganizations.map(o => o.org_name));

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

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by organization name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({searchedOrganizations.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category} ({groupedOrganizations[category].length})
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Grid */}
      {selectedCategory === 'all' ? (
        // Show grouped by categories
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                  {groupedOrganizations[category].length}
                </span>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupedOrganizations[category].map((organization) => (
                  <div key={organization.org_id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{organization.org_name}</h3>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(organization)}
                          className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(organization.org_id)}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {category}
                      </span>
                      {organization.brand_colors?.primary ? (
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: organization.brand_colors.primary }}
                          title={`Primary color: ${organization.brand_colors.primary}`}
                        />
                      ) : (
                        <div className="w-6 h-6" /> // Placeholder for consistent alignment
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Show filtered organizations
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOrganizations.map((organization) => (
            <div key={organization.org_id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{organization.org_name}</h2>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(organization)}
                    className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(organization.org_id)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {selectedCategory}
                </span>
                {organization.brand_colors?.primary ? (
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: organization.brand_colors.primary }}
                    title={`Primary color: ${organization.brand_colors.primary}`}
                  />
                ) : (
                  <div className="w-6 h-6" /> // Placeholder for consistent alignment
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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