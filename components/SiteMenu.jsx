import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { blogApi } from '../services/blogApi';
import { ChevronDownIcon, HomeIcon, BookOpenIcon } from '@heroicons/react/24/solid';

const menuItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Blog', href: '/blog', icon: BookOpenIcon },
];

const MainMenu = () => {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await blogApi.getTags();
        setTags(data || []);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  const renderLink = (item, children) => {
    const isBlogItem = item.name === 'Blog';
    const isActive = isBlogItem
      ? router.pathname.startsWith('/blog')
      : router.pathname === item.href;

    const Icon = item.icon;

    return (
      <Link href={item.href} legacyBehavior>
        <a
          className={`inline-flex items-center h-14 px-1 pt-1 border-b-2 text-base font-medium transition-all duration-300 group ${
            isActive
              ? 'border-indigo-500 text-gray-900 font-semibold'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          {Icon && <Icon className="mr-2 h-5 w-5" />}
          {children}
        </a>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-8 h-14 items-center">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="relative"
              onMouseEnter={() => item.name === 'Blog' && setDropdownOpen(true)}
              onMouseLeave={() => item.name === 'Blog' && setDropdownOpen(false)}
            >
              {item.name === 'Blog' ? (
                <>
                  {renderLink(item, (
                    <>
                      <span>{item.name}</span>
                      <ChevronDownIcon
                        className={`ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500 transition-transform duration-200 ${
                          isDropdownOpen ? 'transform rotate-180' : ''
                        }`}
                      />
                    </>
                  ))}
                  <div
                    className={`absolute left-0 mt-0 w-56 origin-top-left rounded-md bg-white/90 backdrop-blur-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-out z-50 ${
                      isDropdownOpen
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="py-2 max-h-64 overflow-y-auto">
                      {tags.map((tag) => (
                        <Link
                          key={tag.tag_id}
                          href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                          legacyBehavior
                        >
                          <a
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r from-indigo-50 to-purple-50"
                            onClick={() => setDropdownOpen(false)}
                          >
                            #{tag.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                renderLink(item, item.name)
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainMenu;