// components/Cashback.jsx

import { useQuery } from '@tanstack/react-query';
import CashbackCard from './cards/CashbackCard';
import { cashbackApi } from '../services/api';
import { colors } from '../utils/colors';

const Cashback = () => {
  const { 
    data: stores, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['cashback-stores'],
    queryFn: cashbackApi.getStores,
  });

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-[100px] mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            Failed to load cashback stores. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  // Only show first 18 stores (3 rows of 6)
  const visibleStores = stores?.slice(0, 18) ?? [];
  const hasMoreStores = (stores?.length ?? 0) > 18;

  return (
    <div className="cashback-container">
      <h1 style={{ 
        color: colors.primary,
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Best Cashback Offers */}
      </h1>
      <p style={{ color: colors.text.secondary }}>
        {/* Discover the be st cashback deals from your favorite stores */}
      </p>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Cashback
              </h2>
              <p className="text-gray-600">
                Буцаан олголт зарласан байгууллаууд
              </p>
            </div>
            {hasMoreStores && (
              <a 
                href="/stores" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                See All
                <svg 
                  className="ml-1 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* Updated grid with responsive columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[22px]">
            {stores?.map((store) => (
              <CashbackCard
                key={store.offer_id}
                {...store}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cashback;
  