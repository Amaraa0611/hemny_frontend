// components/Header.jsx

import React, { useState, useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-center flex-1 sm:flex-none sm:justify-start">
            <Link href="/" className="flex-shrink-0">
              <img 
                src="/images/logo/Hemny_logo.png" 
                alt="Hemny Logo" 
                className="h-8 w-auto"
              />
            </Link>
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
  