import React, { useState, useMemo, useRef, useEffect } from 'react';
import DiscountCard from '../cards/DiscountCard';
import DiscountDetailsModal from './DiscountDetailsModal';

const AllDiscountsModal = ({ isOpen, onClose, stores }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const modalRef = useRef(null);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDetailsModalOpen(false);
      setSelectedStore(null);
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set(stores?.map(store => store.Organization?.category) || []);
    return ['all', ...Array.from(uniqueCategories).filter(Boolean)];
  }, [stores]);

  // Filter stores based on search and category
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    
    return stores.filter(store => {
      const matchesSearch = searchQuery === '' || 
        store.Organization?.org_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.DiscountOffer?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.DiscountOffer?.discount_value?.toString().includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'all' || 
        store.Organization?.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, selectedCategory]);

  // Group stores by category
  const groupedStores = useMemo(() => {
    const groups = {};
    filteredStores.forEach(store => {
      const category = store.Organization?.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(store);
    });
    return groups;
  }, [filteredStores]);

  const handleOpenDetails = (store) => {
    setSelectedStore(store);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedStore(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div 
            ref={modalRef}
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  All Discounts
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by organization, offer, or discount value..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Discounts Grid */}
              <div className="space-y-8">
                {Object.entries(groupedStores).map(([category, stores]) => (
                  <div key={category}>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {stores.map(store => (
                        <DiscountCard
                          key={store.offer_id}
                          {...store}
                          onOpenDetails={() => handleOpenDetails(store)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedStore && (
        <DiscountDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          {...selectedStore}
        />
      )}
    </>
  );
};

export default AllDiscountsModal; 