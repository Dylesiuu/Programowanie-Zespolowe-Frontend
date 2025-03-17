import React from 'react'; 
import Menu from '../src/menu/components/menu';
import '../src/styles/global.css'; 
import 'normalize.css/normalize.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="page">
      <Menu /> {}
      <Component {...pageProps} /> {}
    </div>
  );
}

export default MyApp;