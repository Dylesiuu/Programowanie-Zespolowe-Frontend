import React from 'react';
import { FaTimes, FaHeart } from 'react-icons/fa';
import styles from '../buttons.module.css'; // Create a new CSS file for buttons

const Buttons = ({ onDislike, onLike }) => {
  return (
    <div className={styles.buttons}>
      <button onClick={onDislike} className={styles.dislike}>
        <FaTimes />
      </button>
      <button onClick={onLike} className={styles.like}>
        <FaHeart />
      </button>
    </div>
  );
};

export default Buttons;