import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import AdminLayout from '../../../components/admin/AdminLayout';

// Dynamically import the OffersPage component with no SSR
const OffersPage = dynamic(
  () => import('../../../components/admin/offers').then(mod => mod.OffersPage),
  { ssr: false }
);

const AdminOffersPage: NextPage = () => {
  return (
    <AdminLayout>
      <OffersPage />
    </AdminLayout>
  );
};

export default AdminOffersPage; 