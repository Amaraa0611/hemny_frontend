import { useState } from 'react';
import CashbackDetailsModal from '../modals/CashbackDetailsModal';
import { colors } from '../../utils/colors';

const CashbackCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug logs
  console.log('Full props:', props);
  console.log('Organization:', props.Organization);
  console.log('Brand colors:', props.Organization?.brand_colors);
  console.log('Logo URL:', props.Organization?.logo_url);
  console.log('Cashback rate:', props.CashbackOffer?.cashback_rate);

  // Debug log
  console.log('Organization data:', props.Organization);
  console.log('Logo URL:', props.Organization?.logo_url);

  // Helper function to fix image path
  const getImagePath = (path) => {
    if (!path) return '';
    return path.replace('public/', '/');
  };

  return (
    <>
      <div 
        className="block cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsModalOpen(true)}
      >
        <div 
          className="h-[88px] flex items-center justify-center p-4 rounded-lg"
          style={{
            backgroundColor: props.Organization?.brand_colors?.primary || colors.secondary,
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0) 100%)'
          }}
        >
          <img 
            src={getImagePath(props.Organization?.logo_url)}
            alt={props.Organization?.org_name}
            className="max-h-12 w-auto object-contain"
            loading="lazy"
          />
        </div>

        <div className="mt-3 text-center">
          <span style={{ color: colors.success }} className="text-[15px] leading-[18px] font-medium">
            {props.CashbackOffer?.cashback_rate}% Cash Back
          </span>
        </div>
      </div>

      <CashbackDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...props}
      />
    </>
  );
};

export default CashbackCard;
