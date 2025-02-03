// pages/index.jsx

import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/Hero';
import Cashback from '../components/Cashback';
import Loyalty from '../components/Loyalty';

const Home = () => {
  return (
    <MainLayout>
      <main>
        <Hero />
        <Cashback />
        <Loyalty />
      </main>
    </MainLayout>
  );
};

export default Home;
