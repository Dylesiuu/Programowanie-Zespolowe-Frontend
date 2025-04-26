import React from 'react';
import '../src/styles/global.css';
import 'normalize.css/normalize.css';
import Navbar from '../src/navbar/components/navbar';
import { useRouter } from 'next/router';
import { UserProvider } from '../src/context/userContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const hideNavbarRoutes = [
    '/',
    '/userCreatorPage',
    '/loginPage',
    '/registerPage',
  ];

  return (
    <UserProvider>
      <div className="page">
        {/* Conditionally render the Navbar */}
        {!hideNavbarRoutes.includes(router.pathname) && <Navbar />}
        <Component {...pageProps} />
      </div>
    </UserProvider>
  );
}

export default MyApp;
