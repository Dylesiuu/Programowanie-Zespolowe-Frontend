import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import styles from '../mapComponent.module.css';
import axios from 'axios';

//Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const LocationMarker = dynamic(() => import('./locationMarker'), { ssr: false });

const MapComponent = ({ onLocationSelect, setLocationName }) => {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationNameState] = useState('');

  //Fix for Leaflet's default icon issue
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);

  const reverseGeocode = async (latlng) => {
    const { lat, lng } = latlng;
    const apiKey = process.env.NEXT_PUBLIC_MAP_TRANSLATE; //OpenCage API key
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
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
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
          <LocationMarker position={position} setPosition={setPosition} reverseGeocode={reverseGeocode} />
        </MapContainer>
      </div>
      <button className={styles.saveButton} onClick={handleSaveLocation}>Save Location</button>
    </div>
  );
};

export default MapComponent;