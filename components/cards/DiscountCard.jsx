import { useState } from 'react';
import DiscountDetailsModal from '../modals/DiscountDetailsModal';

const DiscountCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to get the appropriate logo
  const getLogo = () => {
    if (!props.Organization?.Logos || props.Organization.Logos.length === 0) {
      return '';
    }
    // Get the first logo (assuming it's the primary one)
    return props.Organization.Logos[0].url;
  };

  // Helper function to fix image path
  const getImagePath = (path) => {
    if (!path) return '';
    return path.startsWith('/') ? path : `/${path}`;
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

  // Extract discount range
  const getDiscountRange = (discountValue) => {
    if (!discountValue) return '';
    if (discountValue.includes('-')) {
      const [min, max] = discountValue.split('-');
      return `${min}%-${max}%`;
    }
    return `${discountValue}%`;
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
        className="bg-white rounded-lg shadow-md flex h-24 overflow-hidden hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] active:shadow-sm"
      >
        <div className="w-24 h-24 flex items-center justify-center p-2">
          <img 
            src={getImagePath(getLogo())}
            alt={props.Organization?.org_name}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex items-center gap-3 p-3 flex-1">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 font-sans leading-tight line-clamp-1">
              {props.Organization?.org_name}
            </h3>
            <p className="text-base font-semibold text-gray-700 leading-tight mt-0.5">
              {getDiscountRange(props.DiscountOffer?.discount_value)} Off
            </p>
            <p className="text-sm font-medium text-gray-600 leading-tight mt-0.5">
              {formatDate(props.end_date)} хүртэл
            </p>
          </div>
          <div className="flex items-center pointer-events-none">
            <span 
              className="text-blue-600 font-medium text-sm group-hover:text-blue-800 transition-colors flex items-center gap-0.5 group"
            >
              Дэлгэрэнгүй
              <svg 
                className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
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