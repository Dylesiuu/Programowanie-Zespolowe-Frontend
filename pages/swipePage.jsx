import dynamic from 'next/dynamic';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import Image from 'next/image';
import AnimalCard from '../src/swiping/components/animalCard';
import Buttons from '../src/swiping/components/buttons';
import styles from '../src/styles/swipePage.module.css';
import LocationBar from '../src/localization/components/locationBar';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const MapComponent = dynamic(
  () => import('../src/localization/components/mapComponent'),
  { ssr: false }
);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SwipePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState(null);
  const [range, setRange] = useState(30000);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const userContext = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!location) return;

      setIsLoading(true);
      setError(null);
      try {
        const requestBody = {
          userId: '65f4c8e9f0a5a4d3b4a54321', // Replace with actual user ID
          lat: location.lat,
          lng: location.lng,
          range: range,
        };

        const response = await fetch(`${API_BASE_URL}/scrolling/match`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          setError(
            'Wygląda na to, że mamy problemy z serwerem. Spróbuj ponownie później.'
          );
          return;
        }

        const petData = await response.json();
        const formattedPets = petData.matchedAnimals.map((animal) => ({
          ...animal,
          traits: animal.traits.map((t) => t.name),
        }));
        setPets(formattedPets);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Błąd podczas pobierania zwierząt', error);
        setError(
          'Nie udało się pobrać danych o zwierzętach. Spróbuj ponownie.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [location, range, userContext.token]);

  const handleSwipe = useCallback(
    (decision) => {
      if (pets.length === 0) return;

      if (currentIndex < pets.length) {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, pets]
  );

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
  }, [handleSwipe]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.locationBarWrapper}>
          <LocationBar
            defaultLocation={location ? `${location.lat}, ${location.lng}` : ''}
            onLocationChange={(position) => setLocation(position)}
            onRangeChange={(newRange) => setRange(newRange)}
          />
        </div>

        {isLoading && <p>Ładowanie zwierzaczków...</p>}

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Odśwież</button>
          </div>
        )}

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
                <Image
                  src="https://media1.tenor.com/m/t7_iTN0iYekAAAAd/sad-sad-cat.gif"
                  alt="Koniec pjesków i kotków"
                  width={400}
                  height={400}
                  unoptimized
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SwipePage;
