import React, { useState, useEffect, useCallback } from 'react';
import { Offer, OfferType, DiscountOffer } from '../../../types/offer';
import { Organization } from '../../../types/organization';
import { offerService } from '../../../services/offerService';
import { organizationService } from '../../../services/organizationService';

interface OfferFormProps {
  offer?: Offer;
  offerType: OfferType;
  onClose: () => void;
  onSubmit: () => void;
}

interface FormData {
  offer_id?: number;
  org_id: number;
  category_id: number | null;
  offer_type: OfferType;
  offer_title: string;
  offer_description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean;
  picture_url: string;
  payment_org: number;
  payment_option: string;
  payment_option_2: string;
  source_link: string;
  terms_conditions: string;
  discount_value: string;
  discount_type: string;
  offer_code: string;
  cashback_rate: string;
  loyalty_points: string;
  membership_requirement: string;
}

const OfferForm: React.FC<OfferFormProps> = ({ offer, offerType, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    offer_type: offerType,
    org_id: offer?.org_id || 0,
    category_id: offer?.category_id || null,
    offer_title: offer?.offer_title || '',
    offer_description: offer?.offer_description || '',
    start_date: offer?.start_date || '',
    end_date: offer?.end_date || '',
    is_active: offer?.is_active || false,
    is_featured: offer?.is_featured || false,
    picture_url: offer?.picture_url || '',
    payment_org: offer?.payment_org || 0,
    payment_option: offer?.payment_option || '',
    payment_option_2: offer?.payment_option_2 || '',
    source_link: offer?.source_link || '',
    terms_conditions: offer?.terms_conditions || '',
    discount_value: offer?.DiscountOffer?.discount_value || '',
    discount_type: offer?.DiscountOffer?.discount_type || 'Percentage',
    offer_code: offer?.DiscountOffer?.offer_code || '',
    cashback_rate: offer?.CashbackOffer?.cashback_rate || '',
    loyalty_points: offer?.LoyaltyOffer?.loyalty_points || '',
    membership_requirement: offer?.LoyaltyOffer?.membership_requirement || ''
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [financeOrganizations, setFinanceOrganizations] = useState<Organization[]>([]);
  const [selectedOrgName, setSelectedOrgName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the organization fetch function to get categories and other details
  const fetchOrganizationDetails = useCallback(async (orgName?: string) => {
    try {
      if (!orgName) {
        console.log('No organization name provided');
        return;
      }

      console.log('Fetching details for organization:', orgName);
      const org = organizations.find(o => o.org_name === orgName);
      
      if (!org) {
        console.log('Organization not found:', orgName);
        return;
      }

      const orgId = org.org_id;
      console.log('Found organization ID:', orgId);

      // Get organization categories
      const orgCategories = await organizationService.getCategories(orgId);
      console.log('Organization categories:', orgCategories);

      // If the organization has categories, set the first one as default
      if (orgCategories && orgCategories.length > 0) {
        const firstCategory = orgCategories[0];
        setFormData(prev => ({
          ...prev,
          category_id: firstCategory.id
        }));
      } else {
        console.log('No categories found for organization');
        // Set category_id to null if no categories are found
        setFormData(prev => ({
          ...prev,
          category_id: null
        }));
      }
    } catch (error) {
      console.error('Error in fetchOrganizationDetails:', error);
      // Set category_id to null on error
      setFormData(prev => ({
        ...prev,
        category_id: null
      }));
    }
  }, [organizations]);

  // Update the organization selection handler
  const handleOrganizationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrgName = e.target.value;
    setSelectedOrgName(selectedOrgName);
    setFormData(prev => ({
      ...prev,
      org_id: organizations.find(org => org.org_name === selectedOrgName)?.org_id || 0
    }));
    fetchOrganizationDetails(selectedOrgName);
  }, [organizations, fetchOrganizationDetails]);

  // Add function to fetch finance organizations
  const fetchFinanceOrganizations = useCallback(async () => {
    try {
      const allOrgs = await organizationService.getAll();
      const financeOrgs = allOrgs.filter(org => 
        org.categories.some(cat => 
          cat.name_en === 'Finance & Insurance' || 
          cat.name_mn === 'Санхүү & Даатгал'
        )
      );
      setFinanceOrganizations(financeOrgs);
    } catch (error) {
      console.error('Error fetching finance organizations:', error);
    }
  }, []);

  // Fetch organizations and finance organizations when component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await organizationService.getAll();
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
    fetchOrganizations();
    fetchFinanceOrganizations();
  }, [fetchFinanceOrganizations]);

  // Update form data when offer changes
  useEffect(() => {
    if (offer) {
      console.log('Loading offer data:', offer); // Debug log
      // Find the organization name using org_id
      const org = organizations.find(o => o.org_id === offer.org_id);
      if (org) {
        setSelectedOrgName(org.org_name);
      }

      // Set form data with proper type handling
      const newFormData = {
        offer_id: offer.offer_id,
        org_id: offer.org_id,
        category_id: offer.category_id,
        offer_type: offer.offer_type,
        offer_title: offer.offer_title,
        offer_description: offer.offer_description,
        start_date: offer.start_date,
        end_date: offer.end_date,
        is_active: offer.is_active,
        is_featured: offer.is_featured,
        picture_url: offer.picture_url,
        payment_org: offer.payment_org,
        payment_option: offer.payment_option,
        payment_option_2: offer.payment_option_2,
        source_link: offer.source_link || '',
        terms_conditions: offer.offer_type === 'CASHBACK' 
          ? offer.CashbackOffer?.terms_conditions || ''
          : offer.offer_type === 'DISCOUNT'
          ? offer.DiscountOffer?.terms_conditions || ''
          : offer.terms_conditions || '',
        discount_value: offer.DiscountOffer?.discount_value || '',
        discount_type: offer.DiscountOffer?.discount_type || '',
        offer_code: offer.DiscountOffer?.offer_code || '',
        cashback_rate: offer.CashbackOffer?.cashback_rate || '',
        loyalty_points: offer.LoyaltyOffer?.loyalty_points || '',
        membership_requirement: offer.LoyaltyOffer?.membership_requirement || ''
      };
      console.log('Setting new form data:', newFormData);
      setFormData(newFormData);
    }
  }, [offer, organizations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Current form data before submission:', formData); // Debug log

      // Get the selected organization
      const selectedOrg = organizations.find(org => org.org_name === selectedOrgName);
      if (!selectedOrg) {
        throw new Error('Please select an organization');
      }

      // Get organization categories
      const orgCategories = await organizationService.getCategories(selectedOrg.org_id);
      if (!orgCategories || orgCategories.length === 0) {
        throw new Error('Selected organization has no categories');
      }

      // Use the first category as default
      const defaultCategory = orgCategories[0];

      // Prepare the base offer data
      const baseOfferData = {
        offer_id: offer?.offer_id || 0,
        org_id: Number(selectedOrg.org_id),
        category_id: Number(defaultCategory.category_id),
        offer_type: formData.offer_type,
        offer_title: formData.offer_title,
        offer_description: formData.offer_description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        picture_url: formData.picture_url,
        payment_org: Number(formData.payment_org),
        payment_option: formData.payment_option,
        payment_option_2: formData.payment_option_2,
        source_link: formData.source_link,
        terms_conditions: formData.terms_conditions
      };

      // Prepare the specific offer type data
      const offerData = (() => {
        if (formData.offer_type === 'CASHBACK') {
          const cashbackData = {
            ...baseOfferData,
            CashbackOffer: {
              offer_id: offer?.offer_id || 0,
              cashback_rate: formData.cashback_rate,
              terms_conditions: formData.terms_conditions,
              description: formData.offer_description,
              image_url: formData.picture_url,
              start_date: formData.start_date,
              end_date: formData.end_date,
              status: formData.is_active
            },
            DiscountOffer: null,
            LoyaltyOffer: null,
            GiveawayOffer: null,
            ChallengeOffer: null
          };
          console.log('Submitting cashback data:', cashbackData); // Debug log
          return cashbackData;
        } else if (formData.offer_type === 'DISCOUNT') {
          const discountOffer: DiscountOffer = {
            discount_value: formData.discount_value,
            discount_type: formData.discount_type,
            offer_code: formData.offer_code,
            terms_conditions: formData.terms_conditions
          };

          // Only add offer_id if it's an existing offer
          if (offer?.offer_id) {
            discountOffer.offer_id = offer.offer_id;
          }

          const offerData = {
            ...baseOfferData,
            DiscountOffer: discountOffer,
            CashbackOffer: null,
            LoyaltyOffer: null,
            GiveawayOffer: null,
            ChallengeOffer: null
          };

          console.log('Submitting discount data:', offerData); // Debug log
          return offerData;
        } else if (formData.offer_type === 'LOYALTY') {
          if (!formData.loyalty_points) {
            throw new Error('Loyalty points are required for loyalty offers');
          }
          return {
            ...baseOfferData,
            LoyaltyOffer: {
              offer_id: offer?.offer_id || 0,
              loyalty_points: formData.loyalty_points,
              membership_requirement: formData.membership_requirement || ''
            },
            CashbackOffer: null,
            DiscountOffer: null,
            GiveawayOffer: null,
            ChallengeOffer: null
          };
        } else {
          throw new Error('Unknown offer type');
        }
      })();

      if (offer?.offer_id) {
        await offerService.update(offer.offer_id, offerData);
      } else {
        await offerService.create(offerData);
      }

      onSubmit();
    } catch (err) {
      console.error('Error submitting offer:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{offer ? 'Edit Offer' : 'Add New Offer'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Organization</label>
            <select
              value={selectedOrgName}
              onChange={handleOrganizationChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Organization</option>
              {organizations.map((org) => (
                <option key={org.org_id} value={org.org_name}>
                  {org.org_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Offer Type</label>
            <select
              value={formData.offer_type}
              onChange={e => setFormData({ ...formData, offer_type: e.target.value as OfferType })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="DISCOUNT">Discount</option>
              <option value="CASHBACK">Cashback</option>
              <option value="LOYALTY">Loyalty Points</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={formData.offer_title}
              onChange={e => setFormData({ ...formData, offer_title: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Summer Sale 2024"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <textarea
              value={formData.offer_description}
              onChange={e => setFormData({ ...formData, offer_description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="e.g., Get amazing discounts on all summer items. Limited time offer!"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={e => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Offer Image Path</label>
            <input
              type="text"
              value={formData.picture_url}
              onChange={e => setFormData({ ...formData, picture_url: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="/images/offers/summer-sale-2024.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the path to the offer image (e.g., /images/offers/example.png)
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Payment Organization</label>
            <select
              value={formData.payment_org}
              onChange={e => setFormData({ ...formData, payment_org: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Payment Organization</option>
              {financeOrganizations.map((org) => (
                <option key={org.org_id} value={org.org_id}>
                  {org.org_name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Select a finance organization that will process the cashback payment
            </p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Payment Option</label>
            <input
              type="text"
              value={formData.payment_option}
              onChange={e => setFormData({ ...formData, payment_option: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Credit Card, Bank Transfer"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Payment Option 2</label>
            <input
              type="text"
              value={formData.payment_option_2}
              onChange={e => setFormData({ ...formData, payment_option_2: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., Mobile Payment, Cash"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
            <textarea
              name="terms_conditions"
              value={formData.terms_conditions}
              onChange={e => setFormData({ ...formData, terms_conditions: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              placeholder="Enter terms and conditions"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Source Link</label>
            <input
              type="url"
              name="source_link"
              value={formData.source_link}
              onChange={e => setFormData({ ...formData, source_link: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
            />
            <p className="mt-1 text-sm text-gray-500">Enter the URL where users can find more information about this offer</p>
          </div>

          {formData.offer_type === 'DISCOUNT' && (
            <>
              <div className="mb-4">
                <label className="block mb-1">Discount Value</label>
                <input
                  type="text"
                  value={formData.discount_value}
                  onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., 20% or 50-70"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Discount Type</label>
                <select
                  value={formData.discount_type}
                  onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                  <option value="Range">Range</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1">Offer Code</label>
                <input
                  type="text"
                  value={formData.offer_code}
                  onChange={e => setFormData({ ...formData, offer_code: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., SUMMER2024"
                  required
                />
              </div>
            </>
          )}

          {formData.offer_type === 'CASHBACK' && (
            <div className="mb-4">
              <label className="block mb-1">Cashback Rate</label>
              <input
                type="text"
                name="cashback_rate"
                value={formData.cashback_rate}
                onChange={e => setFormData({ ...formData, cashback_rate: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., 5% or 1000₮"
                required
              />
            </div>
          )}

          {formData.offer_type === 'LOYALTY' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Loyalty Points <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="loyalty_points"
                  value={formData.loyalty_points}
                  onChange={e => setFormData({ ...formData, loyalty_points: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 100 points"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Membership Requirement</label>
                <input
                  type="text"
                  name="membership_requirement"
                  value={formData.membership_requirement}
                  onChange={e => setFormData({ ...formData, membership_requirement: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Gold Member or 6 months membership"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
          </div>

          <div className="mb-4">
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

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm; 