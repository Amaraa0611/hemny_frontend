import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import DiscountCard from './cards/DiscountCard';
import { discountApi } from '../services/api';
import AllDiscountsModal from './modals/AllDiscountsModal';

const Discount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);

  const { 
    data: stores, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['discount-stores'],
    queryFn: () => discountApi.getStores(),
    retry: 1, // Retry once if failed
    onError: (error) => {
      console.error('Query error:', error); // Debug log
    }
  });

  console.log('Stores data:', stores); // Debug log
  console.log('Loading state:', isLoading); // Debug log
  console.log('Error state:', error); // Debug log

  const handleNext = () => {
    if (currentIndex < (stores?.length ?? 0) - 8 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(prev => prev + 2);
      setTimeout(() => setIsAnimating(false), 300); // Match transition duration
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(prev => prev - 2);
      setTimeout(() => setIsAnimating(false), 300); // Match transition duration
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg h-24 flex">
                <div className="w-24 bg-gray-200"></div>
                <div className="flex-1 p-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Failed to load discount stores. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const visibleStores = stores?.slice(currentIndex, currentIndex + 8) ?? [];
  const hasMoreStores = (stores?.length ?? 0) > 8;
  const canGoNext = currentIndex < (stores?.length ?? 0) - 8;
  const canGoPrev = currentIndex > 0;

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
              onClick={() => setIsModalOpen(true)}
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
                <DiscountCard {...store} />
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stores={stores}
      />
    </section>
  );
};

export default Discount; 