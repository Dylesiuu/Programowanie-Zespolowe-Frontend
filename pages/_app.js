import React from 'react';
import Menu from '../src/menu/components/menu';
import '../src/styles/global.css';
import 'normalize.css/normalize.css';
import Navbar from '../src/navbar/components/navbar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="page">
      {/* <Menu /> {} */}
      <Navbar /> {}
      <Component {...pageProps} /> {}
    </div>
  );
}

export default MyApp;
