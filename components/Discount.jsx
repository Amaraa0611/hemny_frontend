import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DiscountCard from './cards/DiscountCard';
import { discountApi } from '../services/api';
import { organizationService } from '../services/organizationService';
import AllDiscountsModal from './modals/AllDiscountsModal';
import DiscountDetailsModal from './modals/DiscountDetailsModal';

const Discount = () => {
  const [isAllModalOpen, setIsAllModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);

  // Reset states when all modal closes
  useEffect(() => {
    if (!isAllModalOpen) {
      setIsDetailsModalOpen(false);
      setSelectedStore(null);
    }
  }, [isAllModalOpen]);

  const { 
    data: stores, 
    isLoading: storesLoading, 
    error: storesError 
  } = useQuery({
    queryKey: ['discount-stores'],
    queryFn: () => discountApi.getStores(),
    retry: 1,
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  const {
    data: organizations,
    isLoading: orgsLoading,
    error: orgsError
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.getAll(),
    retry: 1,
    onError: (error) => {
      console.error('Organizations query error:', error);
    }
  });

  // Merge stores with organization categories
  const storesWithCategories = React.useMemo(() => {
    if (!stores || !organizations) return stores;
    
    return stores.map(store => {
      const org = organizations.find(org => org.org_id === store.Organization?.org_id);
      return {
        ...store,
        Organization: {
          ...store.Organization,
          categories: org?.categories || []
        }
      };
    });
  }, [stores, organizations]);

  console.log('Stores data:', stores);
  console.log('Organizations data:', organizations);
  console.log('Stores with categories:', storesWithCategories);
  console.log('Loading state:', storesLoading || orgsLoading);
  console.log('Error state:', storesError || orgsError);
  
  // Debug first store structure if available
  if (storesWithCategories && storesWithCategories.length > 0) {
    console.log('First store structure:', storesWithCategories[0]);
    console.log('First store keys:', Object.keys(storesWithCategories[0]));
    if (storesWithCategories[0].Organization) {
      console.log('Organization keys:', Object.keys(storesWithCategories[0].Organization));
      console.log('Organization categories:', storesWithCategories[0].Organization.categories);
    }
    if (storesWithCategories[0].organization) {
      console.log('organization keys:', Object.keys(storesWithCategories[0].organization));
      console.log('organization categories:', storesWithCategories[0].organization.categories);
    }
  }

  // Number of cards per page
  const CARDS_PER_PAGE = 8;

  const handleNext = () => {
    if (currentIndex + CARDS_PER_PAGE < (storesWithCategories?.length ?? 0) && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(prev => prev + CARDS_PER_PAGE);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(prev => Math.max(0, prev - CARDS_PER_PAGE));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleOpenDetails = (store) => {
    setSelectedStore(store);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedStore(null);
  };

  // Show loading state
  if (storesLoading || orgsLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hot Deals & Discount
              </h2>
              <p className="text-gray-600">
                Хямдрал урамшуулал зарласан байгууллагууд
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 sm:p-5 h-[88px] animate-pulse">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-20 h-14 sm:w-24 sm:h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (storesError || orgsError) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hot Deals & Discount
            </h2>
            <p className="text-red-600">
              Failed to load discount stores. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Calculate visible stores
  const visibleStores = storesWithCategories?.slice(currentIndex, currentIndex + CARDS_PER_PAGE) || [];
  const hasMoreStores = (storesWithCategories?.length ?? 0) > CARDS_PER_PAGE;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + CARDS_PER_PAGE < (storesWithCategories?.length ?? 0);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hot Deals & Discount
            </h2>
            <p className="text-gray-600">
              Хямдрал урамшуулал зарласан байгууллагууд
            </p>
          </div>
          {hasMoreStores && (
            <button 
              onClick={() => setIsAllModalOpen(true)}
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              Бүгд
              <svg 
                className="ml-1 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative">
          {canGoPrev && (
            <button 
              onClick={handlePrev}
              disabled={isAnimating}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-300 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div 
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-[22px] transition-all duration-300 ease-in-out"
          >
            {visibleStores.map((store, index) => (
              <div 
                key={store.offer_id}
                className={`transform transition-all duration-300 ease-in-out ${
                  isAnimating ? 'animate-slide' : ''
                }`}
              >
                <DiscountCard 
                  {...store} 
                  onOpenDetails={() => handleOpenDetails(store)}
                />
              </div>
            ))}
          </div>

          {canGoNext && (
            <button 
              onClick={handleNext}
              disabled={isAnimating}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-300 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <AllDiscountsModal
        isOpen={isAllModalOpen}
        onClose={() => setIsAllModalOpen(false)}
        stores={storesWithCategories}
      />

      {selectedStore && (
        <DiscountDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          {...selectedStore}
        />
      )}
    </section>
  );
};

export default Discount; 