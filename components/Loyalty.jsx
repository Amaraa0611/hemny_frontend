// components/Loyalty.jsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../utils/colors';
import LoyaltyCard from './cards/LoyaltyCard';
import { loyaltyApi } from '../services/api';

const getSlidesPerView = () => {
  if (typeof window === 'undefined') return 1;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 2;
  return 1;
};

const Loyalty = () => {
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

  const safeStores = Array.isArray(stores) ? stores : [];
  const [current, setCurrent] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    const handleResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure current index is not out of bounds after resize
  React.useEffect(() => {
    const maxIndex = Math.max(0, safeStores.length - slidesPerView);
    if (current > maxIndex) {
      setCurrent(maxIndex);
    }
  }, [slidesPerView, safeStores.length]);

  const maxIndex = Math.max(0, safeStores.length - slidesPerView);
  const goPrev = () => setCurrent((prev) => Math.max(0, prev - 1));
  const goNext = () => setCurrent((prev) => Math.min(maxIndex, prev + 1));

  // Helper to calculate correct translateX so last card is always fully visible
  const getTranslateX = () => {
    if (safeStores.length <= slidesPerView) return 0;
    const maxIndex = Math.max(0, safeStores.length - slidesPerView);
    const index = Math.min(current, maxIndex);
    return -(index * (100 / slidesPerView));
  };

  // Autoplay effect
  React.useEffect(() => {
    if (isHovered) return;
    if (safeStores.length <= slidesPerView) return;
    const interval = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, slidesPerView, safeStores.length, maxIndex]);

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
        <div className="relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {current > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="#004097" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-8"
              style={{ transform: `translateX(${getTranslateX()}%)` }}
            >
              {safeStores.map((store, idx) => (
                <div
                  key={store.offer_id}
                  className="flex-none"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
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
          {current < maxIndex && (
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="#004097" viewBox="0 0 24 24">
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
  