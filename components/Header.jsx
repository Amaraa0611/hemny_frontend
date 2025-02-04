// components/Header.jsx

import React, { useState, useEffect } from 'react';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+'/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img 
              src="/images/logo/hemny.png" 
              alt="Hemny Logo" 
              className="h-8 w-auto"
            />
          </a>

          {/* Categories Dropdown */}
          <div className="relative group ml-8">
            <button className="flex items-center hover:text-primary py-2">
              <span className="font-noto-sans text-base">Ангилал</span>
              <svg 
                className="w-3 h-3 ml-1 inline-block" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ maxWidth: '12px', maxHeight: '12px' }}
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="absolute hidden group-hover:block w-[200px] left-0 top-full bg-white border border-gray-200 shadow-lg z-50">
              {categories.map((category) => (
                <div 
                  key={category.category_id}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.category_id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <a 
                    href={`/category/${category.category_id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                  >
                    <span className="font-bold font-noto-sans tracking-wide">{category.category_name}</span>
                    <svg 
                      className="w-4 h-4 text-gray-400" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>

                  {/* Popup window */}
                  {activeCategory === category.category_id && (
                    <div className="absolute left-[200px] top-0 w-[600px] bg-white border border-gray-200 shadow-lg p-6">
                      <div className="flex">
                        <div className="flex-1">
                          <h3 className="font-bold font-noto-sans text-lg tracking-wide mb-4">{category.category_name}</h3>
                          <p className="text-gray-600 mb-4">{category.category_description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            {/* Subcategories with updated font */}
                            <a href="#" className="text-gray-600 hover:text-primary font-noto-sans">Дэд ангилал 1</a>
                            <a href="#" className="text-gray-600 hover:text-primary font-noto-sans">Дэд ангилал 2</a>
                            <a href="#" className="text-gray-600 hover:text-primary font-noto-sans">Дэд ангилал 3</a>
                            <a href="#" className="text-gray-600 hover:text-primary font-noto-sans">Дэд ангилал 4</a>
                          </div>
                        </div>
                        <div className="w-48 ml-6">
                          {/* Featured image or promotion */}
                          <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
                          <p className="text-sm text-gray-600 font-noto-sans">Онцлох бараа</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-grow flex justify-center px-4">
            <div className="w-full max-w-lg">
              <div className="relative group">
                <input 
                  type="search" 
                  placeholder="Search for stores, deals, and more..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border-2 border-gray-200 rounded-full outline-none 
                    focus:border-primary hover:border-gray-300 transition-colors duration-200
                    focus:ring-4 focus:ring-primary/20"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg 
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com/hemny" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-600 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
              </svg>
            </a>
            <a href="https://instagram.com/hemny" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-600 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.982c2.937,0,3.285.011,4.445.064a6.087,6.087,0,0,1,2.042.379,3.408,3.408,0,0,1,1.265.823,3.408,3.408,0,0,1,.823,1.265,6.087,6.087,0,0,1,.379,2.042c.053,1.16.064,1.508.064,4.445s-.011,3.285-.064,4.445a6.087,6.087,0,0,1-.379,2.042,3.643,3.643,0,0,1-2.088,2.088,6.087,6.087,0,0,1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087,6.087,0,0,1-2.043-.379,3.408,3.408,0,0,1-1.265-.823,3.408,3.408,0,0,1-.823-1.265,6.087,6.087,0,0,1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087,6.087,0,0,1,.379-2.042,3.408,3.408,0,0,1,.823-1.265,3.408,3.408,0,0,1,1.265-.823,6.087,6.087,0,0,1,2.043-.379c1.16-.053,1.508-.064,4.445-.064M12,1c-2.987,0-3.362.013-4.535.066a8.074,8.074,0,0,0-2.67.511,5.392,5.392,0,0,0-1.949,1.27,5.392,5.392,0,0,0-1.27,1.949,8.074,8.074,0,0,0-.511,2.67C1.013,8.638,1,9.013,1,12s.013,3.362.066,4.535a8.074,8.074,0,0,0,.511,2.67,5.392,5.392,0,0,0,1.27,1.949,5.392,5.392,0,0,0,1.949,1.27,8.074,8.074,0,0,0,2.67.511C8.638,22.987,9.013,23,12,23s3.362-.013,4.535-.066a8.074,8.074,0,0,0,2.67-.511,5.625,5.625,0,0,0,3.219-3.219,8.074,8.074,0,0,0,.511-2.67C22.987,15.362,23,14.987,23,12s-.013-3.362-.066-4.535a8.074,8.074,0,0,0-.511-2.67,5.392,5.392,0,0,0-1.27-1.949,5.392,5.392,0,0,0-1.949-1.27,8.074,8.074,0,0,0-2.67-.511C15.362,1.013,14.987,1,12,1Z"/>
                <path d="M12,6.351A5.649,5.649,0,1,0,17.649,12,5.649,5.649,0,0,0,12,6.351Zm0,9.316A3.667,3.667,0,1,1,15.667,12,3.667,3.667,0,0,1,12,15.667Z"/>
                <circle cx="17.872" cy="6.128" r="1.32"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
  