import { useState, useEffect } from 'react';
import AnimalCard from '../src/swiping/components/animalCard'; 
import styles from '../src/styles/swipePage.module.css';        
import Menu from '../src/menu/components/menu'; 
import LocationBar from '../src/localization/components/locationBar';

const SwipePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [location, setLocation] = useState(""); // Initialize with empty string to fetch from backend
  const [range, setRange] = useState(30); // Domyślnie 30 km
  const [pets, setPets] = useState([]); // New state for pet data

  const handleSwipe = (decision) => {
    // Zmiana zwierzaczka
    if (currentIndex < pets.length) {
      setCurrentIndex(currentIndex + 1);
    }
    // Możesz obsłużyć 'like' i 'dislike' tutaj (np. zapis do bazy).
    //console.log(`User swiped ${decision} on ${pets[currentIndex].name}`);
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
  }, [currentIndex, pets]);

  useEffect(() => {
    // Branie lokalizacji z backendu
    // const fetchUserLocation = async () => {
    //   try {
    //     const response = await fetch("/api/user"); // Ścieżka do endpointu
    //     if (response.ok) {
    //       const userData = await response.json();
    //       setLocation(userData.location); // Ustaw lokalizację z backendu
    //     } else {
    //       console.error("Błąd podczas pobierania lokalizacji");
    //     }
    //   } catch (error) {
    //     console.error("Błąd połączenia z backendem:", error);
    //   }
    // };

    // Fetch pet data
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:3000/scrolling/1"); // Ścieżka do endpointu
        if (response.ok) {
          const petData = await response.json();
          setPets(petData);
        } else {
          console.error("Błąd podczas pobierania danych zwierząt");
        }
      } catch (error) {
        console.error("Błąd połączenia z backendem:", error);
      }
    };

    // fetchUserLocation(); // Wywołanie funkcji przy załadowaniu komponentu
    fetchPets(); // Fetch pets data
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
        {currentIndex < pets.length ? (
          <>
          <div className={styles.cardWrapper}>
            <AnimalCard {...pets[currentIndex]} />
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