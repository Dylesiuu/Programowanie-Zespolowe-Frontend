import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationMarker from '../components/locationMarker'; 

jest.mock('react-leaflet', () => ({
    useMapEvents: jest.fn(),
  }));

describe('LocationMarker', () => {
  let mockSetPosition, mockReverseGeocode;

  beforeEach(() => {
    mockSetPosition = jest.fn();
    mockReverseGeocode = jest.fn();

    //Mocking useMapEvents to simulate the map click
    require('react-leaflet').useMapEvents.mockImplementation((eventHandlers) => {
      //Store the click handler
      if (eventHandlers.click) {
        const fakeEvent = { latlng: { lat: 52.52, lng: 13.405 } };
        eventHandlers.click(fakeEvent);
      }
      return { click: jest.fn() };
    });
  });

  test('calls setPosition and reverseGeocode when map is clicked', () => {
    render(
      <LocationMarker
        position={null}
        setPosition={mockSetPosition}
        reverseGeocode={mockReverseGeocode}
      />
    );

    //After click setPosition and reverseGeocode should be called
    expect(mockSetPosition).toHaveBeenCalledWith({ lat: 52.52, lng: 13.405 });
    expect(mockReverseGeocode).toHaveBeenCalledWith({ lat: 52.52, lng: 13.405 });
  });
});