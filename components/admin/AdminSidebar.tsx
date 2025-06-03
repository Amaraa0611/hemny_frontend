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
      </nav>
    </aside>
  );
};

export default AdminSidebar; 