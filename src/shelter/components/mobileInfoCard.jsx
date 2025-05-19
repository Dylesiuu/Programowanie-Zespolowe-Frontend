import React, { useEffect } from 'react';
import { BiMenu } from 'react-icons/bi';

const MobileInfoCard = ({ shelter, onEdit, toggleCard, userContext }) => {
  const [locationName, setLocationName] = React.useState('');

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

  return (
    <div className="fixed flex flex-col inset-y-0 left-0 z-50 w-[80vw] mt-[3.75rem] bg-[#fefaf7]/80 shadow-2xl p-4 space-y-6 rounded-r-3xl justify-between items-center">
      {/* Close Button */}
      <button
        className="absolute top-1 -right-4 px-2 py-2 bg-[#CE8455] hover:bg-[#AA673C] text-[#fefaf7] rounded-full shadow-md z-10"
        onClick={toggleCard}
        data-testid="close-button"
      >
        <BiMenu className="text-md" data-testid="bi-menu-icon" />
      </button>

      {/* Shelter info */}
      <div className="flex flex-col w-full p-6 bg-white shadow-2xl rounded-3xl items-center justify-around">
        <h2
          data-testid="mobile-shelter-name"
          className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-6 md:mb-8"
        >
          {shelter.name}
        </h2>
        <div className="flex flex-col w-full space-y-4 px-2 md:px-4 overflow-x-auto">
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
              data-testid="mobile-edit-button"
            >
              Edytuj
            </button>
          )}
      </div>
    </div>
  );
};

export default MobileInfoCard;
