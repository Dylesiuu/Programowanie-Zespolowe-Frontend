import { useState } from 'react';
import styles from '../menu.module.css'; 

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.menuContainer} ${isOpen ? styles.open : ''}`}>
      <button className={styles.menuButton} onClick={toggleMenu}>
        ☰
      </button>
      <nav className={styles.menu}>
        <ul>
          <li>Home</li>
          <li>Swipe</li>
          <li>Favourite</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  );
}
