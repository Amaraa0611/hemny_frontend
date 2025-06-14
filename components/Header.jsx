// components/Header.jsx

import React, { useState, useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL +'/categories');
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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-center flex-1 sm:flex-none sm:justify-start">
            <a href="/" className="flex-shrink-0">
              <img 
                src="/images/logo/Hemny_logo.png" 
                alt="Hemny Logo" 
                className="h-8 w-auto"
              />
            </a>

            {/* Categories Dropdown - Commented out for later use
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
                {categories.filter(cat => cat.parent_id === null).map((category) => (
                  <div 
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(category.id)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <a 
                      href={`/category/${category.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <span className="font-noto-sans tracking-wide">
                        {category.name_mn}
                      </span>
                      <svg 
                        className="w-4 h-4 text-gray-400" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                      >
                        <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>

                    {activeCategory === category.id && (
                      <div className="absolute left-[200px] top-0 w-[600px] bg-white border border-gray-200 shadow-lg p-6">
                        <div className="flex">
                          <div className="flex-1">
                            <h3 className="font-bold font-noto-sans text-lg tracking-wide mb-4">
                              {category.name_mn}
                            </h3>
                            <p className="text-gray-600 mb-4">{category.description_mn}</p>
                            <div className="grid grid-cols-2 gap-4">
                              {category.children && category.children.map((subCategory) => (
                                <a 
                                  key={subCategory.id}
                                  href={`/category/${subCategory.id}`} 
                                  className="text-gray-600 hover:text-primary font-noto-sans"
                                >
                                  {subCategory.name_mn}
                                </a>
                              ))}
                            </div>
                          </div>
                          <div className="w-48 ml-6">
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
            */}
          </div>

          {/* Facebook Icon */}
          <div className="flex items-center">
            <a href="https://www.facebook.com/profile.php?id=61575261267249" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-600 hover:text-primary transition-colors"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
  