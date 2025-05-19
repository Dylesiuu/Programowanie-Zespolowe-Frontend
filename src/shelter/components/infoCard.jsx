import React, { useEffect } from 'react';
import { reverseCoordinates } from '@/lib/reverseCoordinates';

const InfoCard = ({ shelter, onEdit, userContext }) => {
  const [locationName, setLocationName] = React.useState('');
  useEffect(() => {
    const fetchLocationName = async () => {
      const city = await reverseCoordinates({
        lat: shelter.location[0],
        lng: shelter.location[1],
      });
      if (city) {
        setLocationName(city);
      } else {
        console.error('Reverse geocode error:', error);
      }
    };

    fetchLocationName();
  }, [shelter.location]);

  return (
    <div className="flex flex-col w-full h-full rounded-3xl shadow-2xl p-4 bg-[#fefaf7]/80 max-w-md md:max-w-lg lg:max-w-xl mx-auto space-y-6 justify-between items-center">
      {/* Shelter info */}
      <div className="flex flex-col w-full p-6 bg-white shadow-2xl rounded-3xl items-center justify-around">
        <h2
          data-testid="desktop-shelter-name"
          className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-6 md:mb-8"
        >
          {shelter.name}
        </h2>
        <div className="flex flex-col w-full space-y-4 px-2 md:px-4">
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Adres:</strong> {locationName}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Telefon:</strong> {shelter.phone}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Email:</strong> {shelter.email}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>Strona:</strong>{' '}
            <a
              href={shelter.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d46622] hover:underline"
            >
              {shelter.link}
            </a>
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600">
            <strong>O schronisku:</strong> {shelter.shortNote}
          </p>
        </div>
      </div>
      {/* Buttons */}
      <div className="w-full flex justify-center">
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
      </div>
    </div>
  );
};

export default InfoCard;
