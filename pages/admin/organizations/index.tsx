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

export default AdminOrganizationsPage;