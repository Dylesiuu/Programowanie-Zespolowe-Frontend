import React from 'react';
import styles from '../animalCard.module.css';

const AnimalCard = ({ name, location, gender, age, traits = [], image, shelter }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.image} />
      </div>
      <div className={styles.info}>
        <h2>{name}</h2>
        <p>{`${gender}, ${age}`}</p>
        <p>{location}</p>
      </div>
      <div className={styles.traits}>
        {traits.map((trait) => (
          <span key={trait} className={styles.trait}>
            {trait}
          </span>
        ))}
      </div>
      <div className={styles.shelterInfo}>
        <p>{shelter}</p>
      </div>
    </div>
  );
};

export default AnimalCard;