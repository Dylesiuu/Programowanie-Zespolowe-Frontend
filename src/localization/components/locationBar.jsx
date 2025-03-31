import React, { useState } from "react";
import styles from "../locationBar.module.css"; 
import MapComponent from './mapComponent';

const LocationBar = ({ defaultLocation, onLocationChange, onRangeChange }) => {
  const [range, setRange] = useState(30000);
  const [showMap, setShowMap] = useState(false);
  const [locationName, setLocationName] = useState(defaultLocation);

  const handleLocationClick = () => {
    setShowMap(true);
  };

  const handleLocationSelect = (position, locationName) => {
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
      {showMap && <MapComponent onLocationSelect={handleLocationSelect} setLocationName={setLocationName}/>}
      </div>

      <select value={range} onChange={handleRangeChange} className={styles.select}>
        <option value={10000}>+10 km</option>
        <option value={30000}>+30 km</option>
        <option value={50000}>+50 km</option>
        <option value={100000}>+100 km</option>
        <option value={250000}>+250 km</option>
        <option value={500000}>+500 km</option>
      </select>
    </div>
  );
};

export default LocationBar;
