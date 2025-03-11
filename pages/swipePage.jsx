import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import AnimalCard from '../src/swiping/components/animalCard'; 
import Buttons from '../src/swiping/components/buttons';
import styles from '../src/styles/swipePage.module.css';         
import LocationBar from '../src/localization/components/locationBar';
import { FaTimes, FaHeart } from 'react-icons/fa'; 

const mockPets = [
  {
    id: 0,
    image: [
      'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Dog_in_animal_shelter_in_Washington%2C_Iowa.jpg'
    ],
    name: 'Mike',
    gender: 'Male',
    age: '3 years old',
    location: 'Gdańsk',
    traits: ['Friendly', 'Playful', 'Energetic'], 
    shelter: 'Happy Tails Shelter'
  },
  {
    id: 1,
    image: [
      'https://bestfriends.org/sites/default/files/styles/image_small/public/image/Cat-enrichment-Unnamed-Female-Kitty-A-578-Playing-3889_Sellers_1.jpg-546807.jpg?itok=BBtYqHs1',
      'https://bestfriends.org/sites/default/files/resource_article_images/Cat-enrichment-Valley-6431SAx%255B1%255D.jpg'
    ],
    name: 'Mittens',
    gender: 'Male',
    age: '2 years old',
    location: 'Toruń',
    traits: ['Calm', 'Affectionate', 'Lazy'],
    shelter: 'Cozy Paws Shelter'
  },
  {
    id: 2,
    image: [
      'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
    ],
    name: 'Cookie',
    gender: 'Female',
    age: '4 years old',
    location: 'Gorzów Wielkopolski',
    traits: ['Energetic', 'Loyal', 'Curious'],
    shelter: 'Furry Friends Shelter'
  }
];

const MapComponent = dynamic(() => import('../src/localization/components/mapComponent'), { ssr: false });

const SwipePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [location, setLocation] = useState(""); // Initialize with empty string to fetch from backend
  const [range, setRange] = useState(30); // Default 30 km
  const [pets, setPets] = useState(mockPets); // Use mock data for pet data

  // useEffect(() => {
  //   const fetchPets = async () => {
  //     if (!location) return; // Don't fetch if location is empty
  
  //     setIsLoading(true);
  //     try {
  //       // Send location and range to the backend
  //       const response = await fetch("http://localhost:3000/scrolling", {
  //         method: 'POST', // Use POST to send data
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ location, range }), // Include location and range in the request
  //       });
  
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch animals');
  //       }
  
  //       const petData = await response.json(); // Parse the response once
  //       setPets(petData); // Update the list of pets
  //       setCurrentIndex(0); // Reset to the first pet
  //     } catch (error) {
  //       console.error('Error fetching animals:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  
  //   fetchPets();
  // }, [location, range]); // Re-fetch when location or range changes

  const fetchPets = async () => {
    try {
      const response = await fetch("http://localhost:3000/scrolling"); // Ścieżka do endpointu
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
  fetchPets(); 


  const handleSwipe = (decision) => {
    if (pets.length === 0) return; // Don't swipe if there are no pets
    // Zmiana zwierzaczka
    if (currentIndex < pets.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      return // Don't swipe if there are no pets
    }
    // obsłuha 'like' i 'dislike' tutaj bnędzie kiedyś :pp
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.locationBarWrapper}>
          <LocationBar
            defaultLocation={location}
            onLocationChange={setLocation}
            onRangeChange={setRange}
          />
        </div>
        {currentIndex < pets.length ? (
          <>
          <div className={styles.cardModule}>
            <div className={styles.cardWrapper}>
              <AnimalCard {...pets[currentIndex]} />
            </div>
            <Buttons 
              onDislike={() => handleSwipe('dislike')} 
              onLike={() => handleSwipe('like')} 
              />
          </div>
          </>
        ) : (
          <div className={styles.cardModule}>
            <p>Koniec piesków i kotków :c</p>
            <p>Zmień lokalizację lub zasięg, aby zobaczyć więcej!</p>
            <img src="https://media1.tenor.com/m/t7_iTN0iYekAAAAd/sad-sad-cat.gif" alt="Koniec pjesków i kotków" />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default SwipePage;