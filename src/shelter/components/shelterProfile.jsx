import React, { useState, useContext, useEffect, useRef } from 'react';
import InfoCard from './infoCard';
import AnimalsField from './animalsField';
import AnimalCard from './animalCard';
import MobileInfoCard from './mobileInfoCard';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ShelterProfile = ({ shelterId, animalId }) => {
  const [shelter, setShelter] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobileCardVisible, setIsMobileCardVisible] = useState(false);
  const userContext = useContext(UserContext);
  const [refreshShelter, setRefreshShelter] = useState(false);
  const fetchData = useAuthFetch();
  const router = useRouter();

  useEffect(() => {
    const fetchShelterData = async () => {
      try {
        const response = await fetchData(`${API_BASE_URL}/shelter/find-by-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
          body: JSON.stringify({ shelterId }),
        });

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return;
        }

        const data = await response.json();
        setShelter(data.shelter);
      } catch (error) {
        console.error('Error fetching shelter data:', error.message);
      }
    };

    if (shelterId && shelterId !== 'null') {
      fetchShelterData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shelterId, refreshShelter]);

  useEffect(() => {
    if (refreshShelter) {
      closeAnimalCard();
    }
  }, [refreshShelter]);

  useEffect(() => {
    if (animalId) {
      const animal = shelter?.animals.find((animal) => animal._id === animalId);
      if (animal) {
        handleAnimalClick(animal);
      }
    }
  }, [animalId, shelter?.animals]);

  const handleEdit = () => {
    router.push(`/shelterCreator?shelterId=${shelterId}`);
  };

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
    setTimeout(() => setShowModal(true), 50);
  };

  const closeAnimalCard = () => {
    setShowModal(false);
    setTimeout(() => setSelectedAnimal(null), 300);
  };

  const toggleMobileCard = () => {
    setIsMobileCardVisible((prev) => !prev);
  };

  const addToFavourite = async () => {
    try {
      const response = await fetchData(`${API_BASE_URL}/user/addfavourite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({ favourites: [selectedAnimal._id] }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.statusCode === 200) {
        userContext.setUser(data.user);
        console.log('Added to favourites');
        return;
      }
      console.log('data: ', data);
      console.error('Failed to add to favourites: ', data.message);
    } catch (error) {
      console.error('Error fetching shelter data:', error.message);
    }
  };

  const removeFromFavourite = async () => {
    try {
      const response = await fetchData(`${API_BASE_URL}/user/removefavourite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({ favourites: [selectedAnimal._id] }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.statusCode === 200) {
        userContext.setUser(data.user);
        console.log('Removed from favourites');
        return;
      }
      console.error('Failed to add to favourites: ', data.message);
    } catch (error) {
      console.error('Error fetching shelter data:', error.message);
    }
  };

  if (!shelter) {
    return <div>Ładowanie danych schroniska...</div>;
  }

  return (
    <div className="flex w-full h-full">
      {/* Mobile Info Card Background blur */}
      <div
        data-testid="mobile-backdrop"
        className={`fixed inset-0 sm:hidden transition-all duration-400 ease-in-out ${
          isMobileCardVisible
            ? 'backdrop-blur-md opacity-100'
            : 'opacity-0 pointer-events-none'
        } z-49`}
      ></div>
      {/* Mobile Info Card for Smaller Screens */}
      <div
        className={`
    fixed inset-0 z-50 transition-transform duration-500 ease-in-out sm:hidden
    ${isMobileCardVisible ? 'translate-x-0' : '-translate-x-[75%]'}
  `}
      >
        <MobileInfoCard
          shelter={shelter}
          onEdit={handleEdit}
          toggleCard={toggleMobileCard}
          userContext={userContext}
        />
      </div>

      <div className="flex h-full w-full items-center justify-between pt-15 px-7 space-x-3 sm:space-x-7">
        {/* Info Card for Larger Screens */}
        <div className="hidden sm:flex w-full h-full max-w-md items-center justify-center py-5">
          <InfoCard
            shelter={shelter}
            onEdit={handleEdit}
            userContext={userContext}
          />
        </div>

        {/* Animals Field */}
        <div className="flex w-full h-full items-center justify-center py-5">
          <AnimalsField
            animals={shelter.animals}
            onAnimalClick={handleAnimalClick}
            userContext={userContext}
            shelterId={shelter._id}
          />
        </div>
      </div>

      {/* Animal Card Modal */}
      {selectedAnimal && (
        <div
          className={`fixed flex inset-0 items-center justify-center z-50 transition-all duration-500 ease-in-out ${
            showModal ? 'backdrop-blur-sm opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`relative w-[30%] h-[85%] min-w-[20rem] top-7 bg-[#fefaf7]/85 p-6 rounded-3xl shadow-2xl transform transition-all duration-300 ease-in-out ${
              showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <button
              className="absolute top-2 right-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={closeAnimalCard}
            >
              ✕
            </button>
            <AnimalCard
              animalId={selectedAnimal._id}
              userContext={userContext}
              addToFavourite={addToFavourite}
              removeFromFavourite={removeFromFavourite}
              setRefreshShelter={setRefreshShelter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterProfile;
