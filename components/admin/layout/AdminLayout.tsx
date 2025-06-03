import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-6 py-3 hover:bg-gray-100"
          >
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/organizations"
            className={`flex items-center px-6 py-3 hover:bg-gray-100 ${
              isActive('/admin/organizations') ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span>Organizations</span>
          </Link>
          <Link
            href="/admin/offers"
            className={`flex items-center px-6 py-3 hover:bg-gray-100 ${
              isActive('/admin/offers') ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span>Offers</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 