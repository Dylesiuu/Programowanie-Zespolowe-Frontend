import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import MapComponent from '../components/mapComponent';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
}));

const MockLocationMarker = ({ setPosition }) => {
  React.useEffect(() => {
    setPosition({ lat: 52.52, lng: 13.405 });
  }, [setPosition]);
  return null;
};

jest.mock('../components/locationMarker', () => MockLocationMarker);

describe('MapComponent', () => {
  let mockOnLocationSelect;
  let mockSetLocationName;

  beforeEach(() => {
    mockOnLocationSelect = jest.fn();
    mockSetLocationName = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [
              {
                geometry: { lat: 50, lng: 20 },
                formatted: 'Kraków, Polska',
              },
            ],
          }),
      })
    );
  });

  test('renders and shows buttons', () => {
    render(
      <MapComponent
        onLocationSelect={mockOnLocationSelect}
        onCancel={() => {}}
        setLocationName={mockSetLocationName}
      />
    );

    expect(screen.getByRole('button', { name: /zapisz lokalizację/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anuluj/i })).toBeInTheDocument();
  });

  test('calls onLocationSelect with position and location name', async () => {
    render(
      <MapComponent
        onLocationSelect={mockOnLocationSelect}
        onCancel={() => {}}
        setLocationName={mockSetLocationName}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /zapisz lokalizację/i }));
    });

    expect(mockOnLocationSelect).toHaveBeenCalledWith(
      { lat: 52.52, lng: 13.405 },
      expect.any(String) // location name
    );
  });

  test('searches for a location and sets position', async () => {
    render(
      <MapComponent
        onLocationSelect={mockOnLocationSelect}
        onCancel={() => {}}
        setLocationName={mockSetLocationName}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/wpisz lokalizację/i), {
      target: { value: 'Warszawa' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/szukaj/i));
    });

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('Warszawa'));
  });
});
