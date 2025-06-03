import React from 'react';
import AdminSidebar from '../admin/AdminSidebar';
import Head from 'next/head';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = 'Admin Dashboard'
}) => {
  return (
    <>
      <Head>
        <title>{title} - Your App Name</title>
      </Head>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout; 