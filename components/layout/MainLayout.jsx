// components/layout/MainLayout.jsx

import Header from '../Header';
import SiteMenu from '../SiteMenu';
import Footer from '../Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SiteMenu />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
