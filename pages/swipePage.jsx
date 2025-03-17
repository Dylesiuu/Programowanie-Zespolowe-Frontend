import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import AnimalCard from '../src/swiping/components/animalCard'; 
import Buttons from '../src/swiping/components/buttons';
import styles from '../src/styles/swipePage.module.css';         
import LocationBar from '../src/localization/components/locationBar';

const MapComponent = dynamic(() => import('../src/localization/components/mapComponent'), { ssr: false });
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

const SwipePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [location, setLocation] = useState(null); //Initialize with empty string to fetch from backend
  const [range, setRange] = useState(30); 
  const [pets, setPets] = useState([]); //Empty array to store pets
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchPets = async () => {
      if (!location) return; //Don't fetch if location is empty
  
      setIsLoading(true);
      setError(null);
      try {
        //Send location and range to the backend
        const response = await fetch(`${API_BASE_URL}/scrolling`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: location.lat,
            lng: location.lng,
            range: range,
          }),
        });
  
        if (!response.ok) {
          setError('Wygląda na to, że mamy problemy z serwerem. Spróbuj ponownie później.');
          return;
        }
  
        const petData = await response.json(); 
        setPets(petData); 
        setCurrentIndex(0); 
      } catch (error) {
        console.error('Error fetching animals:', error);
        setError('Failed to fetch animals. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPets();
  }, [location, range]); //Re-fetch when location or range changes

  const handleSwipe = (decision) => {
    if (pets.length === 0) return; //Don't swipe if there are no pets

    if (currentIndex < pets.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      return //Don't swipe if there are no pets
    }
    // obsłuha 'like' i 'dislike' tutaj bnędzie kiedyś :pp
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handleSwipe('dislike');
      } else if (event.key === 'ArrowRight') {
        handleSwipe('like');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, pets]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.locationBarWrapper}>
          {/*LocationBar component for selecting location and range*/}
          <LocationBar
            defaultLocation={location ? `${location.lat}, ${location.lng}` : ''}
            onLocationChange={(position) => setLocation(position)} 
            onRangeChange={(newRange) => setRange(newRange)}
          />
        </div>

        {/*Display loading state*/}
        {isLoading && <p>Ładowanie zwierzaczków...</p>}

        {/*Display error message*/}
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Odśwież</button>
          </div>
        )}

        {/*Display pets or a message if no pets are available*/}
        {!isLoading && !error && (
          <>
            {currentIndex < pets.length ? (
              <div className={styles.cardModule}>
                <div className={styles.cardWrapper}>
                  <AnimalCard {...pets[currentIndex]} />
                </div>
                <Buttons
                  onDislike={() => handleSwipe('dislike')}
                  onLike={() => handleSwipe('like')}
                />
              </div>
            ) : (
              <div className={styles.cardModule}>
              <p>Koniec piesków i kotków :c</p>
              <p>Zmień lokalizację lub zasięg, aby zobaczyć więcej!</p>
              <img src="https://media1.tenor.com/m/t7_iTN0iYekAAAAd/sad-sad-cat.gif" alt="Koniec pjesków i kotków" />
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SwipePage;