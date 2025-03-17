/*

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwipePage from '../swipePage'; 
import Buttons from '../../src/swiping/components/buttons';

//Mock the components used in SwipePage
jest.mock('../../src/swiping/components/animalCard', () => jest.fn(() => <div>AnimalCard Mock</div>));
jest.mock('../../src/swiping/components/buttons', () => jest.fn(() => <div>Buttons Mock</div>));
jest.mock('../../src/localization/components/locationBar', () =>
  jest.fn(({ onLocationChange, onRangeChange }) => (
    <div>
      LocationBar Mock
      <button onClick={() => onLocationChange({ lat: 52.52, lng: 13.405 })}>Set Location</button>
      <button onClick={() => onRangeChange(50)}>Set Range</button>
    </div>
  ))
);

//Mock the dynamic import for MapComponent
jest.mock('../../src/localization/components/mapComponent', () => jest.fn(() => <div>MapComponent Mock</div>));

//Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, name: 'Mike', image: ['image1.jpg'], age: '3 years old', gender: 'Male', location: 'Gdańsk', traits: ['Friendly'], shelter: 'Happy Tails Shelter' }]),
  })
);

describe('SwipePage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders SwipePage', () => {
    render(<SwipePage />);

    //LocationBar is rendered
    expect(screen.getByText('LocationBar Mock')).toBeInTheDocument();

    //loading state is not shown initially
    expect(screen.queryByText('Ładowanie zwierzaczków...')).not.toBeInTheDocument();
  });

//   test('fetches pets when location is set', async () => {
//     render(<SwipePage />);

//     fireEvent.click(screen.getByText('Set Location'));

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/scrolling'), {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ lat: 52.52, lng: 13.405, range: 30 }),
//       });
//     });

//     expect(screen.getByText('AnimalCard Mock')).toBeInTheDocument();
//   });

  test('displays loading state while fetching pets', async () => {
    render(<SwipePage />);

    fireEvent.click(screen.getByText('Set Location'));

    expect(screen.getByText('Ładowanie zwierzaczków...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Ładowanie zwierzaczków...')).not.toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

    render(<SwipePage />);

    fireEvent.click(screen.getByText('Set Location'));

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch animals. Please try again.')).toBeInTheDocument();
    });
  });

  test('handles swipe actions correctly', async () => {
    
  });

  test('handles keyboard swipe actions', async () => {
    render(<SwipePage />);

    fireEvent.click(screen.getByText('Set Location'));

    await waitFor(() => {
      expect(screen.getByText('AnimalCard Mock')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'ArrowRight' });

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
  });

  test('displays end message when no more pets are available', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<SwipePage />);

    fireEvent.click(screen.getByText('Set Location'));

    await waitFor(() => {
      expect(screen.getByText('Koniec piesków i kotków :c')).toBeInTheDocument();
    });
  });
});

*/