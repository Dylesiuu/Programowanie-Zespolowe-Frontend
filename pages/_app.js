import React from 'react';
import Menu from '../src/menu/components/menu';
import '../src/styles/global.css';
import 'normalize.css/normalize.css';
import Navbar from '@/navbar/components/Navbar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const noNavbarRoutes = ['/loginPage', '/registerPage'];
  return (
    <div className="page">
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} /> {}
    </div>
  );
}

export default MyApp;
