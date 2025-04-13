import React from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

const LocationMarker = ({ position, setPosition, reverseGeocode }) => {
  useMapEvents({
    click(event) {
      setPosition(event.latlng);
      reverseGeocode(event.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
};

export default LocationMarker;
