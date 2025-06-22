import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { offerService } from '../../../services/offerService';
import CashbackCard from '../../../components/cards/CashbackCard';
import DiscountCard from '../../../components/cards/DiscountCard';
import LoyaltyCard from '../../../components/cards/LoyaltyCard';
import CashbackDetailsModal from '../../../components/modals/CashbackDetailsModal';
import DiscountDetailsModal from '../../../components/modals/DiscountDetailsModal';

const OFFER_TYPES = [
  { key: 'CASHBACK', label: 'Cashback', color: 'bg-green-100 text-green-800' },
  { key: 'DISCOUNT', label: 'Discount', color: 'bg-red-100 text-red-800' },
  { key: 'LOYALTY', label: 'Loyalty', color: 'bg-yellow-100 text-yellow-800' },
];

const OrganizationOffersPage = () => {
  const router = useRouter();
  const { org_id } = router.query;
  const [offers, setOffers] = useState({ active: [], past: [] });
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalType, setModalType] = useState(null); // 'cashback' | 'discount'

  useEffect(() => {
    if (!org_id) return;
    setLoading(true);
    setError(null);
    offerService.getByOrganization(org_id)
      .then(res => {
        setOffers(res);
        if (res.active.length > 0) {
          setOrgInfo(res.active[0].Organization);
        } else if (res.past.length > 0) {
          setOrgInfo(res.past[0].Organization);
        }
      })
      .catch(err => setError('Failed to load offers.'))
      .finally(() => setLoading(false));
  }, [org_id]);

  // Helper to group offers by type
  const groupByType = (offersArr) => {
    return {
      CASHBACK: offersArr.filter(o => o.offer_type === 'CASHBACK'),
      DISCOUNT: offersArr.filter(o => o.offer_type === 'DISCOUNT'),
      LOYALTY: offersArr.filter(o => o.offer_type === 'LOYALTY'),
    };
  };

  const activeByType = groupByType(offers.active);
  const pastByType = groupByType(offers.past);

  const handleOpenDetails = (offer, type) => {
    setSelectedOffer(offer);
    setModalType(type);
  };
  const handleCloseModal = () => {
    setSelectedOffer(null);
    setModalType(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          {orgInfo && (
            <div className="flex items-center mb-8 gap-4">
              <img src={orgInfo.logo_url} alt={orgInfo.org_name} className="w-16 h-16 rounded-full object-cover border" />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: orgInfo.brand_colors }}>{orgInfo.org_name}</h1>
                <span className="text-sm text-gray-500">All offers from this organization</span>
              </div>
            </div>
          )}

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Active Offers</h2>
            {offers.active.length === 0 ? (
              <div className="text-gray-400">No active offers.</div>
            ) : (
              OFFER_TYPES.map(type => (
                activeByType[type.key].length > 0 && (
                  <div key={type.key} className="mb-6">
                    <div className={`flex items-center mb-2`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-2 ${type.color}`}>{type.label}</span>
                      <span className="text-xs text-gray-400">{activeByType[type.key].length} offer{activeByType[type.key].length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeByType[type.key].map(offer => (
                        <OfferCard key={offer.offer_id} offer={offer} onOpenDetails={handleOpenDetails} />
                      ))}
                    </div>
                  </div>
                )
              ))
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-500">Past Offers</h2>
            {offers.past.length === 0 ? (
              <div className="text-gray-400">No past offers.</div>
            ) : (
              OFFER_TYPES.map(type => (
                pastByType[type.key].length > 0 && (
                  <div key={type.key} className="mb-6">
                    <div className={`flex items-center mb-2`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-2 ${type.color}`}>{type.label}</span>
                      <span className="text-xs text-gray-400">{pastByType[type.key].length} offer{pastByType[type.key].length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pastByType[type.key].map(offer => (
                        <OfferCard key={offer.offer_id} offer={offer} isPast onOpenDetails={handleOpenDetails} />
                      ))}
                    </div>
                  </div>
                )
              ))
            )}
          </section>

          {/* Modals */}
          {modalType === 'cashback' && selectedOffer && (
            <CashbackDetailsModal isOpen={true} onClose={handleCloseModal} {...selectedOffer} />
          )}
          {modalType === 'discount' && selectedOffer && (
            <DiscountDetailsModal isOpen={true} onClose={handleCloseModal} {...selectedOffer} />
          )}
        </>
      )}
    </div>
  );
};

function OfferCard({ offer, isPast, onOpenDetails }) {
  if (offer.offer_type === 'CASHBACK' && offer.CashbackOffer) {
    return <CashbackCard {...offer} onOpenDetails={() => onOpenDetails(offer, 'cashback')} />;
  }
  if (offer.offer_type === 'DISCOUNT' && offer.DiscountOffer) {
    return <DiscountCard {...offer} onOpenDetails={() => onOpenDetails(offer, 'discount')} />;
  }
  if (offer.offer_type === 'LOYALTY' && offer.LoyaltyOffer) {
    return <LoyaltyCard 
      image={offer.picture_url}
      title={offer.offer_title}
      description={offer.offer_description}
      organization={offer.Organization}
      loyaltyDetails={offer.LoyaltyOffer}
      startDate={offer.start_date}
      endDate={offer.end_date}
      source_link={offer.source_link}
    />;
  }
  // fallback generic card
  return (
    <div className={`rounded-xl shadow p-5 flex gap-4 items-center ${isPast ? 'bg-gray-100 opacity-70' : 'bg-white'}`}>
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1">{offer.offer_title}</h3>
        <div className="text-sm mb-1">
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 mr-2">{offer.offer_type}</span>
          <span className="text-gray-500">{offer.start_date} - {offer.end_date}</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">{offer.offer_description}</div>
      </div>
    </div>
  );
}

export default OrganizationOffersPage; 