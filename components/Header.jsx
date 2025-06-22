// components/Header.jsx

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { organizationService } from '../services/organizationService';
import { offerService } from '../services/offerService';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState({ orgs: [], offers: [] });
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch all orgs and offers on first search
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [orgs, offers] = await Promise.all([
        organizationService.getAll(),
        offerService.getAll(),
      ]);
      setAllData({ orgs, offers });
      return { orgs, offers };
    } finally {
      setLoading(false);
    }
  };

  // Real-time search handler
  const handleSearch = async (value) => {
    setSearch(value);
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    let orgs = allData.orgs;
    let offers = allData.offers;
    if (orgs.length === 0 && offers.length === 0) {
      const data = await fetchAllData();
      orgs = data.orgs;
      offers = data.offers;
    }
    const q = value.toLowerCase();
    // Filter organizations
    const orgResults = orgs.filter(org =>
      org.org_name.toLowerCase().includes(q) ||
      (org.categories && org.categories.some(cat =>
        (cat.name_en && cat.name_en.toLowerCase().includes(q)) ||
        (cat.name_mn && cat.name_mn.toLowerCase().includes(q))
      ))
    );
    // Filter offers
    const offerResults = offers.filter(offer =>
      offer.title && offer.title.toLowerCase().includes(q)
    );
    setResults([
      ...orgResults.map(org => ({ type: 'org', data: org })),
      ...offerResults.map(offer => ({ type: 'offer', data: offer })),
    ]);
    setShowDropdown(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
      setShowDropdown(false);
    }
  };

  // Hide dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 text-sm z-[50] relative sticky top-0 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between h-auto sm:h-16 py-2 sm:py-0 gap-2">
          {/* Logo */}
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto flex-1">
            <Link href="/" className="flex-shrink-0">
              <img 
                src="/images/logo/Hemny_logo.png" 
                alt="Hemny Logo" 
                className="h-8 w-auto"
              />
            </Link>
          </div>
          {/* Centered Search Bar */}
          <div className="flex justify-center w-full sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:w-[520px] relative z-[60]" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="w-full flex items-center relative">
              <input
                type="text"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by company, category, or offer..."
                className="w-full px-4 py-2 border border-[#8529cd] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8529cd] text-sm pr-10"
                onFocus={() => search && setShowDropdown(true)}
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8529cd] hover:text-[#6d1fa3] p-1 focus:outline-none"
                tabIndex={-1}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
            </form>
            {/* Dropdown Results */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-[70] max-h-80 overflow-y-auto">
                {results.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.type === 'org' ? `/organizations/${item.data.org_id}` : `/offers/${item.data.offer_id}`}
                    className="block px-4 py-2 hover:bg-blue-50 text-gray-800 text-sm cursor-pointer"
                    onClick={() => setShowDropdown(false)}
                  >
                    {item.type === 'org' ? (
                      <>
                        <span className="font-medium">{item.data.org_name}</span>
                        {item.data.categories && item.data.categories.length > 0 && (
                          <span className="ml-2 text-xs text-gray-500">[
                            {item.data.categories.map(cat => cat.name_en || cat.name_mn).join(', ')}
                          ]</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{item.data.title}</span>
                        <span className="ml-2 text-xs text-gray-500">(Offer)</span>
                      </>
                    )}
                  </Link>
                ))}
                {loading && (
                  <div className="px-4 py-2 text-gray-400 text-xs">Loading...</div>
                )}
              </div>
            )}
            {showDropdown && !loading && results.length === 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-[70] px-4 py-2 text-gray-400 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
  