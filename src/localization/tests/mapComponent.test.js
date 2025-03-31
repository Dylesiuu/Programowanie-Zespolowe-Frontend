import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react'; 
import MapComponent from '../components/mapComponent';

jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(({ children }) => <div>{children}</div>),
  TileLayer: jest.fn(() => null),
  Marker: jest.fn(() => null),
}));

const mockLocationMarker = ({ setPosition }) => {
  React.useEffect(() => {
    setPosition({ lat: 52.52, lng: 13.405 });
  }, [setPosition]);

  return null;
};

jest.mock('../components/locationMarker', () => mockLocationMarker);

describe('MapComponent Component', () => {
  let mockOnLocationSelect;
  let mockSetLocationName;

  beforeEach(() => {
    mockOnLocationSelect = jest.fn();
    mockSetLocationName = jest.fn();
  });

  test('renders map component', () => {
    render(<MapComponent onLocationSelect={mockOnLocationSelect} />);

    expect(screen.getByRole('button', { name: /save location/i })).toBeInTheDocument();
  });

  test('calls onLocationSelect when save button is clicked and position is set', () => {
    render(
      <MapComponent
        onLocationSelect={mockOnLocationSelect}
        setLocationName={mockSetLocationName}
      />
    );

    const saveButton = screen.getByText('Save Location');
    act(() => {
      fireEvent.click(saveButton);
    });

    expect(mockOnLocationSelect).toHaveBeenCalledWith(
      { lat: 52.52, lng: 13.405 },
      ''
    );
  });
});