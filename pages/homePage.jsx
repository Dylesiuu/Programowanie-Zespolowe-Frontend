import React from 'react';
import Menu from '../src/menu/components/menu';
import styles from '../src/styles/homePage.module.css'; 
import 'normalize.css/normalize.css';

const HomePage = () => {
  return (
    <div className={styles.page}>
      <Menu />
      <div className={styles.container}>
        
        <h1>budowa</h1>
        <img 
          src="https://web.archive.org/web/20091021081815im_/http://www.geocities.com/buttre005/images/cat.gif" 
          alt="Construction Cat"
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default HomePage;