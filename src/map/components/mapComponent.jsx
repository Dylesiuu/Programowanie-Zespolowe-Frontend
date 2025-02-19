import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../mapComponent.module.css';
import axios from 'axios';

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ onLocationSelect, setLocationName }) => {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationNameState] = useState('');

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        reverseGeocode(e.latlng);
      },
    });

    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  const reverseGeocode = async (latlng) => {
    const { lat, lng } = latlng;
    const apiKey = 'd79af32da41f4f25ad806ef3e3ef1948'; // OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];
      const components = result.components;
      const city = components.city || components.town || components.village || components.hamlet;
      setLocationName(city);
      setLocationNameState(city);
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const handleSaveLocation = () => {
    if (position) {
      onLocationSelect(position, locationName);
    }
  };

  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapContainer}>
        <MapContainer center={[52.24, 21.01]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
      <button className={styles.saveButton} onClick={handleSaveLocation}>Save Location</button>
    </div>
  );
};

export default MapComponent;