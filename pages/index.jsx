// pages/index.jsx

import Hero from '../components/Hero';
import Cashback from '../components/Cashback';
import Loyalty from '../components/Loyalty';
import Discount from '../components/Discount';

const Home = () => {
  return (
    <main>
      <Hero />
      <Cashback />
      <Discount />
      <Loyalty />
    </main>
  );
};

export default Home;
