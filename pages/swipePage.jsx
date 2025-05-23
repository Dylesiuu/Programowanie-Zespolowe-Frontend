import dynamic from 'next/dynamic';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import Image from 'next/image';
import AnimalCard from '../src/swiping/components/animalCard';
import Buttons from '../src/swiping/components/buttons';
import LocationBar from '../src/localization/components/locationBar';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';
import { useAuthFetch } from '@/lib/authFetch';

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
  const { created } = router.query;
  const [showSuccess, setShowSuccess] = useState(false);
  const fetchData = useAuthFetch();

  useEffect(() => {
    if (!userContext.isLoggedIn()) {
      router.replace('/');
    }
  }, [router, userContext]);

  useEffect(() => {
    if (created === 'true') {
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 20000);

      return () => clearTimeout(timeout);
    }
  }, [created]);

  useEffect(() => {
    if (userContext.user?.location && userContext.user.location.length === 2) {
      const timeout = setTimeout(() => {
        setLocation({
          lat: userContext.user.location[0],
          lng: userContext.user.location[1],
        });
      }, 1000); // 1000 ms = 1 second delay

      return () => clearTimeout(timeout);
    }
  }, [userContext.user]);

  useEffect(() => {
    const fetchPets = async () => {
      if (!location) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const requestBody = {
          lat: location.lat,
          lng: location.lng,
          range: range,
        };

        const response = await fetchData(`${API_BASE_URL}/scrolling/match`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError(
              'Brak zwierzaków w tej okolicy. Spróbuj zmienić lokalizację lub zwiększyć zasięg.'
            );
          } else {
            setError(
              'Wygląda na to, że mamy problemy z serwerem. Spróbuj ponownie później.'
            );
          }
          return;
        }

        const petData = await response.json();
        const formattedPets = Array.isArray(petData.matchedAnimals)
          ? petData.matchedAnimals.map((animal) => ({
              ...animal,
              traits: animal.traits.map((t) => t.text),
            }))
          : [];

        setPets(
          Array.isArray(formattedPets) && formattedPets.length > 0
            ? formattedPets
            : []
        );
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

  const handleLike = async () => {
    const petId = pets[currentIndex]._id;
    const email = userContext.user.email;

    try {
      const response = await fetchData(`${API_BASE_URL}/user/addfavourite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          favourites: [petId],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Zwierzę zostało dodane do ulubionych!');
      } else if (response.status === 400) {
        // Jeśli zwierzę jest już w ulubionych
        setLikeError('Zwierzę jest już w Twoich ulubionych!');
      } else {
        console.error(data.message || 'Błąd podczas dodawania do ulubionych');
      }
    } catch (error) {
      console.error('Błąd przy dodawaniu do ulubionych:', error);
      alert('Wystąpił błąd. Spróbuj ponownie.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') handleSwipe('dislike');
      else if (event.key === 'ArrowRight') handleSwipe('like');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  return (
    <div className="flex flex-col min-h-screen bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-[#FFF0E9]">
      {/* Pasek lokalizacji */}
      <div className="flex justify-center px-4 mt-18">
        <LocationBar
          defaultLocation={location ? `${location.lat}, ${location.lng}` : ''}
          onLocationChange={(position) => setLocation(position)}
          onRangeChange={(newRange) => setRange(newRange)}
        />
      </div>

      {showSuccess && (
        <div className="mx-auto mt-4 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded-xl text-center max-w-xl">
          Podanie zostało pomyślnie utworzone!
        </div>
      )}

      {isLoading && (
        <p className="text-center mt-4">Ładowanie zwierzaczków...</p>
      )}

      {error && (
        <div className="text-red-600 text-center my-5">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
          >
            Odśwież
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {currentIndex < pets.length ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6">
              <div className="w-full max-w-md flex flex-col items-center">
                {/* AnimalCard z proporcjami */}
                <div className="w-full aspect-[3/4]">
                  {console.log('Current pet id:', pets[currentIndex]?._id)}
                  {console.log(
                    'Current pet shelter:',
                    pets[currentIndex]?.shelter
                  )}

                  <AnimalCard
                    id={pets[currentIndex]._id}
                    images={pets[currentIndex].images}
                    name={pets[currentIndex].name}
                    gender={pets[currentIndex].gender}
                    age={pets[currentIndex].age}
                    location={pets[currentIndex].location}
                    traits={pets[currentIndex].traits}
                    shelter={pets[currentIndex].shelter}
                  />
                </div>

                <Buttons
                  onDislike={() => handleSwipe('dislike')}
                  onLike={() => {
                    handleSwipe('like');
                    handleLike();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <p>Brak piesków i kotków :c</p>
              <p>Zmień lokalizację lub zasięg, aby zobaczyć więcej!</p>
              <Image
                src="https://media1.tenor.com/m/t7_iTN0iYekAAAAd/sad-sad-cat.gif"
                alt="Brak piesków i kotków"
                width={400}
                height={400}
                unoptimized
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SwipePage;
