// pages/index.jsx

import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/Hero';
import Cashback from '../components/Cashback';
import Loyalty from '../components/Loyalty';
import Discount from '../components/Discount';

const Home = () => {
  return (
    <MainLayout>
      <main>
        <Hero />
        <Cashback />
        <Discount />
        <Loyalty />
      </main>
    </MainLayout>
  );
};

export default Home;
