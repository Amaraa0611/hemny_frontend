import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/layout/AdminLayout';

// Dynamically import the OrganizationsPage component with no SSR
const OrganizationsPage = dynamic(
  () => import('../../../components/admin/organizations/OrganizationsPage'),
  { ssr: false }
);

const AdminOrganizationsPage: NextPage = () => {
  return (
    <AdminLayout>
      <OrganizationsPage />
    </AdminLayout>
  );
};

// Organization category edit page should be placed at /admin/organizations/[id]/categories.tsx

export default AdminOrganizationsPage;