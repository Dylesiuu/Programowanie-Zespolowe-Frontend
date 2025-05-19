'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { reverseCoordinates } from '@/lib/reverseCoordinates';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const LocationMarker = dynamic(() => import('./locationMarker'), {
  ssr: false,
});

const MapComponent = ({ onLocationSelect, onCancel, setLocationName }) => {
  const [position, setPosition] = useState(null);
  const [locationName, setLocationNameState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  const reverseGeocode = async (latlng) => {
    const city = await reverseCoordinates(latlng);
    if (city) {
      setLocationName(city);
      setLocationNameState(city);
    } else {
      console.error('Reverse geocode error:', error);
    }

    // const { lat, lng } = latlng;
    // const apiKey = process.env.NEXT_PUBLIC_MAP_TRANSLATE;
    // const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    // try {
    //   const response = await fetch(url);
    //   const data = await response.json();
    //   const result = data.results[0];
    //   const components = result.components;
    //   const city =
    //     components.city ||
    //     components.town ||
    //     components.village ||
    //     components.hamlet;

    //   setLocationName(city);
    //   setLocationNameState(city);
    // } catch (error) {
    //   console.error('Reverse geocode error:', error);
    // }
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;

    const apiKey = process.env.NEXT_PUBLIC_MAP_TRANSLATE;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      searchQuery
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const result = data.results[0];

      if (result) {
        const { lat, lng } = result.geometry;
        const newLatLng = { lat, lng };
        setPosition(newLatLng);
        const name = result.formatted;
        setLocationName(name);
        setLocationNameState(name);

        if (mapRef.current) {
          mapRef.current.setView(newLatLng, 13);
        }
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-transparent flex justify-center items-center px-4">
      <div className="relative bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col shadow-xl overflow-hidden">
        <div className="p-4 flex gap-2 items-center bg-white z-10">
          <input
            type="text"
            placeholder="Wpisz lokalizację..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleSearchLocation}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
          >
            Szukaj
          </button>
        </div>

        <div className="flex-grow">
          <MapContainer
            center={[52.24, 21.01]}
            zoom={10}
            className="w-full h-full"
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker
              position={position}
              setPosition={setPosition}
              reverseGeocode={reverseGeocode}
            />
          </MapContainer>
        </div>

        <div className="p-4 flex justify-between gap-4 bg-white z-10">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded text-sm"
          >
            Anuluj
          </button>
          <button
            onClick={() => {
              if (position) onLocationSelect(position, locationName);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
          >
            Zapisz lokalizację
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
