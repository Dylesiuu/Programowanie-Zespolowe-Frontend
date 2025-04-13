import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../animalCard.module.css';

const AnimalCard = ({
  images = [],
  name,
  gender,
  age,
  location,
  traits = [],
  shelter,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullImage, setIsFullImage] = useState(false);

  const handleNextImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePrevImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex(
      (currentImageIndex - 1 + images.length) % images.length
    );
  };

  const toggleFullImage = () => {
    setIsFullImage(!isFullImage);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer} onClick={toggleFullImage}>
        {images.length > 0 ? (
          <>
            <Image
              src={images[currentImageIndex]}
              alt={name}
              className={`${styles.image} ${isFullImage ? styles.fullImage : ''}`}
              width={400}
              height={400}
              unoptimized
            />
            <div className={styles.imageCounter}>
              {currentImageIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
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
          <div className={styles.noImageMessage}>No Image</div>
        )}
      </div>

      {isFullImage && (
        <div className={styles.overlay} onClick={toggleFullImage} />
      )}

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
