import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/cashbacks/search?q=${q}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-noto-sans mb-6">
        Хайлтын үр дүн: {q}
      </h1>

      {searchResults.length === 0 ? (
        <p className="text-gray-600">Хайлтад тохирох үр дүн олдсонгүй.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((result) => (
            <a
              key={result.cashback_id}
              href={`/cashback/${result.cashback_id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                {result.merchant_logo && (
                  <img
                    src={result.merchant_logo}
                    alt={result.merchant_name}
                    className="w-12 h-12 object-contain mr-4"
                  />
                )}
                <div>
                  <h2 className="font-noto-sans text-lg">{result.merchant_name}</h2>
                  <p className="text-primary font-medium">
                    {result.cashback_percentage}% кэшбэк
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {result.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 