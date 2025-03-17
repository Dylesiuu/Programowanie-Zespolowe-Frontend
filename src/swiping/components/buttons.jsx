import React from 'react';
import { FaTimes, FaHeart } from 'react-icons/fa'; //Icons for buttons
import styles from '../buttons.module.css';

const Buttons = ({ onDislike, onLike }) => {
  return (
    <div className={styles.buttons}>
      <button onClick={onDislike} className={styles.dislike} data-testid="dislike-button">
        <FaTimes />
      </button>
      <button onClick={onLike} className={styles.like} data-testid="like-button">
        <FaHeart />
      </button>
    </div>
  );
};

export default Buttons;