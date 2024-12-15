import { useState, useEffect } from 'react';
import AnimalCard from '../src/swiping/components/animalCard'; 
import styles from '../src/styles/swipePage.module.css';        
import { mockAnimals } from '../src/swiping/mockData';
// import { mockUserData } from '../src/localization/mockUserData'; // Removed this line
import Menu from '../src/menu/components/menu'; 
import LocationBar from '../src/localization/components/locationBar';

const SwipePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [location, setLocation] = useState(""); // Revert to empty string to fetch from backend
  const [range, setRange] = useState(30); // Domyślnie 30 km

  const handleSwipe = (decision) => {
    // Zmiana zwierzaczka
    if (currentIndex < mockAnimals.length) {
      setCurrentIndex(currentIndex + 1);
    }
    // Możesz obsłużyć 'like' i 'dislike' tutaj (np. zapis do bazy).
    //console.log(`User swiped ${decision} on ${mockAnimals[currentIndex].name}`);
  };

  useEffect(() => {
    // Obsługa swipeowania strzałkami
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
  }, [currentIndex]);

  useEffect(() => {
    // Branie lokalizacji z backendu
    const fetchUserLocation = async () => {
      try {
        const response = await fetch("/api/user"); // Ścieżka do endpointu
        if (response.ok) {
          const userData = await response.json();
          setLocation(userData.location); // Ustaw lokalizację z backendu
        } else {
          console.error("Błąd podczas pobierania lokalizacji");
        }
      } catch (error) {
        console.error("Błąd połączenia z backendem:", error);
      }
    };

    fetchUserLocation(); // Wywołanie funkcji przy załadowaniu komponentu
  }, []);

  useEffect(() => {
    // Ensure no margin on body
    document.body.style.margin = '0';
  }, []);

  return (
    <div className={styles.page}>
      <Menu />

      <div className={styles.container}>
        <LocationBar
          defaultLocation={location}
          onLocationChange={setLocation}
          onRangeChange={setRange}
        />
        {currentIndex < mockAnimals.length ? (
          <>
          <div className={styles.cardWrapper}>
            <AnimalCard {...mockAnimals[currentIndex]} />
          </div>
          
          <div className={styles.buttons}>
          <button onClick={() => handleSwipe('dislike')} className={styles.dislike}>
            ✖
          </button>
          <button onClick={() => handleSwipe('like')} className={styles.like}>
            ❤️
          </button>
        </div>
        </>
          
        ) : (
          <div>No more animals :c</div>
        )}
        
      </div>
    </div>
  );
};

export default SwipePage;
