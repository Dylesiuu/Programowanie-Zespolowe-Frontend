import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const MapComponent = dynamic(
  () => import('../../localization/components/mapComponent'),
  { ssr: false }
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ShelterSearchBar = ({ userContext }) => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(
    location ? `${location.lat}, ${location.lng}` : ''
  );
  const [isMapOpen, setIsMapOpen] = useState(false);
  const mapRef = useRef(null);
  const [range, setRange] = useState(30000);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const sendLocationData = async (position, range) => {
    try {
      setIsLoading(true);
      setResults([]);
      setIsDropdownOpen(true);
      const response = await fetch(`${API_BASE_URL}/shelter/find-in-range`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          lat: position.lat,
          lng: position.lng,
          range,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data.shelters)) {
        console.log('Received an array:', data);
        setResults(data.shelters);
      } else {
        console.log('Received a non-array response:', data);
        setResults([]);
      }
    } catch (error) {
      console.error('Error sending location data:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (position, locationName) => {
    setLocation(position);
    setLocationName(locationName);
    setIsMapOpen(false);
    sendLocationData(position, range);
  };

  const handleRangeChange = (event) => {
    const newRange = event.target.value;
    setRange(newRange);
    if (location) {
      sendLocationData(location, newRange);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[25rem] items-center">
      <div className="flex gap-2 items-center">
        <div className="flex w-full h-full">
          {/* Input field */}
          <input
            type="text"
            value={locationName}
            readOnly
            placeholder="Kliknij, aby wybrać lokalizację"
            onClick={() => setIsMapOpen(true)}
            className="px-2 py-2 w-full h-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C] cursor-pointer"
          />
          {/* Dropdown for results */}
          {isDropdownOpen && (
            <div
              data-testid="dropdown"
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {isLoading ? (
                <div className="p-2 rounded-lg shadow-lg z-50 bg-[#CE8455] text-white">
                  Wyszukiwanie...
                </div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((result) => (
                    <li
                      key={result.id}
                      className="px-4 py-2 bg-[#CE8455] hover:bg-[#AA673C] cursor-pointer text-white"
                      onClick={() => {
                        router.push(
                          `/shelterProfilePage?shelterId=${result.id}&animal=null`
                        );
                        setIsDropdownOpen(false);
                      }}
                    >
                      {result.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-2 rounded-lg shadow-lg z-50 bg-[#CE8455] text-white">
                  Brak wyników
                </div>
              )}
            </div>
          )}
        </div>

        {/* Range selector */}
        <select
          value={range}
          onChange={handleRangeChange}
          className="px-2 py-2 w-full h-full max-w-[6rem] rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none cursor-pointer"
        >
          <option value={10000}>+10 km</option>
          <option value={30000}>+30 km</option>
          <option value={50000}>+50 km</option>
          <option value={100000}>+100 km</option>
          <option value={250000}>+250 km</option>
          <option value={500000}>+500 km</option>
        </select>
      </div>

      {/* Map modal */}
      {isMapOpen && (
        <div className="absolute top-0 left-0 w-full h-full z-50 bg-white">
          <div ref={mapRef} className="relative w-full h-full">
            {/* Pass the correct callback to MapComponent */}
            <MapComponent
              onLocationSelect={handleLocationSelect}
              setLocationName={setLocationName}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterSearchBar;
