import { colors } from '../../utils/colors';

const CashbackDetailsModal = ({
  isOpen,
  onClose,
  offer_title,
  offer_description,
  start_date,
  end_date,
  Organization,
  CashbackOffer,
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
    
    // If it's an absolute path containing 'public', extract everything after it
    if (path.includes('/public/')) {
      return path.split('/public/').pop();
    }
    
    // If it's already a relative path starting with '/', use as is
    if (path.startsWith('/')) {
      return path;
    }
    
    // For other cases, assume it's relative to /images/
    return `/images/${path}`;
  };

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
        <div className="p-4 sm:p-6">
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

          {/* Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Description */}
            <div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line break-words">
                {offer_description}
              </p>
            </div>

            {/* Offer Image */}
            {(CashbackOffer?.picture_url || picture_url) && (
              <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
                <img
                  src={getImagePath(CashbackOffer?.picture_url || picture_url)}
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
                {CashbackOffer?.terms_conditions}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base transition-colors"
            >
              Хаах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackDetailsModal;

