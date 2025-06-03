import React, { useState, useEffect, useCallback } from 'react';
import { Offer, OfferType, DiscountType, DiscountOffer, CashbackOffer, LoyaltyOffer } from '../../../types/offer';
import { offerService } from '../../../services/offerService';
import { organizationService } from '../../../services/organizationService';
import { logoService } from '../../../services/logoService';
import { ImageWithFallback } from '../../shared/ImageWithFallback';

interface OfferFormProps {
  offer: Offer | null;
  offerType: OfferType;
  onClose: () => void;
  onSubmit: () => void;
}

const OfferForm: React.FC<OfferFormProps> = ({
  offer,
  offerType,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    org_id: '',
    category_id: '',
    offer_type: offerType,
    offer_title: '',
    offer_description: '',
    start_date: '',
    end_date: '',
    is_active: true,
    is_featured: false,
    picture_url: '',
    payment_org: '1',
    payment_option: '',
    payment_option_2: '',
    terms_conditions: '',
    // Discount specific fields
    discount_value: '',
    discount_type: 'Percentage',
    offer_code: '',
    // Cashback specific fields
    cashback_rate: '',
    description: '',
    // Loyalty specific fields
    loyalty_points: '',
    membership_requirement: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add state for organization logo
  const [organizationLogo, setOrganizationLogo] = useState<string>('');

  // Add state for organization names
  const [organizations, setOrganizations] = useState<Array<{ org_id: number; org_name: string }>>([]);
  const [selectedOrgName, setSelectedOrgName] = useState('');

  // Add state for organization categories
  const [orgCategories, setOrgCategories] = useState<Array<{ 
    id: number; 
    name_en: string; 
    name_mn: string;
    is_subcategory?: boolean;
  }>>([]);

  // Add state for offer image preview
  const [offerImagePreview, setOfferImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Add function to fetch all organizations
  const fetchOrganizations = async () => {
    try {
      const orgs = await organizationService.getAll();
      console.log('Fetched organizations:', orgs);
      setOrganizations(orgs);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  // Update the useEffect to fetch both organizations and categories when component mounts
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Update the organization fetch function to get categories and other details
  const fetchOrganizationDetails = useCallback(async (orgName: string) => {
    try {
      if (!orgName) {
        console.log('No organization name provided');
        return;
      }
      const response = await organizationService.getByName(orgName);
      console.log('Organization response:', response);

      if (response?.message === "Organizations found" && response.data?.length > 0) {
        const organization = response.data[0];
        console.log('Selected organization details:', organization);

        if (organization.org_id) {
          const orgId = Number(organization.org_id);
          console.log('Parsed org_id:', orgId);

          setFormData(prev => {
            const updatedData = {
              ...prev,
              org_id: orgId.toString(),
              picture_url: organization.logo_url || ''
            };
            console.log('Updated form data:', updatedData);
            return updatedData;
          });

          try {
            console.log('Fetching logos for org_id:', orgId);
            const logos = await logoService.getByOrgId(orgId);
            console.log('Fetched logos:', logos);
            
            const logoUrl = (logos && logos.length > 0) 
              ? (logos[0].url.startsWith('/') ? logos[0].url : `/${logos[0].url}`)
              : (organization.logo_url || '');
            setOrganizationLogo(logoUrl);
          } catch (logoError) {
            console.error('Error fetching logos:', logoError);
            setOrganizationLogo(organization.logo_url || '');
          }

          if (Array.isArray(organization.categories)) {
            console.log('Setting categories:', organization.categories);
            setOrgCategories(organization.categories);
            if (organization.categories.length === 1) {
              setFormData(prev => ({
                ...prev,
                category_id: organization.categories[0].id.toString()
              }));
            }
          }
        } else {
          console.error('Invalid org_id in organization:', organization);
        }
      } else {
        console.log('No organization found or invalid response format');
        setError('Organization not found');
        setOrgCategories([]);
        setOrganizationLogo('');
      }
    } catch (error) {
      console.error('Error fetching organization details:', error);
      setError('Failed to fetch organization details');
      setOrgCategories([]);
      setOrganizationLogo('');
    }
  }, []);

  // Update the organization selection handler
  const handleOrgSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    console.log('Selected organization name:', name); // Debug log
    setSelectedOrgName(name);
    if (name) {
      fetchOrganizationDetails(name);
    } else {
      console.log('No organization name selected'); // Debug log
      setOrganizationLogo('');
      setOrgCategories([]);
      setFormData(prev => ({
        ...prev,
        org_id: '',
        picture_url: '',
        category_id: ''
      }));
    }
  };

  useEffect(() => {
    if (offer) {
      console.log('Editing offer:', offer);
      const org = organizations.find(o => o.org_id === offer.org_id);
      console.log('Found organization:', org);
      if (org) {
        setSelectedOrgName(org.org_name);
        fetchOrganizationDetails(org.org_name);
      } else {
        console.log('No matching organization found for org_id:', offer.org_id);
      }

      let termsAndConditions = offer.terms_conditions || '';
      if (offerType === 'CASHBACK' && offer.CashbackOffer?.terms_conditions) {
        termsAndConditions = offer.CashbackOffer.terms_conditions;
      }

      setFormData(prev => ({
        ...prev,
        ...offer,
        org_id: offer.org_id?.toString() || '',
        category_id: offer.category_id?.toString() || '',
        payment_org: offer.payment_org?.toString() || '1',
        offer_type: offer.offer_type || offerType,
        offer_title: offer.offer_title || '',
        offer_description: offer.offer_description || '',
        start_date: offer.start_date || '',
        end_date: offer.end_date || '',
        is_active: offer.is_active ?? true,
        is_featured: offer.is_featured ?? false,
        picture_url: offer.picture_url || '',
        payment_option: offer.payment_option || '',
        payment_option_2: offer.payment_option_2 || '',
        terms_conditions: termsAndConditions,
        discount_value: 'discount_value' in offer ? offer.discount_value : '',
        discount_type: 'discount_type' in offer ? offer.discount_type : 'Percentage',
        offer_code: 'offer_code' in offer ? offer.offer_code : '',
        cashback_rate: offer.CashbackOffer?.cashback_rate || '',
        description: offer.CashbackOffer?.description || '',
        loyalty_points: 'loyalty_points' in offer ? offer.loyalty_points : '',
        membership_requirement: 'membership_requirement' in offer ? offer.membership_requirement : ''
      }));
    }
  }, [offer, offerType, organizations, fetchOrganizationDetails]);

  // Add function to handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setIsUploadingImage(true);

    try {
      // Create FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'offer');
      uploadFormData.append('org_id', formData.org_id);
      
      // Add offer type to determine the correct directory
      uploadFormData.append('offer_type', offerType.toLowerCase());
      
      // Add organization name for the path
      const orgName = organizations.find(org => org.org_id.toString() === formData.org_id)?.org_name;
      if (!orgName) {
        throw new Error('Organization name not found');
      }
      uploadFormData.append('org_name', orgName.toLowerCase().replace(/\s+/g, '_'));

      // Upload to backend
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Update form data with the new image path
      setFormData(prev => ({
        ...prev,
        picture_url: data.path
      }));

      // Set preview
      setOfferImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.org_id) {
        throw new Error('Organization ID is required');
      }

      console.log('Form data before submit:', formData); // Debug log to verify org_id

      const baseData = {
        org_id: parseInt(formData.org_id),
        category_id: parseInt(formData.category_id),
        offer_type: offerType,
        offer_title: formData.offer_title,
        offer_description: formData.offer_description,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        picture_url: formData.picture_url || (organizationLogo.startsWith('/') 
          ? organizationLogo 
          : `/${organizationLogo}`),
        payment_org: parseInt(formData.payment_org) as 1 | 2,
        payment_option: formData.payment_option,
        payment_option_2: formData.payment_option_2,
        terms_conditions: formData.terms_conditions,
      };

      let submitData: Omit<Offer, 'id'>;
      
      if (offerType === 'DISCOUNT') {
        submitData = {
          ...baseData,
          offer_type: 'DISCOUNT',
          discount_value: formData.discount_value,
          discount_type: formData.discount_type as DiscountType,
          offer_code: formData.offer_code,
        } as Omit<DiscountOffer, 'id'>;
      } else if (offerType === 'CASHBACK') {
        submitData = {
          ...baseData,
          offer_type: 'CASHBACK',
          cashback_rate: formData.cashback_rate,
          description: formData.description,
          CashbackOffer: {
            offer_id: offer?.offer_id || 0,
            cashback_rate: formData.cashback_rate,
            terms_conditions: formData.terms_conditions,
            description: formData.description,
            image_url: formData.picture_url || null,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: true
          }
        } as Omit<CashbackOffer, 'id'>;
      } else if (offerType === 'LOYALTY') {
        submitData = {
          ...baseData,
          offer_type: 'LOYALTY',
          loyalty_points: formData.loyalty_points,
          membership_requirement: formData.membership_requirement,
        } as Omit<LoyaltyOffer, 'id'>;
      } else {
        throw new Error('Invalid offer type');
      }

      console.log('Submitting offer data:', submitData);

      if (offer?.offer_id) {
        await offerService.update(offer.offer_id, submitData as Partial<Offer>);
      } else {
        await offerService.create(submitData);
      }

      onSubmit();
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while saving the offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {offer ? 'Edit Offer' : 'Create New Offer'}
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
          {/* Common Fields */}
          <div>
            <label className="block mb-1">Offer Title</label>
            <input
              type="text"
              value={formData.offer_title}
              onChange={e => setFormData({ ...formData, offer_title: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={formData.offer_description}
              onChange={e => setFormData({ ...formData, offer_description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Organization</label>
            <select
              value={selectedOrgName}
              onChange={handleOrgSelect}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Organization</option>
              {organizations && organizations.length > 0 ? (
                organizations.map((org) => (
                  <option key={org.org_id} value={org.org_name}>
                    {org.org_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Loading organizations...</option>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-1">Category</label>
            <select
              value={formData.category_id}
              onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
              disabled={!selectedOrgName}
            >
              <option value="">Select Category</option>
              {orgCategories && orgCategories.length > 0 ? (
                orgCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_en} / {category.name_mn}
                    {category.is_subcategory ? ' (Sub-category)' : ' (Main category)'}
                  </option>
                ))
              ) : (
                selectedOrgName ? (
                  <option value="" disabled>No categories found for this organization</option>
                ) : (
                  <option value="" disabled>Select an organization first</option>
                )
              )}
            </select>
            {selectedOrgName && (!orgCategories || orgCategories.length === 0) && (
              <p className="text-sm text-red-500 mt-1">
                No categories found for this organization
              </p>
            )}
          </div>

          {/* Add logo preview */}
          {organizationLogo && (
            <div className="mt-4">
              <label className="block mb-1">Organization Logo</label>
              <div className="relative w-32 h-32 border rounded overflow-hidden">
                <ImageWithFallback
                  src={organizationLogo}
                  alt={`${selectedOrgName || 'Organization'} logo`}
                  className="max-w-full max-h-full object-contain p-1"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This logo will be used for the offer
              </p>
            </div>
          )}

          {/* Replace the existing picture_url input with this new image upload section */}
          <div>
            <label className="block mb-1">Offer Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0">
                {(offerImagePreview || formData.picture_url) && (
                  <div className="relative w-32 h-32 border rounded overflow-hidden">
                    <ImageWithFallback
                      src={offerImagePreview || formData.picture_url}
                      alt="Offer preview"
                      className="max-w-full max-h-full object-contain p-1"
                    />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  disabled={isUploadingImage}
                />
                {isUploadingImage && (
                  <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Upload an image for this offer. Recommended size: 800x600 pixels.
            </p>
          </div>

          {/* Add payment options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Payment Option</label>
              <input
                type="text"
                value={formData.payment_option}
                onChange={e => setFormData({ ...formData, payment_option: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
                placeholder="e.g., Card, Cash"
              />
            </div>
            <div>
              <label className="block mb-1">Payment Option 2 (Optional)</label>
              <input
                type="text"
                value={formData.payment_option_2}
                onChange={e => setFormData({ ...formData, payment_option_2: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Cash"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {offerType === 'DISCOUNT' && (
            <>
              <div>
                <label className="block mb-1">Discount Value</label>
                <input
                  type="text"
                  value={formData.discount_value}
                  onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Offer Code</label>
                <input
                  type="text"
                  value={formData.offer_code}
                  onChange={e => setFormData({ ...formData, offer_code: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </>
          )}

          {offerType === 'CASHBACK' && (
            <div>
              <label className="block mb-1">Cashback Rate</label>
              <input
                type="text"
                value={formData.cashback_rate}
                onChange={e => setFormData({ ...formData, cashback_rate: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          )}

          {offerType === 'LOYALTY' && (
            <>
              <div>
                <label className="block mb-1">Loyalty Points</label>
                <input
                  type="text"
                  value={formData.loyalty_points}
                  onChange={e => setFormData({ ...formData, loyalty_points: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Membership Requirement</label>
                <input
                  type="text"
                  value={formData.membership_requirement}
                  onChange={e => setFormData({ ...formData, membership_requirement: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1">Terms & Conditions</label>
            <textarea
              value={formData.terms_conditions}
              onChange={e => setFormData({ ...formData, terms_conditions: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm; 