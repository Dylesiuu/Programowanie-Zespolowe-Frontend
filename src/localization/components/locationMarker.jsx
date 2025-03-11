import React from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

const LocationMarker = ({ position, setPosition, reverseGeocode }) => {
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

export default LocationMarker;