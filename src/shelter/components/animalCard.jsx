import React, { useState } from 'react';
import Image from 'next/image';
import { useEffect } from 'react';
import { FaHeart, FaTimes, FaRegTrashAlt } from 'react-icons/fa';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useAuthFetch } from '@/lib/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AnimalCard = ({
  animalId,
  userContext,
  addToFavourite,
  removeFromFavourite,
  setRefreshShelter,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isTraitsVisible, setIsTraitsVisible] = useState(false);
  const [animal, setAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const router = useRouter();
  const fetchData = useAuthFetch();

  const fetchAnimalData = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetchData(`${API_BASE_URL}/animals/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const data = await response.json();
      setAnimal(data);
      console.log('Animal data:', data);
    } catch (error) {
      console.error('Error fetching animal data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAnimal = async (id) => {
    try {
      const response = await fetchData(`${API_BASE_URL}/animals/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      });
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.warn(data.message);
      setRefreshShelter((prev) => !prev);
    } catch (error) {
      console.error('Error deleting animal:', error.message);
    }
  };

  useEffect(() => {
    if (animalId) {
      fetchAnimalData(animalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId]);

  const handleAdoption = async (id) => {
    try {
      const response = await fetchData(
        `${API_BASE_URL}/animals/${id}/adoption/${animal.shelter}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`,
          },
        }
      );
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const data = await response.json();
      console.warn(data.message);
      setAnimal(data);
    } catch (error) {
      console.error('Error while changind adopt status:', error.message);
    }
  };

  const showDescription = () => {
    setIsDescriptionVisible(true);
  };

  const hideDescription = () => {
    setIsDescriptionVisible(false);
  };

  const showTraits = () => {
    setIsTraitsVisible(true);
  };

  const hideTraits = () => {
    setIsTraitsVisible(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === animal.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? animal.images.length - 1 : prevIndex - 1
    );
  };

  const showImageModal = () => {
    setIsImageModalVisible(true);
  };

  const hideImageModal = () => {
    setIsImageModalVisible(false);
  };

  const showWarning = () => {
    setIsWarningVisible(true);
  };

  const hideWarning = () => {
    setIsWarningVisible(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full h-full p-6 rounded-3xl shadow-2xl bg-white items-center justify-center">
        <p>Ładowanie danych zwierzęcia...</p>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="flex flex-col w-full h-full p-6 rounded-3xl shadow-2xl bg-white items-center justify-center">
        <p>Nie udało się załadować danych zwierzęcia.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 rounded-3xl shadow-2xl bg-white justify-between">
      {/* Trash Button */}
      <div className="absolute top-2 left-2">
        <button
          className="flex w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 bg-[#B12828] text-white rounded-full items-center justify-center text-2xl transition-all duration-300 ease-in-out hover:bg-[#7c1c1c] hover:scale-110 cursor-pointer"
          onClick={showWarning}
          data-testid="delete-animal-button"
        >
          <FaRegTrashAlt className="w-[60%] h-[60%]" />
        </button>
      </div>
      {/* Warning Window */}
      {isWarningVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-md">
            <p className="text-gray-800 text-lg mb-4">
              Czy na pewno chcesz usunąć to zwierzę?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-[#B12828] text-white rounded-lg hover:bg-[#7c1c1c] transition-all cursor-pointer"
                onClick={() => {
                  removeAnimal(animalId);
                  hideWarning();
                }}
              >
                Tak
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all cursor-pointer"
                onClick={hideWarning}
              >
                Nie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animal Image Carousel */}
      <div className="w-full h-[40%] relative pb-4">
        {animal.images[currentImageIndex]?.preview ? (
          <Image
            src={animal.images[currentImageIndex].preview}
            alt={animal.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-2xl items-center cursor-pointer"
            onClick={showImageModal}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 rounded-2xl">
            Brak zdjęcia
          </div>
        )}
        {/* Navigation Buttons - Show only if more than one image */}
        {animal.images.length > 1 && (
          <>
            <button
              data-testid="prev-button"
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] p-1.5 pl-1 rounded-full shadow-lg items-center justify-center cursor-pointer"
              onClick={handlePreviousImage}
            >
              <BiLeftArrow className="h-4 w-4" />
            </button>
            <button
              data-testid="next-button"
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] p-1.5 pr-1 rounded-full shadow-lg items-center justify-center cursor-pointer"
              onClick={handleNextImage}
            >
              <BiRightArrow className="h-4 w-4" />
            </button>
          </>
        )}
        {/* Image Counter - Show only if more than one image */}
        {animal.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#CE8455] text-[#fefaf7] text-sm px-3 py-1 rounded-full shadow-lg items-center justify-center">
            {currentImageIndex + 1}/{animal.images.length}
          </div>
        )}
      </div>

      {/* Animal Info */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{animal.name}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Wiek:</strong> {animal.age}
      </p>
      {/* Description */}
      <p className="text-gray-600 mb-2 wrap-break-word">
        <strong>Opis: </strong>
        {animal.description.length > 100 ? (
          <>
            {animal.description.slice(0, 100).trimEnd()}...{' '}
            <button
              className="text-[#d46622] hover:underline cursor-pointer ml-1"
              onClick={showDescription}
            >
              Więcej...
            </button>
          </>
        ) : (
          animal.description
        )}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Płeć:</strong> {animal.gender}
      </p>
      {/* Traits */}
      <div className="flex flex-wrap items-center text-gray-600 mb-2 gap-1">
        <strong>Tagi: </strong>
        <div className="flex flex-wrap gap-1 lg:gap-2">
          {(animal.traits.length > 2
            ? animal.traits.slice(0, 2)
            : animal.traits
          ).map((trait) => (
            <span
              key={trait._id}
              className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] text-sm px-2 py-1 rounded-full shadow-lg"
            >
              {trait.text}
            </span>
          ))}
        </div>
        {animal.traits.length > 2 && (
          <button
            className="text-[#d46622] hover:underline cursor-pointer mt-2"
            onClick={showTraits}
          >
            Pokaż więcej
          </button>
        )}
      </div>
      {/* Like Button */}
      {userContext.user?.favourites?.some((fav) => fav._id === animal._id) ? (
        <div className="flex justify-center py-1 lg:py-2">
          <button
            className="flex w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#B12828] text-white rounded-full items-center justify-center text-2xl transition-all duration-300 ease-in-out hover:bg-[#7c1c1c] hover:scale-110 cursor-pointer"
            onClick={() => removeFromFavourite(animal._id)}
            data-testid="remove-from-favourites-button"
          >
            <FaTimes className="w-[40%] h-[40%]" />
          </button>
        </div>
      ) : (
        <div className="flex justify-center py-1 lg:py-2">
          <button
            className="flex w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#4F9C49] text-white rounded-full items-center justify-center text-2xl transition-all duration-300 ease-in-out hover:bg-[#376d33] hover:scale-110 cursor-pointer"
            onClick={() => addToFavourite(animal._id)}
            data-testid="add-to-favourites-button"
          >
            <FaHeart className="w-[40%] h-[40%]" />
          </button>
        </div>
      )}
      {/* Edit and Adopted Buttons */}
      {userContext.user?.shelterId &&
        userContext.user.shelterId === animal.shelter && (
          <div className="mt-4 flex gap-4">
            <button
              className="px-4 py-2 text-lg md:text-xl
                   bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                   transition-all duration-300 transform hover:scale-105 shadow-lg
                   w-full"
              onClick={() => {
                router.push(`/animalCreatorPage?animalId=${animalId}`);
              }}
            >
              Edytuj
            </button>
            <button
              className={`px-4 py-2 text-lg md:text-xl rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg w-full ${
                animal.adopted
                  ? 'bg-[#B12828] hover:bg-[#7c1c1c] text-[#fefaf7]' // Red button for adopted
                  : 'bg-[#4F9C49] hover:bg-[#376d33] text-[#fefaf7]' // Green button for not adopted
              }`}
              onClick={() => {
                handleAdoption(animalId);
                alert(
                  animal.adopted
                    ? 'Zwierzę zostało oznaczone jako niezaadoptowane!'
                    : 'Zwierzę zostało oznaczone jako zaadoptowane!'
                );
              }}
            >
              Adopcja
            </button>
          </div>
        )}
      {/* Model Section */}
      {/* Description Card */}
      {isDescriptionVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out opacity-100">
          <div className="relative w-[90%] max-w-lg bg-white p-6 rounded-3xl shadow-2xl transform transition-transform duration-300 ease-in-out scale-100">
            <button
              className="absolute top-2 right-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={hideDescription}
            >
              ✕
            </button>
            <p className="text-gray-600">{animal.description}</p>
          </div>
        </div>
      )}
      {/* Traits Card */}
      {isTraitsVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out opacity-100">
          <div className="relative w-[90%] max-w-lg bg-white p-6 rounded-3xl shadow-2xl transform transition-transform duration-300 ease-in-out scale-100">
            <button
              className="absolute top-2 right-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] w-8 h-8 flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={hideTraits}
            >
              ✕
            </button>
            <div className="flex flex-wrap gap-2 mb-4">
              {animal.traits.map((trait) => (
                <span
                  key={trait._id}
                  className="bg-[#fefaf7] text-[#CE8455] border border-[#CE8455] text-sm px-3 py-1 rounded-full shadow-lg"
                >
                  {trait.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Image Modal */}
      {isImageModalVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out"
          data-testid="image-modal"
        >
          <div className="relative w-[90%] max-w-4xl bg-white p-6 rounded-3xl shadow-2xl">
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] flex items-center justify-center rounded-full shadow-md cursor-pointer"
              onClick={hideImageModal}
            >
              ✕
            </button>
            {animal.images[currentImageIndex]?.preview ? (
              <Image
                src={animal.images[currentImageIndex].preview}
                alt={`modal-${animal.name}`}
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg">
                Brak zdjęcia
              </div>
            )}
            {/* Navigation Buttons - Show only if more than one image */}
            {animal.images.length > 1 && (
              <>
                <button
                  data-testid="prev-button"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] p-1.5 pl-1 rounded-full shadow-lg items-center justify-center cursor-pointer"
                  onClick={handlePreviousImage}
                >
                  <BiLeftArrow className="h-4 w-4" />
                </button>
                <button
                  data-testid="next-button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] p-1.5 pr-1 rounded-full shadow-lg items-center justify-center cursor-pointer"
                  onClick={handleNextImage}
                >
                  <BiRightArrow className="h-4 w-4" />
                </button>
              </>
            )}
            {/* Image Counter - Show only if more than one image */}
            {animal.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#CE8455] text-[#fefaf7] text-sm px-3 py-1 rounded-full shadow-lg items-center justify-center">
                {currentImageIndex + 1}/{animal.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalCard;
