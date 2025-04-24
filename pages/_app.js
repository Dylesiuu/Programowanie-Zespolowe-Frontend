import React from 'react';
import '../src/styles/global.css';
import 'normalize.css/normalize.css';
import Navbar from '../src/navbar/components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="page">
      <Navbar /> {}
      <Component {...pageProps} /> {}
    </div>
  );
}

export default MyApp;
