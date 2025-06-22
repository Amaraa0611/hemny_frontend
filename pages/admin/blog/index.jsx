import React from 'react';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/layout/AdminLayout';

// Dynamically import the BlogList component with no SSR
const BlogList = dynamic(
  () => import('../../../components/admin/blog/BlogList'),
  { ssr: false }
);

const AdminBlogPage = () => {
  return (
    <AdminLayout>
      <BlogList />
    </AdminLayout>
  );
};

export default AdminBlogPage; 