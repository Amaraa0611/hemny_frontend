import React, { useState, useMemo, useRef, useEffect } from 'react';
import DiscountCard from '../cards/DiscountCard';
import DiscountDetailsModal from './DiscountDetailsModal';

const AllDiscountsModal = ({ isOpen, onClose, stores }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'stacked'
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
        // Only close AllDiscountsModal if details modal is NOT open
        if (!isDetailsModalOpen) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isDetailsModalOpen]);

  // Get unique categories
  const categories = useMemo(() => {
    console.log('Stores data in AllDiscountsModal:', stores);
    
    if (stores && stores.length > 0) {
      console.log('First store in modal:', stores[0]);
      console.log('First store keys:', Object.keys(stores[0]));
    }
    
    const uniqueCategories = new Set(
      stores?.map(store => {
        // Log the actual structure
        console.log('Store being processed:', store);
        console.log('Store keys:', Object.keys(store));
        
        // Now categories should be in Organization.categories
        const category = store.Organization?.categories?.[0]?.name_mn;
        
        console.log('Category from Organization.categories:', category);
        console.log('Organization categories array:', store.Organization?.categories);
        
        return category;
      }) || []
    );
    const filteredCategories = Array.from(uniqueCategories).filter(Boolean);
    console.log('Unique categories found:', filteredCategories);
    return ['all', ...filteredCategories];
  }, [stores]);

  // Filter stores based on search and category
  const filteredStores = useMemo(() => {
    if (!stores) return [];
    return stores.filter(store => {
      const matchesSearch = searchQuery === '' || 
        store.Organization?.org_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.DiscountOffer?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.DiscountOffer?.discount_value?.toString().includes(searchQuery);
      
      const orgCategory = store.Organization?.categories?.[0]?.name_mn;
      const matchesCategory = selectedCategory === 'all' || orgCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchQuery, selectedCategory]);

  // Group stores by category and sort by count
  const groupedStores = useMemo(() => {
    const groups = {};
    filteredStores.forEach(store => {
      const category = store.Organization?.categories?.[0]?.name_mn || 'Uncategorized';
      console.log('Grouping store:', store.Organization?.org_name, 'into category:', category);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(store);
    });
    
    // Sort categories by number of discounts (most first)
    const sortedGroups = Object.entries(groups)
      .sort(([, a], [, b]) => b.length - a.length)
      .reduce((acc, [category, stores]) => {
        acc[category] = stores;
        return acc;
      }, {});
    
    console.log('Final grouped stores (sorted):', sortedGroups);
    return sortedGroups;
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
              <div className="mb-6 flex flex-col sm:flex-row gap-4 flex-shrink-0">
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
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setViewMode('categories')}
                      className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                        viewMode === 'categories'
                          ? 'text-blue-600 bg-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Categories
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('stacked')}
                      className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                        viewMode === 'stacked'
                          ? 'text-blue-600 bg-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Stacked
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Discounts Grid - Scrollable Content */}
              <div className="flex-1 overflow-y-auto space-y-8">
                {viewMode === 'categories' ? (
                  // Category View
                  Object.entries(groupedStores).map(([category, stores]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {category}
                        </h4>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {stores.length} {stores.length === 1 ? 'offer' : 'offers'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {stores.map(store => (
                          <DiscountCard
                            key={store.offer_id}
                            {...store}
                            onOpenDetails={() => handleOpenDetails(store)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Stacked View
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-gray-900">
                        All Discounts
                      </h4>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {filteredStores.length} {filteredStores.length === 1 ? 'offer' : 'offers'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                      {filteredStores.map(store => (
                        <DiscountCard
                          key={store.offer_id}
                          {...store}
                          onOpenDetails={() => handleOpenDetails(store)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(groupedStores).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No discounts found matching your criteria.</p>
                  </div>
                )}
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