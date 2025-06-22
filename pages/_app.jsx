// pages/_app.jsx
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
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

  // If the page has its own layout, use that. Otherwise, use MainLayout.
  const getLayout = Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CL7NK4THHQ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CL7NK4THHQ');
            `,
          }}
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
