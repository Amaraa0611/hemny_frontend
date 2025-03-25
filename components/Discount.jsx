import { useQuery } from '@tanstack/react-query';
import DiscountCard from './cards/DiscountCard';
import { discountApi } from '../services/api';

const Discount = () => {
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

  // Only show first 4 stores
  const visibleStores = stores?.slice(0, 4) ?? [];
  const hasMoreStores = (stores?.length ?? 0) > 4;

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
            <a 
              href="/discount" 
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
          {visibleStores.map((store) => (
            <DiscountCard
              key={store.offer_id}
              {...store}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Discount; 