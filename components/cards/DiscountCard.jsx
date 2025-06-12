import { useState } from 'react';
import DiscountDetailsModal from '../modals/DiscountDetailsModal';

const DiscountCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get the appropriate logo and convert to proper display path
  const getLogo = () => {
    if (!props.Organization?.Logos || props.Organization.Logos.length === 0) {
      return '';
    }
    
    const logoUrl = props.Organization.Logos[0].url;
    console.log('Original logo URL:', logoUrl);

    // Extract everything after 'images/' from the absolute path
    if (logoUrl.includes('/images/')) {
      const pathAfterImages = logoUrl.split('/images/').pop();
      return `/images/${pathAfterImages}`;
    }
    
    // If no images/ in path, return default
    return '/images/default-logo.png';
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthsInMongolian = [
      "1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар",
      "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"
    ];
    
    return `${date.getFullYear()} оны ${monthsInMongolian[date.getMonth()]} ${date.getDate()}`;
  };

  // Extract discount value and format with 'хямдрал'
  const getDiscountText = (discountValue) => {
    if (!discountValue) return '';
    // Remove any dash/old logic, just show the value + ' хямдрал'
    return `${discountValue}% хямдрал`;
  };

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  // Truncate description if it's too long
  const truncateDescription = (text, maxLength = 70) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <>
      <div 
        onClick={handleOpenModal}
        className="bg-white rounded-xl shadow-md flex items-center p-4 sm:p-5 gap-4 sm:gap-6 w-full hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] active:shadow-sm relative"
      >
        <div className="flex-shrink-0 flex items-center justify-center h-14 w-20 sm:h-16 sm:w-24">
          <img 
            src={getLogo()}
            alt={props.Organization?.org_name}
            className="h-full w-full object-contain"
            loading="lazy"
            onError={(e) => {
              console.error(`Failed to load logo: ${getLogo()}`);
              e.target.src = '/images/default-logo.png';
            }}
          />
        </div>
        <div className="flex-1 min-w-0 pr-16 sm:pr-0">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-0.5">
              {props.offer_title}
            </span>
            <span className="text-purple-600 font-semibold text-sm sm:text-base mt-0.5">
              {getDiscountText(props.DiscountOffer?.discount_value)}
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 translate-y-1/2 sm:translate-y-0 sm:relative sm:flex-shrink-0 sm:flex sm:items-center">
          <span 
            className="bg-white text-purple-600 font-semibold rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base shadow hover:shadow-md transition select-none pointer-events-none"
          >
            Үзэх
          </span>
        </div>
      </div>

      {isModalOpen && (
        <DiscountDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          {...props}
        />
      )}
    </>
  );
};

export default DiscountCard; 