import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Offer, OfferType } from '../../../types/offer';
import { offerService } from '../../../services/offerService';
import OfferForm from './OfferForm';

export const OffersPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<OfferType>('DISCOUNT');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { 
    data: offers = [], 
    isLoading, 
    error,
    refetch: fetchOffers
  } = useQuery<Offer[], Error>({
    queryKey: ['offers', selectedType],
    queryFn: async () => {
      const data = await offerService.getAll();
      return selectedType ? data.filter(offer => offer.offer_type === selectedType) : data;
    },
    retry: 1
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offers Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Offer
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          {(['DISCOUNT', 'CASHBACK', 'LOYALTY'] as OfferType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {type} ({offers.filter(offer => offer.offer_type === type).length})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load offers. Please try again later.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No {selectedType.toLowerCase()} offers found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer: Offer) => (
            <div
              key={offer.offer_id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{offer.offer_title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOffer(offer);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this offer?')) {
                        try {
                          await offerService.delete(offer.offer_id);
                          fetchOffers();
                        } catch (err) {
                          console.error('Failed to delete offer:', err);
                        }
                      }
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{offer.offer_description}</p>
              <div className="text-sm text-gray-500">
                <p>Type: {offer.offer_type}</p>
                <p>Valid: {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}</p>
                <p>Status: {offer.is_active ? 'Active' : 'Inactive'}</p>
                {offer.offer_type === 'DISCOUNT' && (
                  <p>Discount: {offer.discount_value}</p>
                )}
                {offer.offer_type === 'CASHBACK' && (
                  <>
                    <p>Cashback Rate: {offer.CashbackOffer?.cashback_rate}</p>
                    {offer.CashbackOffer?.terms_conditions && (
                      <div className="mt-2">
                        <p className="font-medium">Terms and Conditions:</p>
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                          {offer.CashbackOffer.terms_conditions}
                        </pre>
                      </div>
                    )}
                  </>
                )}
                {offer.offer_type === 'LOYALTY' && (
                  <p>Points: {offer.loyalty_points}</p>
                )}
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
            setSelectedOffer(null);
          }}
          onSubmit={() => {
            setIsFormOpen(false);
            setSelectedOffer(null);
            fetchOffers();
          }}
        />
      )}
    </div>
  );
};

export default OffersPage; 