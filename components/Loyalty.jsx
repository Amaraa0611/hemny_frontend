// components/Loyalty.jsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../utils/colors';
import LoyaltyCard from './cards/LoyaltyCard';
import { loyaltyApi } from '../services/api';

const Loyalty = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const { 
    data: stores, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['loyalty-stores'],
    queryFn: () => loyaltyApi.getStores(),
    retry: 1,
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Add debug logging
  console.log('Loyalty stores data:', stores);

  // Ensure stores is an array
  const safeStores = Array.isArray(stores) ? stores : [];

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev < (stores?.length ?? 0) - 4) {
        return prev + 1;
      }
      return 0;
    });
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    let intervalId;
    
    if (!isHovered && stores?.length > 4) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isHovered, stores]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-1/4 animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Failed to load loyalty stores. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  const canGoNext = currentSlide < (stores?.length ?? 0) - 4;
  const canGoPrev = currentSlide > 0;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loyalty Program
            </h2>
            <p className="text-gray-600">
              Loyalty урамшуулал зарласан байгууллагууд
            </p>
          </div>
        </div>

        <div 
          className="relative max-w-[1600px] mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="overflow-hidden relative px-2 sm:px-4">
            <div 
              className="flex transition-transform duration-500 ease-out gap-2 sm:gap-8"
              style={{ transform: `translateX(-${currentSlide * (window.innerWidth < 640 ? 50 : 25)}%)` }}
            >
              {safeStores.map((store) => (
                <div key={store.offer_id} className="flex-none w-[calc(50%-4px)] sm:w-1/4">
                  <LoyaltyCard
                    image={store.picture_url}
                    title={store.offer_title}
                    description={store.offer_description}
                    link={`/loyalty/${store.offer_id}`}
                    organization={store.Organization}
                    loyaltyDetails={store.LoyaltyOffer}
                    startDate={store.start_date}
                    endDate={store.end_date}
                    source_link={store.source_link}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {canGoPrev && (
            <button 
              onClick={prevSlide}
              className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
              aria-label="Previous slide"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="#004097" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {canGoNext && (
            <button 
              onClick={nextSlide}
              className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10"
              aria-label="Next slide"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="#004097" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Loyalty;
  