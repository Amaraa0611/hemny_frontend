import React from 'react';

const CARD_WIDTH = '320px';
const CARD_HEIGHT = '370px';

const LoyaltyCard = ({ 
  image,
  title,
  description,
  link,
  organization,
  loyaltyDetails,
  startDate,
  endDate,
  source_link
}) => {
  // Debug log to see what props we're receiving
  console.log('LoyaltyCard props:', { image, title, description, link, organization, loyaltyDetails, startDate, endDate });

  // Helper function to fix image path
  const getImagePath = (path) => {
    if (!path) return '';
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleClick = () => {
    if (source_link) {
      window.open(source_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="bg-white rounded-2xl flex flex-col overflow-hidden cursor-pointer"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      onClick={handleClick}
    >
      {/* Image Section with Larger Logo in Lower Left */}
      <div className="relative w-full" style={{ height: '220px' }}>
        <img
          src={getImagePath(image)}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Larger Org Logo as circular badge in lower left */}
        {organization?.logo_url && (
          <div className="absolute left-4 bottom-4 bg-white rounded-full shadow p-1 flex items-center justify-center" style={{ width: 64, height: 64 }}>
            <img
              src={getImagePath(organization.logo_url)}
              alt={organization.org_name}
              className="w-14 h-14 object-contain rounded-full"
            />
          </div>
        )}
      </div>
      {/* Text Section below image */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-4">
        <div className="text-lg font-bold text-gray-900 mb-1" title={organization?.org_name}>{organization?.org_name}</div>
        <div className="text-xl font-extrabold text-gray-900 mb-2" title={title}>{title}</div>
        {loyaltyDetails?.membership_requirement && (
          <div className="text-sm text-gray-500 mb-2" title={loyaltyDetails.membership_requirement}>{loyaltyDetails.membership_requirement}</div>
        )}
        <div className="text-xs text-gray-500 font-medium mt-auto pt-2">
          Идэвхтэй хугацаа: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard; 