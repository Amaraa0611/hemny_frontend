import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/organizations');
  }, [router]);

  return null;
};

export default AdminDashboard; 