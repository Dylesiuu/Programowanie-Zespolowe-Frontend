import React, { useState } from 'react';
import styles from '../animalCard.module.css';

const AnimalCard = ({ image = [], name, gender, age, location, traits = [], shelter }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullImage, setIsFullImage] = useState(false);

  const handleNextImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((currentImageIndex + 1) % image.length);
  };

  const handlePrevImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((currentImageIndex - 1 + image.length) % image.length);
  };

  const toggleFullImage = () => {
    setIsFullImage(!isFullImage);
  };

  return (
    <div className={styles.card}>

      <div className={styles.imageContainer} onClick={toggleFullImage}>

        {image.length > 0 ?(
          <>
            <img
              src={image[currentImageIndex]}
              alt={name}
              className={`${styles.image} ${isFullImage ? styles.fullImage : ''}`}
            />

            {/*For multiple images */}
            {image.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className={`${styles.prevButton} ${isFullImage ? styles.fullScreenButton : ''}`}
                >
                  ‹
                </button>

                <button
                  onClick={handleNextImage}
                  className={`${styles.nextButton} ${isFullImage ? styles.fullScreenButton : ''}`}
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          //When there are no images show message
          <div className={styles.noImageMessage}>
            No Image
          </div>
        )}
      </div>

      {isFullImage && <div className={styles.overlay} onClick={toggleFullImage} />}

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