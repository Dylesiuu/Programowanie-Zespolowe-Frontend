import React, { useState } from "react";
import styles from "../locationBar.module.css"; 
import MapComponent from '../../map/components/mapComponent';

const LocationBar = ({ defaultLocation, onLocationChange, onRangeChange }) => {
  //const [location, setLocation] = useState(defaultLocation);
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

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    if (onRangeChange) onRangeChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Lokalizacja */}
      <div className={styles.locationWrapper}>
      <input
        type="text"
        value={locationName}
        onClick={handleLocationClick}
        readOnly
      />
      {showMap && <MapComponent onLocationSelect={handleLocationSelect} setLocationName={setLocationName}/>}
      </div>

      {/* Dropdown z promieniem */}
      <select value={range} onChange={handleRangeChange} className={styles.select}>
        <option value={10}>+10 km</option>
        <option value={30}>+30 km</option>
        <option value={50}>+50 km</option>
        <option value={100}>+100 km</option>
      </select>
    </div>
  );
};

export default LocationBar;
