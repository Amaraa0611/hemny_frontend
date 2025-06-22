import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminSidebar = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path ? 'bg-gray-700' : '';
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-6">
      <Link href="/admin" className="block">
        <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
      </Link>
      
      <nav className="space-y-2">
        <Link 
          href="/admin/organizations" 
          className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/organizations')}`}
        >
          Organizations
        </Link>
        <Link 
          href="/admin/offers" 
          className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/offers')}`}
        >
          Offers
        </Link>
        <div className="pt-2">
          <h2 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Blog
          </h2>
          <div className="mt-2 space-y-1">
            <Link 
              href="/admin/blog" 
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/blog')}`}
            >
              Posts
            </Link>
            <Link 
              href="/admin/blog/categories" 
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/blog/categories')}`}
            >
              Categories
            </Link>
            <Link 
              href="/admin/blog/tags" 
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${isActive('/admin/blog/tags')}`}
            >
              Tags
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 