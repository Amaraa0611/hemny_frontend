import { colors } from '../../utils/colors';

const CashbackDetailsModal = ({
  isOpen,
  onClose,
  offer_title,
  offer_description,
  start_date,
  end_date,
  Organization,
  CashbackOffer
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header with Organization Logo */}
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              {Organization?.logo_url && (
                <img 
                  src={Organization.logo_url}
                  alt={Organization.org_name}
                  className="h-8 sm:h-12 w-auto"
                />
              )}
              <div>
                <h2 style={{ color: colors.primary }} className="text-lg sm:text-2xl font-bold">
                  {offer_title}
                </h2>
                <p style={{ color: colors.success }} className="text-base sm:text-xl font-semibold">
                  {CashbackOffer?.cashback_rate}% Cashback
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Тухай</h3>
              <p className="text-gray-600 text-sm sm:text-base">{offer_description}</p>
            </div>

            {/* Offer Period */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Урамшууллын хугацаа</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {formatDate(start_date)} - {formatDate(end_date)}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Ерөнхий нөхцөл</h3>
              <div className="text-gray-600 whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                {CashbackOffer?.terms_conditions}
              </div>
            </div>

            {/* Additional Details */}
            {CashbackOffer?.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Нэмэлт мэдээлэл</h3>
                <p className="text-gray-600 text-sm sm:text-base">{CashbackOffer.description}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
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

