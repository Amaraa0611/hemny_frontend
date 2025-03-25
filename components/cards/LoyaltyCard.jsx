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
    <div className="w-1/4 px-4 flex-shrink-0">
      <div 
        onClick={handleClick}
        className="block h-full cursor-pointer"
      >
        {/* Image Section */}
        <div className="bg-transparent rounded-t-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
          <div className="aspect-w-16 aspect-h-8">
            <img 
              src={getImagePath(image)} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="mt-4 p-4 bg-transparent">
          <div className="flex items-center mb-2">
            <img 
              src={getImagePath(organization?.logo_url)} 
              alt={organization?.org_name}
              className="w-6 h-6 object-contain mr-2"
            />
            <span className="text-sm text-gray-600">{organization?.org_name}</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-base text-gray-600 leading-relaxed mb-2">{description}</p>
          <div className="text-sm text-gray-500">
            <p className="font-semibold">{loyaltyDetails?.loyalty_points}</p>
            <p>{loyaltyDetails?.membership_requirement}</p>
            <p className="mt-2 text-xs">
              Valid: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard; 