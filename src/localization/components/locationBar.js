import React, { useState } from "react";
import styles from "../locationBar.module.css"; 

const LocationBar = ({ defaultLocation, onLocationChange, onRangeChange }) => {
  const [location, setLocation] = useState(defaultLocation);
  const [range, setRange] = useState(30);
  const [isEditing, setIsEditing] = useState(false);

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
    if (onLocationChange) onLocationChange(e.target.value);
  };

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    if (onRangeChange) onRangeChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      {/* Lokalizacja */}
      <div className={styles.locationWrapper}>
        {isEditing ? (
          <input
            type="text"
            value={location}
            onChange={handleLocationInput}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className={styles.input}
            placeholder="Podaj lokalizację"
          />
        ) : (
          <span className={styles.locationText} onClick={() => setIsEditing(true)}>
            {location}
          </span>
        )}
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
