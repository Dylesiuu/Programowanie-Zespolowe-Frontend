import React, { useState } from "react";
import styles from "../locationBar.module.css"; 
import MapComponent from './mapComponent';

const LocationBar = ({ defaultLocation, onLocationChange, onRangeChange }) => {
  const [range, setRange] = useState(30);
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState(defaultLocation);

  const handleLocationClick = () => {
    setShowMap(true);
  };

  const handleLocationSelect = (position, locationName ) => {
    onLocationChange(position);
    setLocationName(locationName);
    setShowMap(false);
  };

  const handleRangeChange = (event) => {
    setRange(event.target.value);
    if (onRangeChange) onRangeChange(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.locationWrapper}>
      
      <input
        type="text"
        value={locationName}
        onClick={handleLocationClick}
        readOnly
      />
      {/* Render the map component if showMap is true */}
      {showMap && <MapComponent onLocationSelect={handleLocationSelect} setLocationName={setLocationName}/>}
      </div>

      <select value={range} onChange={handleRangeChange} className={styles.select}>
        <option value={10}>+10 km</option>
        <option value={30}>+30 km</option>
        <option value={50}>+50 km</option>
        <option value={100}>+100 km</option>
        <option value={250}>+250 km</option>
        <option value={500}>+500 km</option>
      </select>
    </div>
  );
};

export default LocationBar;
