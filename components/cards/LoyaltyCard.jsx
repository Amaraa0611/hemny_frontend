import React from 'react';

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
  // console.log('LoyaltyCard props:', { image, title, description, link, organization, loyaltyDetails, startDate, endDate });

  // Helper function to fix image path
  const getImagePath = (path) => {
    if (!path) return '/images/default-logo.png';
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleClick = () => {
    if (source_link) {
      window.open(source_link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="block cursor-pointer hover:opacity-90 transition-opacity"
      onClick={handleClick}
    >
      <div 
        className="h-[160px] rounded-xl overflow-hidden"
        style={{
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <img 
          src={getImagePath(image)}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error(`Failed to load image: ${getImagePath(image)}`);
            e.target.src = '/images/default-logo.png';
          }}
        />
      </div>

      <div className="mt-3 text-center">
        <span className="text-[15px] leading-[18px] font-semibold text-black">
          {title}
        </span>
      </div>
    </div>
  );
};

export default LoyaltyCard; 