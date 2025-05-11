import React from 'react';
import { render } from '@testing-library/react';
import LocationMarker from '../components/locationMarker';
import { useMapEvents } from 'react-leaflet';

jest.mock('react-leaflet', () => ({
  useMapEvents: jest.fn(),
  useMap: () => ({
    flyTo: jest.fn(),
    getZoom: () => 13,
  }),
}));

describe('LocationMarker', () => {
  let mockSetPosition, mockReverseGeocode;

  beforeEach(() => {
    mockSetPosition = jest.fn();
    mockReverseGeocode = jest.fn();

    useMapEvents.mockImplementation((handlers) => {
      const fakeEvent = { latlng: { lat: 52.52, lng: 13.405 } };
      handlers.click(fakeEvent);
      return {};
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
    expect(mockReverseGeocode).toHaveBeenCalledWith({
      lat: 52.52,
      lng: 13.405,
    });
  });
});
