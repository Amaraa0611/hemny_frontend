// pages/_app.jsx
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/globals.css';
import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
      },
    },
  }));

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        {/* <MainLayout> */}
          <Component {...pageProps} />
        {/* </MainLayout> */}
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
