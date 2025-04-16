'use client';
import React from 'react';
import Menu from '../src/menu/components/menu';
import '../src/styles/global.css';
import 'normalize.css/normalize.css';
import Navbar from '../src/navbar/components/Navbar';
import { UserProvider } from '@/context/userContext';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <div className="page">
        {/* <Menu /> {} */}
        <Navbar /> {}
        <Component {...pageProps} /> {}
      </div>
    </UserProvider>
  );
}

export default MyApp;
