import React from 'react'; 
import Menu from '../src/menu/components/menu';
import '../src/styles/global.css'; // Import global styles
import 'normalize.css/normalize.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="page">
      <Menu /> {/* Include the menu component */}
      <Component {...pageProps} /> {/* Render the current page */}
    </div>
  );
}

export default MyApp;