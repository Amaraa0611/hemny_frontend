// pages/index.jsx

import Hero from '../components/Hero';
import Cashback from '../components/Cashback';
import Loyalty from '../components/Loyalty';
import Discount from '../components/Discount';
import Head from 'next/head';

const Home = () => {
  return (
    <>
      <Head>
        <title>Hemny.mn – Хэмнэлт, урамшуулал, хөнгөлөлтийн төвлөрсөн платформ</title>
        <meta name="description" content="Монголын хамгийн том хэмнэлт, урамшуулал, хөнгөлөлтийн платформ – Hemny.mn дээр хамгийн шилдэг саналуудыг олж аваарай!" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hemny.mn/" />
        <meta property="og:title" content="Hemny.mn – Хэмнэлт, урамшуулал, хөнгөлөлтийн төвлөрсөн платформ" />
        <meta property="og:description" content="Монголын хамгийн том хэмнэлт, урамшуулал, хөнгөлөлтийн платформ – Hemny.mn дээр хамгийн шилдэг саналуудыг олж аваарай!" />
        <meta property="og:image" content="https://hemny.mn/og-image.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://hemny.mn/" />
        <meta name="twitter:title" content="Hemny.mn – Хэмнэлт, урамшуулал, хөнгөлөлтийн төвлөрсөн платформ" />
        <meta name="twitter:description" content="Монголын хамгийн том хэмнэлт, урамшуулал, хөнгөлөлтийн платформ – Hemny.mn дээр хамгийн шилдэг саналуудыг олж аваарай!" />
        <meta name="twitter:image" content="https://hemny.mn/og-image.jpg" />
      </Head>
      <main>
        <Hero />
        <Cashback />
        <Discount />
        <Loyalty />
      </main>
    </>
  );
};

export default Home;
