const DiscountDetailsModal = ({
  isOpen,
  onClose,
  offer_title,
  offer_description,
  start_date,
  end_date,
  Organization,
  DiscountOffer,
  picture_url
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImagePath = (path) => {
    if (!path) return '';
    if (path.startsWith('public/')) {
      return path.replace('public/', '/');
    }
    return path;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Responsive modal animation classes
  const modalAnimation = `
    transition-all duration-300 ease-out
    sm:scale-100 sm:opacity-100 sm:translate-y-0
    scale-90 opacity-0 translate-y-8
    animate-modal-open
  `;
  // For mobile, full screen, no border radius/margin
  const modalContainer = `
    bg-white
    w-full
    max-w-2xl
    max-h-[90vh]
    overflow-y-auto
    mx-2 sm:mx-4
    rounded-lg
    sm:rounded-lg
    ${isOpen ? 'sm:animate-modal-open' : ''}
    ${isOpen ? 'animate-mobile-modal-open' : ''}
    sm:p-0
    p-0
  `;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 transition-colors"
      onClick={handleOverlayClick}
    >
      <div
        className={
          `relative bg-white shadow-xl ` +
          // On mobile: full screen, no border radius/margin, slide up
          'w-full h-full m-0 rounded-none sm:h-auto sm:rounded-lg sm:m-0 ' +
          // Animation
          (isOpen
            ? 'opacity-100 scale-100 translate-y-0 sm:animate-modal-open animate-mobile-modal-open'
            : 'opacity-0 scale-75 translate-y-12') +
          ' transition-all duration-500 ease-out'
        }
        style={{
          maxWidth: '52rem', // wider for desktop
          maxHeight: '95vh', // taller for desktop
        }}
      >
        <div className="p-4 sm:p-6 h-full w-full flex flex-col max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          {/* Header with Organization Logo */}
          <div className="flex justify-between items-start mb-4">
            <div className="pr-8 flex-1">
              <h2 className="text-base sm:text-xl font-semibold text-gray-900 leading-tight break-words">
                {offer_title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content (text fields above, image at the bottom) */}
          <div className="flex flex-col flex-1 space-y-4 sm:space-y-6">
            {/* Discount Value */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Хямдралын хэмжээ</h3>
              <p className="text-lg sm:text-xl font-semibold text-primary">
                {DiscountOffer?.discount_value}% Off
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line break-words">
                {offer_description}
              </p>
            </div>

            {/* Offer Period */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Урамшууллын хугацаа</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {formatDate(start_date)} - {formatDate(end_date)}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Ерөнхий нөхцөл</h3>
              <div className="text-sm sm:text-base text-gray-600 whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg">
                {DiscountOffer?.terms_conditions}
              </div>
            </div>
          </div>

          {/* Offer Image at the bottom */}
          {picture_url && (
            <div className="mt-6 transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
              <img
                src={getImagePath(picture_url)}
                alt={offer_title}
                className="w-full h-auto rounded-lg shadow-lg object-contain animate-fade-in"
                style={{ maxHeight: '300px', minHeight: '150px' }}
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = '/images/default-logo.png';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @media (max-width: 639px) {
          .animate-mobile-modal-open {
            animation: mobileModalOpen 0.45s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes mobileModalOpen {
            0% {
              opacity: 0;
              transform: translateY(100%);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
        @media (min-width: 640px) {
          .animate-modal-open {
            animation: modalOpen 0.38s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes modalOpen {
            0% {
              opacity: 0;
              transform: scale(0.7);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        }
      `}</style>
    </div>
  );
};

export default DiscountDetailsModal; 