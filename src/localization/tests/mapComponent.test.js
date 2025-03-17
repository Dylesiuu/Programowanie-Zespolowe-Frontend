import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react'; // Import act
import '@testing-library/jest-dom';
import MapComponent from '../components/mapComponent';

//Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(({ children }) => <div>{children}</div>),
  TileLayer: jest.fn(() => null),
  Marker: jest.fn(() => null),
}));

//Mock the LocationMarker component
const mockLocationMarker = ({ setPosition }) => {
  //Simulate setting a position when the component is rendered
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

    //Map container is rendered
    expect(screen.getByRole('button', { name: /save location/i })).toBeInTheDocument();
  });

  test('calls onLocationSelect when save button is clicked and position is set', () => {
    render(
      <MapComponent
        onLocationSelect={mockOnLocationSelect}
        setLocationName={mockSetLocationName}
      />
    );

    //Simulate clicking the save button
    const saveButton = screen.getByText('Save Location');
    act(() => {
      fireEvent.click(saveButton);
    });

    //Check if onLocationSelect was called with the correct position and location name
    expect(mockOnLocationSelect).toHaveBeenCalledWith(
      { lat: 52.52, lng: 13.405 },
      ''
    );
  });
});