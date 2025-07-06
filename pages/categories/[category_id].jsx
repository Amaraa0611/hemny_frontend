import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { offerService } from '../../services/offerService';
import CashbackCard from '../../components/cards/CashbackCard';
import DiscountCard from '../../components/cards/DiscountCard';
import LoyaltyCard from '../../components/cards/LoyaltyCard';
import CashbackDetailsModal from '../../components/modals/CashbackDetailsModal';
import DiscountDetailsModal from '../../components/modals/DiscountDetailsModal';

// Helper function to get the appropriate logo and convert to proper display path
const getLogo = (organization, offerType = null) => {
  // If organization has Logos array, use that (like in card components)
  if (organization?.Logos && organization.Logos.length > 0) {
    const logoUrl = organization.Logos[0].url;
    if (logoUrl.includes('/images/')) {
      const pathAfterImages = logoUrl.split('/images/').pop();
      return `/images/${pathAfterImages}`;
    }
    return logoUrl;
  }
  
  // If organization has logo_url directly, use that
  if (organization?.logo_url) {
    if (organization.logo_url.includes('/images/')) {
      const pathAfterImages = organization.logo_url.split('/images/').pop();
      return `/images/${pathAfterImages}`;
    }
    return organization.logo_url;
  }
  
  // Default fallback
  return '/images/default-logo.png';
};

// Helper function to get the appropriate offer-specific logo
const getOfferLogo = (organization, offerType) => {
  if (!organization?.org_name) return '/images/default-logo.png';
  
  // Convert organization name to lowercase and replace spaces with underscores
  const orgName = organization.org_name.toLowerCase().replace(/\s+/g, '_');
  
  // Try to find the specific offer logo
  const offerLogoPath = `/images/logo/merchant_logo/${orgName}_${offerType.toLowerCase()}.webp`;
  
  // For now, return the offer-specific logo path
  // The card components will handle the fallback if the image doesn't exist
  return offerLogoPath;
};

const OFFER_TYPES = [
  { key: 'CASHBACK', label: 'Cashback', color: 'text-green-700' },
  { key: 'DISCOUNT', label: 'Discount', color: 'text-red-700' },
  { key: 'LOYALTY', label: 'Loyalty', color: 'text-yellow-700' },
];

export default function CategoryOrganizationsPage() {
  const router = useRouter();
  const { category_id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (!category_id) return;
    setLoading(true);
    setError(null);
    offerService.getOrganizationsByCategory(category_id)
      .then(setData)
      .catch(() => setError('Failed to load offers.'))
      .finally(() => setLoading(false));
  }, [category_id]);

  const handleOpenDetails = (offer, type) => {
    setSelectedOffer(offer);
    setModalType(type);
  };
  const handleCloseModal = () => {
    setSelectedOffer(null);
    setModalType(null);
  };

  // Calculate statistics
  const orgCount = data?.organizations?.length || 0;
  const offerCount = data?.organizations?.reduce((sum, org) =>
    sum + org.offers.filter(offer => {
      if (offer.offer_type === 'CASHBACK') return !!offer.CashbackOffer;
      if (offer.offer_type === 'DISCOUNT') return !!offer.DiscountOffer;
      if (offer.offer_type === 'LOYALTY') return !!offer.LoyaltyOffer;
      return false;
    }).length, 0
  ) || 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 pb-16">
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : !data ? null : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {data.category?.name_mn || data.category?.name_en}
            </h1>
            {/* Statistics */}
            <div className="flex flex-wrap gap-4 items-center mb-4 text-base text-gray-700">
              <span><strong>{orgCount}</strong> байгууллага</span>
              <span className="text-gray-300">|</span>
              <span><strong>{offerCount}</strong> идэвхтэй урамшуулал</span>
            </div>
            {data.category?.description_mn && (
              <p className="text-gray-500 mb-2">{data.category.description_mn}</p>
            )}
            {data.category?.description_en && (
              <p className="text-gray-400 text-sm">{data.category.description_en}</p>
            )}
          </div>

          {data.organizations.length === 0 ? (
            <div className="text-gray-400">No organizations with active offers in this category.</div>
          ) : (
            <div className="space-y-10">
              {data.organizations.map(({ organization, offers }, orgIdx) => (
                <div key={organization.org_id}>
                  <div className="flex items-center gap-4 mb-2">
                    <img 
                      src={getLogo(organization)} 
                      alt={organization.org_name} 
                      className="w-12 h-12 object-contain" 
                      onError={(e) => {
                        console.error(`Failed to load logo: ${getLogo(organization)}`);
                        e.target.src = '/images/default-logo.png';
                      }}
                    />
                    <span className="text-xl font-bold" style={{ color: organization.brand_colors }}>{organization.org_name}</span>
                  </div>
                  {/* Offers grouped by type, with clear headers and spacing */}
                  <div className="space-y-4 ml-0 sm:ml-16">
                    {OFFER_TYPES.map(type => {
                      const offersByType = offers.filter(o => o.offer_type === type.key);
                      if (offersByType.length === 0) return null;
                      return (
                        <div key={type.key}>
                          <div className={`font-semibold mb-2 ${type.color}`}>{type.label}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {offersByType.map(offer => (
                              <OfferCard key={offer.offer_id} offer={offer} org={organization} onOpenDetails={handleOpenDetails} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {orgIdx !== data.organizations.length - 1 && <hr className="my-8 border-gray-200" />}
                </div>
              ))}
            </div>
          )}

          {/* Modals */}
          {modalType === 'cashback' && selectedOffer && (
            <CashbackDetailsModal isOpen={true} onClose={handleCloseModal} {...selectedOffer} Organization={selectedOffer.Organization || data.organizations.find(o => o.organization.org_id === selectedOffer.org_id)?.organization} />
          )}
          {modalType === 'discount' && selectedOffer && (
            <DiscountDetailsModal isOpen={true} onClose={handleCloseModal} {...selectedOffer} Organization={selectedOffer.Organization || data.organizations.find(o => o.organization.org_id === selectedOffer.org_id)?.organization} />
          )}
        </>
      )}
    </div>
  );
}

function OfferCard({ offer, org, onOpenDetails }) {
  // Format organization data to match what card components expect
  const formattedOrg = {
    ...org,
    // Ensure Logos array exists for card components with offer-specific logos
    Logos: org.Logos || [{
      url: offer.offer_type === 'CASHBACK' ? getOfferLogo(org, 'cashback') :
           offer.offer_type === 'DISCOUNT' ? getOfferLogo(org, 'discount') :
           getLogo(org)
    }]
  };
  
  // Attach formatted org as Organization prop for modal compatibility
  const offerWithOrg = { ...offer, Organization: formattedOrg };
  
  if (offer.offer_type === 'CASHBACK' && offer.CashbackOffer) {
    return <CashbackCard {...offerWithOrg} onOpenDetails={() => onOpenDetails(offerWithOrg, 'cashback')} />;
  }
  if (offer.offer_type === 'DISCOUNT' && offer.DiscountOffer) {
    return <DiscountCard {...offerWithOrg} onOpenDetails={() => onOpenDetails(offerWithOrg, 'discount')} />;
  }
  if (offer.offer_type === 'LOYALTY' && offer.LoyaltyOffer) {
    return <LoyaltyCard 
      image={offer.picture_url}
      title={offer.offer_title}
      description={offer.offer_description}
      organization={formattedOrg}
      loyaltyDetails={offer.LoyaltyOffer}
      startDate={offer.start_date}
      endDate={offer.end_date}
      source_link={offer.source_link}
    />;
  }
  // If required sub-offer is missing, render nothing
  return null;
} 