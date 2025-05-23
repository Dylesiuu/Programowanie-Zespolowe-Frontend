import React, { useEffect, useState } from 'react';
import { useAuthFetch } from '@/lib/authFetch';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const InfoCard = ({ shelter, onEdit, userContext }) => {
  const [locationName, setLocationName] = useState('');
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const fetchData = useAuthFetch();
  const router = useRouter();

  const reverseGeocode = async (latlng) => {
    const { lat, lng } = latlng;
    const apiKey = process.env.NEXT_PUBLIC_MAP_TRANSLATE;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const result = data.results[0];

      setLocationName(result.formatted);
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
  };

  useEffect(() => {
    reverseGeocode({ lat: shelter.location[0], lng: shelter.location[1] });
  }, [shelter.location]);

  const showWarning = () => {
    setIsWarningVisible(true);
  };

  const hideWarning = () => {
    setIsWarningVisible(false);
  };

  const removeShelter = async () => {
    try {
      console.log('Removing shelter...');
      const response = await fetchData(`${API_BASE_URL}/shelter/remove`, {
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
      userContext.setUser(data.updatedUser);
      router.push('/swipePage?created=false');
    } catch (error) {
      console.error('Error deleting animal:', error.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-full rounded-3xl shadow-2xl p-4 bg-[#fefaf7]/80 max-w-md md:max-w-lg lg:max-w-xl mx-auto space-y-6 justify-between items-center">
      {/* Shelter info */}
      <div className="flex flex-col w-full p-6 bg-white shadow-2xl rounded-3xl items-center justify-around">
        <h2
          data-testid="desktop-shelter-name"
          className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-6 md:mb-8 text-center"
        >
          {shelter.name}
        </h2>
        <div className="flex flex-col w-full space-y-4 px-2 md:px-4">
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Adres:</strong> {locationName}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Telefon:</strong> {shelter.phoneNumber}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Email:</strong> {shelter.email}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Strona:</strong>{' '}
            {shelter.website ? (
              <a
                href={shelter.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d46622] hover:underline"
              >
                {shelter.website}
              </a>
            ) : (
              <span className="text-gray-400">brak</span>
            )}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>O schronisku:</strong> {shelter.description}
          </p>
        </div>
      </div>
      {/* Buttons */}
      <div className="w-full flex justify-center items-center gap-2">
        {userContext.user?.shelterId &&
          userContext.user.shelterId === shelter._id && (
            <button
              className="mt-4 px-4 py-2 text-sm md:text-lg lg:text-xl
                     bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full
                     transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full max-w-[200px] md:max-w-[240px] lg:max-w-[280px]"
              onClick={onEdit}
              data-testid="infoCard-edit-button"
            >
              Edytuj
            </button>
          )}
        {userContext.user?.shelterId &&
          userContext.user.shelterId === shelter._id && (
            <button
              className="mt-4 px-4 py-2 text-sm md:text-lg lg:text-xl
                      bg-[#B12828] text-white hover:bg-[#7c1c1c] rounded-full
                     transition-all duration-300 transform hover:scale-105 shadow-lg
                     w-full max-w-[200px] md:max-w-[240px] lg:max-w-[280px]"
              onClick={showWarning}
              data-testid="infoCard-delete-button"
            >
              Usuń
            </button>
          )}
      </div>
      {/* Warning Window */}
      {isWarningVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-md">
            <p className="text-gray-800 text-lg mb-4">
              Czy na pewno chcesz usunąć swoje schronisko?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-[#B12828] text-white rounded-lg hover:bg-[#7c1c1c] transition-all cursor-pointer"
                onClick={() => {
                  removeShelter();
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
    </div>
  );
};

export default InfoCard;
