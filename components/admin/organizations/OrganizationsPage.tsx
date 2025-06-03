import React, { useState, useEffect, useCallback } from 'react';
import { Organization } from '../../../types/organization';
import { organizationService } from '../../../services/organizationService';
import OrganizationForm from './OrganizationForm';
import Image from 'next/image';

const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganizations = useCallback(async () => {
    try {
      const data = await organizationService.getAll();
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleDelete = async (orgId: number) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }
    
    try {
      await organizationService.delete(orgId);
      setOrganizations(organizations.filter(org => org.org_id !== orgId));
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const getLogoUrl = (logoPath: string) => {
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <button
          onClick={() => {
            setEditingOrg(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Organization
        </button>
      </div>

      <div className="grid gap-6">
        {organizations.map(org => (
          <div key={org.org_id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  {/* Main Organization Logo */}
                  {org.logos && org.logos.length > 0 && (
                    <div className="relative w-32 h-32 border rounded overflow-hidden">
                      <Image
                        src={getLogoUrl(org.logos[0].url)}
                        alt={org.org_name}
                        width={128}
                        height={128}
                        className="max-w-full max-h-full object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{org.org_name}</h3>
                    <p className="text-gray-600 mt-1">{org.org_description}</p>
                  </div>
                </div>

                {/* Organization Details */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    {org.contact_info && (
                      <div className="mt-1">
                        <p>{org.contact_info.email}</p>
                        <p>{org.contact_info.phone}</p>
                        <p>{org.contact_info.address}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{org.location}</p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                {org.CashbackOffer?.terms_conditions && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Terms and Conditions</p>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">{org.CashbackOffer.terms_conditions}</pre>
                    </div>
                  </div>
                )}

                {/* Offer Details */}
                {org.offer_type === 'CASHBACK' && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Cashback Offer Details</p>
                    <div className="mt-1 space-y-2">
                      {org.CashbackOffer?.cashback_rate && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Cashback Rate:</span> {org.CashbackOffer.cashback_rate}
                        </p>
                      )}
                      {org.CashbackOffer?.description && (
                        <div className="mt-2">
                          <p className="font-medium text-sm text-gray-700">Description:</p>
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-1">{org.CashbackOffer.description}</pre>
                        </div>
                      )}
                      {org.offer_description && (
                        <div className="mt-2">
                          <p className="font-medium text-sm text-gray-700">Offer Description:</p>
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-1">{org.offer_description}</pre>
                        </div>
                      )}
                      {org.start_date && org.end_date && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Valid:</span> {new Date(org.start_date).toLocaleDateString()} - {new Date(org.end_date).toLocaleDateString()}
                        </p>
                      )}
                      {org.payment_option && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Payment Option:</span> {org.payment_option}
                          {org.payment_option_2 && `, ${org.payment_option_2}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* All Organization Logos */}
                {org.logos && org.logos.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      Organization Logos ({org.logos.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {org.logos.map(logo => (
                        <div 
                          key={logo.id} 
                          className="relative group bg-white rounded-lg p-3 border hover:border-blue-500 transition-colors"
                        >
                          <div className="aspect-w-16 aspect-h-9 flex items-center justify-center">
                            <Image
                              src={getLogoUrl(logo.url)}
                              alt={`${org.org_name} ${logo.offer_type} logo`}
                              width={128}
                              height={128}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="text-white text-sm text-center p-2">
                              <p className="font-semibold">{logo.offer_type}</p>
                              <p>{logo.format}</p>
                              <p>{logo.color_scheme}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingOrg(org);
                    setIsFormOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(org.org_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <OrganizationForm
          organization={editingOrg}
          onClose={() => setIsFormOpen(false)}
          onSubmit={() => {
            console.log('Form submitted, current editingOrg:', editingOrg);
            setIsFormOpen(false);
            fetchOrganizations();
          }}
        />
      )}
    </div>
  );
};

export default OrganizationsPage; 