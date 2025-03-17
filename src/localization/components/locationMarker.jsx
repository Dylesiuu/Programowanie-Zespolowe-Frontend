import React from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

const LocationMarker = ({ position, setPosition, reverseGeocode }) => {
  //Handle map click events
  useMapEvents({
    click(event) {
      setPosition(event.latlng);
      reverseGeocode(event.latlng);
    },
  });

  //Render a marker if position is not null
  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

export default LocationMarker;