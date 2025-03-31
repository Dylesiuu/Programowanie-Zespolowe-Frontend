import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationMarker from '../components/locationMarker'; 
import { useMapEvents } from 'react-leaflet';

jest.mock('react-leaflet', () => ({
    useMapEvents: jest.fn(),
  }));

describe('LocationMarker', () => {
  let mockSetPosition, mockReverseGeocode;

  beforeEach(() => {
    mockSetPosition = jest.fn();
    mockReverseGeocode = jest.fn();

    useMapEvents.mockImplementation((eventHandlers) => {
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

    expect(mockSetPosition).toHaveBeenCalledWith({ lat: 52.52, lng: 13.405 });
    expect(mockReverseGeocode).toHaveBeenCalledWith({ lat: 52.52, lng: 13.405 });
  });
});