import React from 'react';
import { render, screen } from '@testing-library/react';
import ShelterSearchBar from '../components/shelterSearchbar';
import userEvent from '@testing-library/user-event';

jest.mock('next/dynamic', () => () => {
  const MockedComponent = ({ onLocationSelect }) => {
    return (
      <div>
        Mocked MapComponent
        <button
          onClick={() =>
            onLocationSelect({ lat: 50.06143, lng: 19.93658 }, 'Kraków')
          }
        >
          Select Location
        </button>
      </div>
    );
  };
  MockedComponent.displayName = 'MockedMapComponent';
  return MockedComponent;
});

describe('ShelterSearchBar', () => {
  beforeEach(() => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              ok: true,
              json: () =>
                Promise.resolve([
                  { id: 1, name: 'Schronisko A' },
                  { id: 2, name: 'Schronisko B' },
                  { id: 3, name: 'Schronisko C' },
                ]),
            });
          }, 1000)
        )
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input field and range selector', () => {
    render(<ShelterSearchBar userContext={{ user: { token: 'mockToken' } }} />);

    const inputField = screen.getByPlaceholderText(
      'Kliknij, aby wybrać lokalizację'
    );
    expect(inputField).toBeInTheDocument();

    const rangeSelector = screen.getByRole('combobox');
    expect(rangeSelector).toBeInTheDocument();
  });

  it('should display "Wyszukiwanie..." while waiting for a response and should set locations', async () => {
    render(<ShelterSearchBar userContext={{ user: { token: 'mockToken' } }} />);

    const inputField = screen.getByPlaceholderText(
      'Kliknij, aby wybrać lokalizację'
    );
    await userEvent.click(inputField);

    const mapComponent = await screen.findByText('Mocked MapComponent');
    expect(mapComponent).toBeInTheDocument();

    const selectLocationButton = await screen.findByText('Select Location');
    await userEvent.click(selectLocationButton);

    await expect(screen.getByTestId('dropdown')).toBeInTheDocument();

    expect(await screen.findByText('Wyszukiwanie...')).toBeInTheDocument();

    expect(screen.getByDisplayValue('Kraków')).toBeInTheDocument();
  });

  it('displays results in the dropdown after loading', async () => {
    render(<ShelterSearchBar userContext={{ user: { token: 'mockToken' } }} />);

    const inputField = screen.getByPlaceholderText(
      'Kliknij, aby wybrać lokalizację'
    );
    await userEvent.click(inputField);

    const selectLocationButton = await screen.findByText('Select Location');
    await userEvent.click(selectLocationButton);

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();

    expect(await screen.findByText('Schronisko A')).toBeInTheDocument();
    expect(await screen.findByText('Schronisko B')).toBeInTheDocument();
    expect(await screen.findByText('Schronisko C')).toBeInTheDocument();
  });

  it('displays "Brak wyników" when no results are found', async () => {
    render(<ShelterSearchBar userContext={{ user: { token: 'mockToken' } }} />);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    const inputField = screen.getByPlaceholderText(
      'Kliknij, aby wybrać lokalizację'
    );
    await userEvent.click(inputField);

    const selectLocationButton = await screen.findByText('Select Location');
    await userEvent.click(selectLocationButton);

    expect(await screen.findByText('Brak wyników')).toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', async () => {
    render(<ShelterSearchBar userContext={{ user: { token: 'mockToken' } }} />);

    const inputField = screen.getByPlaceholderText(
      'Kliknij, aby wybrać lokalizację'
    );
    await userEvent.click(inputField);

    const selectLocationButton = await screen.findByText('Select Location');
    await userEvent.click(selectLocationButton);

    await expect(screen.getByTestId('dropdown')).toBeInTheDocument();

    expect(await screen.findByText('Wyszukiwanie...')).toBeInTheDocument();

    await userEvent.click(document.body);

    await expect(screen.queryByText('Wyszukiwanie...')).not.toBeInTheDocument();
  });

  it('handles selecting a result from the dropdown', async () => {
    render(<ShelterSearchBar userContext={{ user: { token: 'mockToken' } }} />);

    window.alert = jest.fn();

    const inputField = screen.getByPlaceholderText(
      'Kliknij, aby wybrać lokalizację'
    );
    await userEvent.click(inputField);

    await userEvent.click(await screen.findByText('Select Location'));

    expect(screen.getByTestId('dropdown')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Schronisko A'));

    expect(window.alert).toHaveBeenCalledWith('Schronisko A');
  });
});
