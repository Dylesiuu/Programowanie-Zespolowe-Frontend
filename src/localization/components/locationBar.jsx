import React, { useState } from 'react';
import MapComponent from './mapComponent';

const LocationBar = ({ defaultLocation, onLocationChange, onRangeChange }) => {
  const [range, setRange] = useState(30000);
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState(defaultLocation);
  const [prevLocation, setPrevLocation] = useState(defaultLocation);

  const handleLocationClick = () => {
    setPrevLocation(locationName);
    setShowMap(true);
  };

  const handleLocationSelect = (position, locationName) => {
    onLocationChange(position);
    setLocationName(locationName);
    setShowMap(false);
  };

  const handleMapCancel = () => {
    setLocationName(prevLocation);
    setShowMap(false);
  };

  const handleRangeChange = (event) => {
    setRange(event.target.value);
    if (onRangeChange) onRangeChange(event.target.value);
  };

  return (
    <div className="flex gap-4 items-center mb-5">
      <div
        onClick={handleLocationClick}
        className="border border-gray-300 rounded px-3 py-2 min-w-[150px] cursor-pointer"
      >
        <input
          type="text"
          value={locationName}
          readOnly
          className="w-full text-sm text-gray-700 bg-transparent cursor-pointer outline-none"
        />
      </div>

      <select
        value={range}
        onChange={handleRangeChange}
        className="px-3 py-2 border border-gray-300 rounded text-sm"
      >
        <option value={10000}>+10 km</option>
        <option value={30000}>+30 km</option>
        <option value={50000}>+50 km</option>
        <option value={100000}>+100 km</option>
        <option value={250000}>+250 km</option>
        <option value={500000}>+500 km</option>
      </select>

      {showMap && (
        <MapComponent
          onLocationSelect={handleLocationSelect}
          onCancel={handleMapCancel}
          setLocationName={setLocationName}
        />
      )}
    </div>
  );
};

export default LocationBar;
