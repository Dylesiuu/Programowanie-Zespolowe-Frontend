import React, { useEffect } from 'react';
import { Marker, useMapEvents, useMap } from 'react-leaflet';

const LocationMarker = ({ position, setPosition, reverseGeocode }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom()); 
    }
  }, [position, map]);
  
  useMapEvents({
    click(event) {
      setPosition(event.latlng);
      reverseGeocode(event.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
};

export default LocationMarker;
