import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../menu.module.css';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.menuContainer} ${isOpen ? styles.open : ''}`}>
      {!isLargeScreen && (
        <button className={styles.menuButton} onClick={toggleMenu}>
          ☰
        </button>
      )}
      <nav className={styles.menu} role="navigation">
        <ul>
          <li>
            <Link href="/homePage">Home</Link>
          </li>
          <li>
            <Link href="/swipePage">Swipe</Link>
          </li>
          <li>Favourite</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  );
}
