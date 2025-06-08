import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Offer, OfferType } from '../../../types/offer';
import { offerService } from '../../../services/offerService';
import { organizationService } from '../../../services/organizationService';
import OfferForm from './OfferForm';
import Image from 'next/image';
import { Organization } from '../../../types/organization';
import ConfirmModal from '../../shared/ConfirmModal';

const OffersPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<OfferType>('DISCOUNT');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);

  // Fetch organizations
  const { data: organizations = [], isLoading: orgsLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getAll,
    retry: 1
  });

  // Fetch offers
  const {
    data: offersRaw = [],
    isLoading,
    error,
    refetch: fetchOffers
  } = useQuery<Offer[], Error>({
    queryKey: ['offers', selectedType],
    queryFn: offerService.getAll,
    retry: 1
  });

  // Attach organization to each offer
  const offers = offersRaw
    .filter(offer => offer.offer_type === selectedType)
    .map(offer => ({
      ...offer,
      organization: organizations.find((org: Organization) => org.org_id === offer.org_id)
    }));

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (offerToDelete) {
      try {
        await offerService.delete(offerToDelete.offer_id);
        fetchOffers();
      } catch (err) {
        console.error('Failed to delete offer:', err);
      }
    }
    setShowDeleteModal(false);
    setOfferToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Offers</h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Offer
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            {(['DISCOUNT', 'CASHBACK', 'LOYALTY'] as OfferType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${
                  selectedType === type
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {type} ({offersRaw.filter(offer => offer.offer_type === type).length})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Failed to load offers. Please try again later.
          </div>
        )}

        {isLoading || orgsLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No {selectedType.toLowerCase()} offers found
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer: Offer) => (
              <div key={offer.offer_id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      {offer.picture_url && (
                        <div className="relative w-32 h-32 border rounded overflow-hidden bg-gray-50">
                          <Image
                            src={offer.picture_url}
                            alt={offer.offer_title}
                            width={128}
                            height={128}
                            className="max-w-full max-h-full object-contain p-1"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold">{offer.offer_title}</h3>
                        <p className="text-gray-600 mt-1">{offer.offer_description}</p>
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Offer Details</p>
                        <div className="mt-1">
                          <p>Type: {offer.offer_type}</p>
                          <p>Valid: {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}</p>
                          <p>Status: {offer.is_active ? 'Active' : 'Inactive'}</p>
                          {offer.offer_type === 'DISCOUNT' && (
                            <p>Discount: {offer.DiscountOffer?.discount_value}</p>
                          )}
                          {offer.offer_type === 'CASHBACK' && (
                            <p>Cashback Rate: {offer.CashbackOffer?.cashback_rate}</p>
                          )}
                          {offer.offer_type === 'LOYALTY' && (
                            <p>Points: {offer.LoyaltyOffer?.loyalty_points}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Organization</p>
                        <div className="mt-1">
                          <p>{offer.organization?.org_name}</p>
                          <p>{offer.organization?.org_description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    {offer.CashbackOffer?.terms_conditions && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Terms and Conditions</p>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {offer.CashbackOffer.terms_conditions}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsFormOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(offer)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <OfferForm
            offer={selectedOffer}
            offerType={selectedType}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedOffer(undefined);
            }}
            onSubmit={() => {
              setIsFormOpen(false);
              setSelectedOffer(undefined);
              fetchOffers();
            }}
          />
        )}

        {showDeleteModal && (
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
            title="Confirm Delete"
            message="Are you sure you want to delete this offer?"
          />
        )}
      </div>
    </div>
  );
};

export default OffersPage; 