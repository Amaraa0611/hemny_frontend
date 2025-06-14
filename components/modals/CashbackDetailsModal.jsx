import React, { useState, useEffect } from 'react';
import { colors } from '../../utils/colors';
import { organizationService } from '../../services/organizationService';

const CashbackDetailsModal = ({
  isOpen,
  onClose,
  offer_title,
  offer_description,
  start_date,
  end_date,
  Organization,
  CashbackOffer,
  picture_url,
  payment_org,
  source_link
}) => {
  const [paymentOrg, setPaymentOrg] = useState(null);

  useEffect(() => {
    const fetchPaymentOrg = async () => {
      if (payment_org) {
        try {
          const org = await organizationService.getById(payment_org);
          setPaymentOrg(org);
        } catch (error) {
          console.error('Error fetching payment organization:', error);
        }
      }
    };
    fetchPaymentOrg();
  }, [payment_org]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.');
  };

  const formatDescription = (text) => {
    if (!text) return '';
    
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text by URLs and map through the parts
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      // If the part matches a URL, make it a link
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      }
      return part;
    });
  };

  const getImagePath = (path) => {
    if (!path) return '';
    if (path.includes('/public/')) {
      return path.split('/public/').pop();
    }
    if (path.startsWith('/')) {
      return path;
    }
    return `/images/${path}`;
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPaymentOrgLogo = () => {
    if (paymentOrg?.logo_url) {
      return paymentOrg.logo_url;
    }
    return '/images/default-logo.png';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 transition-colors"
      onClick={handleOverlayClick}
    >
      <div
        className={
          `relative bg-white shadow-xl ` +
          // On mobile: full screen, rounded top corners, slide up
          'w-full h-full m-0 rounded-t-3xl sm:rounded-lg sm:m-0 ' +
          // Animation
          (isOpen
            ? 'opacity-100 scale-100 translate-y-0 sm:animate-modal-open animate-mobile-modal-open'
            : 'opacity-0 scale-75 translate-y-12') +
          ' transition-all duration-500 ease-out'
        }
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: '1200px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 h-full w-full flex flex-col max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
          {/* Header with Close Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{offer_title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full lg:w-[65%] space-y-6">
              {/* Offer Period and Organization - Side by side on desktop */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Offer Period */}
                <div className="flex-1 bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">Урамшууллын хугацаа</h3>
                  <div className="flex items-center space-x-2 text-blue-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm sm:text-base font-medium">
                      {formatDate(start_date)} - {formatDate(end_date)}
                    </p>
                  </div>
                </div>

                {/* Organization */}
                {Organization && (
                  <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">Байгууллага</h3>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={Organization?.Logos?.[0]?.url || '/images/default-logo.png'}
                          alt={Organization.org_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/default-logo.png';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-base font-medium text-gray-900 tracking-tight">{Organization.org_name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 whitespace-pre-line font-medium">
                  {formatDescription(offer_description)}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">Нөхцөл</h3>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 whitespace-pre-line font-medium">
                  {formatDescription(CashbackOffer?.terms_conditions)}
                </div>
              </div>

              {/* Source Link - Only visible on mobile */}
              {source_link && (
                <div className="lg:hidden">
                  <a
                    href={source_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl w-full justify-center font-medium tracking-tight"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Дэлгэрэнгүй</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Image - Only visible on mobile */}
              <div className="lg:hidden">
                {(CashbackOffer?.picture_url || picture_url) && (
                  <div className="flex items-center justify-center">
                    <img
                      src={getImagePath(CashbackOffer?.picture_url || picture_url)}
                      alt={offer_title}
                      className="max-h-[300px] max-w-full object-contain rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-offer.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Only visible on desktop */}
            <div className="hidden lg:flex w-[35%] flex-col">
              <div className="p-4">
                {(CashbackOffer?.picture_url || picture_url) && (
                  <div className="h-full flex items-center justify-center">
                    <img
                      src={getImagePath(CashbackOffer?.picture_url || picture_url)}
                      alt={offer_title}
                      className="max-h-full max-w-full object-contain rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-offer.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Source Link */}
              {source_link && (
                <div className="p-4 mt-auto">
                  <a
                    href={source_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl w-full justify-center font-medium tracking-tight"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Дэлгэрэнгүй</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Close Button - Only visible on mobile */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:hidden">
          <button
            onClick={onClose}
            className="bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 font-medium tracking-tight"
          >
            <span>Хаах</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

export default CashbackDetailsModal;


