import React from 'react';
import { findByTestId, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ShelterProfile from '../components/shelterProfile';
import { UserContext } from '@/context/userContext';

jest.mock('../components/animalCard', () => {
  return function MockAnimalCard({ animalId, onEdit, addToFavourite }) {
    return (
      <div data-testid="mock-animal-card">
        Mock Animal Card for {animalId}
        <p>Typ: Kot</p>
        <p>Ciekawski i czuły kot rasy tabby.</p>
        <p>Samica</p>
        <button onClick={onEdit}>Edytuj</button>
        <button onClick={addToFavourite} data-testid="add-to-favourites-button">
          Add to Favourites
        </button>
      </div>
    );
  };
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

describe('ShelterProfile Component', () => {
  const mockShelter = {
    _id: '1',
    name: 'Happy Paws Shelter',
    location: '123 Main Street, Springfield',
    phone: '+1 555-123-4567',
    email: 'contact@happypaws.com',
    animals: [
      {
        _id: '1',
        name: 'Buddy',
        age: 3,
        description: 'Test description',
        gender: 'Samiec',
        type: 'Pies',
        traits: ['Friendly'],
        images: ['/image.jpg'],
      },
    ],
  };
  const setUserMock = jest.fn();

  const mockUserContext = {
    token: 'mockToken',
    user: {
      shelterId: '1',
      email: 'test@example.com',
      favourites: [],
    },
    isLoggedIn: jest.fn(),
    setUser: setUserMock,
  };

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/shelter/find-by-id')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ shelter: mockShelter }),
        });
      }

      if (url.includes(`/user/addfavourite/${mockUserContext.user.email}`)) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              statusCode: 200,
              user: {
                email: 'test@example.com',
                favourites: ['123'],
              },
            }),
        });
      }

      return Promise.reject(new Error('Unexpected URL'));
    });
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} />
      </UserContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shelter profile with animals', async () => {
    const desktopName = await screen.findByTestId('desktop-shelter-name');
    expect(desktopName).toHaveTextContent('Happy Paws Shelter');

    const toggleButton = await screen.findByTestId('bi-menu-icon');
    await userEvent.click(toggleButton);
    const mobileName = await screen.findByTestId('mobile-shelter-name');
    expect(mobileName).toHaveTextContent('Happy Paws Shelter');

    expect(await screen.findByText('Buddy')).toBeInTheDocument();
  });

  it('opens the animal modal when an animal card is clicked', async () => {
    const buddyElement = await screen.findByText('Buddy');
    await userEvent.click(buddyElement);

    expect(await screen.findByTestId('mock-animal-card')).toBeInTheDocument();
    expect(
      await screen.findByText('Mock Animal Card for 1')
    ).toBeInTheDocument();
  });

  it('closes the animal modal when the close button is clicked', async () => {
    const buddyElement = await screen.findByText('Buddy');
    await userEvent.click(buddyElement);

    const closeButton = await screen.findByText('✕');
    await userEvent.click(closeButton);

    await waitFor(
      () => {
        expect(
          screen.queryByTestId('mock-animal-card')
        ).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('displays the correct animal details in the modal', async () => {
    const buddyElements = await screen.findAllByText('Buddy');
    const buddyCard = buddyElements[0];
    await userEvent.click(buddyCard);

    expect(await screen.findByText('Typ: Kot')).toBeInTheDocument();
    expect(
      await screen.findByText('Ciekawski i czuły kot rasy tabby.')
    ).toBeInTheDocument();
    expect(await screen.findByText('Samica')).toBeInTheDocument();
  });

  it('displays shelter information in InfoCard on desktop', async () => {
    const editButton = await screen.findByTestId('infoCard-edit-button');
    const infoCard = editButton.closest('div[class*="flex flex-col"]');
    expect(infoCard).toBeInTheDocument();
    expect(infoCard).toHaveTextContent(mockShelter.name);
    expect(infoCard).toHaveTextContent(`Location: ${mockShelter.location}`);
    expect(infoCard).toHaveTextContent(`Phone: ${mockShelter.phone}`);
    expect(infoCard).toHaveTextContent(`Email: ${mockShelter.email}`);
  });

  it('calls onEdit when Edit Info button is clicked in InfoCard', async () => {
    window.alert = jest.fn();
    const editButton = await screen.findByTestId('infoCard-edit-button');
    await userEvent.click(editButton);
    expect(window.alert).toHaveBeenCalledWith('Edit button clicked!');
  });

  it('toggles MobileInfoCard visibility when menu button is clicked', async () => {
    const closeButton = await screen.findByTestId('close-button');

    const mobileCardContainer = closeButton.closest(
      'div[class*="fixed inset-0"]'
    );

    expect(mobileCardContainer).toHaveClass('-translate-x-[75%]');
    expect(mobileCardContainer).not.toHaveClass('translate-x-0');

    const toggleButton = screen.getByTestId('close-button');
    await userEvent.click(toggleButton);
    await waitFor(() => {
      expect(mobileCardContainer).toHaveClass('translate-x-0');
      expect(mobileCardContainer).not.toHaveClass('-translate-x-[75%]');
    });

    await userEvent.click(toggleButton);

    await waitFor(() => {
      expect(mobileCardContainer).toHaveClass('-translate-x-[75%]');
      expect(mobileCardContainer).not.toHaveClass('translate-x-0');
    });
  });

  it('displays shelter information in MobileInfoCard', async () => {
    const closeButton = await screen.findByTestId('close-button');

    const mobileCard = closeButton.closest('div[class*="fixed flex"]');

    expect(mobileCard).toHaveTextContent(mockShelter.name);
    expect(mobileCard).toHaveTextContent(`Location: ${mockShelter.location}`);
    expect(mobileCard).toHaveTextContent(`Phone: ${mockShelter.phone}`);
    expect(mobileCard).toHaveTextContent(`Email: ${mockShelter.email}`);
  });

  it('calls onEdit when Edit Info button is clicked in MobileInfoCard', async () => {
    window.alert = jest.fn();
    const editButtons = await screen.findAllByText('Edit Info');
    await userEvent.click(editButtons[0]);
    expect(window.alert).toHaveBeenCalledWith('Edit button clicked!');
  });

  it('shows backdrop blur when MobileInfoCard is visible', async () => {
    const backdrop = await screen.findByTestId('mobile-backdrop');
    expect(backdrop).not.toHaveClass('backdrop-blur-md');

    await userEvent.click(screen.getByTestId('close-button'));

    await waitFor(() => {
      expect(backdrop).toHaveClass('backdrop-blur-md');
      expect(backdrop).toHaveClass('opacity-100');
    });

    await userEvent.click(screen.getByTestId('close-button'));

    await waitFor(() => {
      expect(backdrop).not.toHaveClass('backdrop-blur-md');
      expect(backdrop).toHaveClass('opacity-0');
    });
  });

  it('calls addToFavourite and updates userContext on success', async () => {
    const animalCard = await screen.findByTestId('animal-card');
    await userEvent.click(animalCard);

    const addToFavouritesButton = await screen.findByTestId(
      'add-to-favourites-button'
    );
    await userEvent.click(addToFavouritesButton);

    await waitFor(() =>
      expect(setUserMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        favourites: ['123'],
      })
    );
  });
});
