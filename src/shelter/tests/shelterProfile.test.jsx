import React from 'react';
import * as ReactModule from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ShelterProfile from '../components/shelterProfile';
import { UserContext } from '@/context/userContext';
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  })),
}));

jest.mock('../components/animalCard', () => {
  return function MockAnimalCard({
    animalId,
    userContext,
    addToFavourite,
    removeFromFavourite,
    setRefreshShelter,
  }) {
    const mockAnimal = {
      _id: animalId,
      name: 'Mock Animal',
      age: 3,
      description: 'This is a mock animal description.',
      gender: 'Samiec',
      type: 'Pies',
      traits: [{ text: 'Friendly' }, { text: 'Playful' }],
      images: [{ preview: '/mock-image.jpg' }],
      adopted: false,
      shelter: userContext.user?.shelterId,
    };

    return (
      <div data-testid="mock-animal-card">
        <h2>{mockAnimal.name}</h2>
        <p>Wiek: {mockAnimal.age}</p>
        <p>Opis: {mockAnimal.description}</p>
        <p>Płeć: {mockAnimal.gender}</p>
        <div>
          {userContext.user?.favourites?.some(
            (fav) => fav._id === mockAnimal._id
          ) ? (
            <button
              data-testid="remove-from-favourites-button"
              onClick={() => removeFromFavourite(mockAnimal._id)}
            >
              Remove from Favourites
            </button>
          ) : (
            <button
              data-testid="add-to-favourites-button"
              onClick={() => addToFavourite(mockAnimal._id)}
            >
              Add to Favourites
            </button>
          )}
        </div>
        {userContext.user?.shelterId === mockAnimal.shelter && (
          <div>
            <button
              data-testid="delete-animal-button"
              onClick={() => {
                setRefreshShelter && setRefreshShelter((prev) => !prev);
              }}
            >
              Delete Animal
            </button>
            <button
              onClick={() =>
                alert(
                  mockAnimal.adopted
                    ? 'Zwierzę zostało już oznaczone jako zaadoptowane!'
                    : 'Zwierzę zostało oznaczone jako zaadoptowane!'
                )
              }
            >
              Adopcja
            </button>
          </div>
        )}
      </div>
    );
  };
});

describe('ShelterProfile Component', () => {
  const mockShelter = {
    _id: '1',
    name: 'Happy Paws Shelter',
    location: [252.2297, 21.0122],
    phoneNumber: '+1 555-123-4567',
    email: 'contact@happypaws.com',
    animals: [
      {
        _id: '1',
        name: 'Buddy',
        age: 3,
        description: 'Test description',
        gender: 'Samiec',
        type: 'Pies',
        traits: [{ text: 'Friendly' }],
        images: [{ preview: '/image.jpg' }],
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
                favourites: [{ _id: '123' }],
              },
            }),
        });
      }

      if (url.includes(`/user/removefavourite/${mockUserContext.user.email}`)) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              statusCode: 200,
              user: {
                email: 'test@example.com',
                favourites: [],
              },
            }),
        });
      }

      if (url.includes('api.opencagedata.com/geocode/v1/json')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: [
                {
                  formatted: 'Warsaw, Poland',
                  components: {
                    city: 'Warsaw',
                  },
                },
              ],
            }),
        });
      }

      return Promise.reject(new Error('Unexpected URL'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shelter profile with animals', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );

    const desktopName = await screen.findByTestId('desktop-shelter-name');
    expect(desktopName).toHaveTextContent('Happy Paws Shelter');

    const toggleButton = await screen.findByTestId('bi-menu-icon');
    await userEvent.click(toggleButton);
    const mobileName = await screen.findByTestId('mobile-shelter-name');
    expect(mobileName).toHaveTextContent('Happy Paws Shelter');

    expect(await screen.findByText('Buddy')).toBeInTheDocument();
  });

  it('opens the animal modal when an animal card is clicked', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );

    const buddyElement = await screen.findByText('Buddy');
    await userEvent.click(buddyElement);

    expect(await screen.findByTestId('mock-animal-card')).toBeInTheDocument();
    expect(await screen.findByText('Buddy')).toBeInTheDocument();
  });

  it('closes the animal modal when the close button is clicked', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
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
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
    const buddyElements = await screen.findAllByText('Buddy');
    const buddyCard = buddyElements[0];
    await userEvent.click(buddyCard);

    expect(await screen.findByText('Wiek: 3')).toBeInTheDocument();
    expect(await screen.findByText('Płeć: Samiec')).toBeInTheDocument();
    expect(
      await screen.findByText('Opis: This is a mock animal description.')
    ).toBeInTheDocument();
  });

  it('displays shelter information in InfoCard on desktop', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
    const editButton = await screen.findByTestId('infoCard-edit-button');
    const infoCard = editButton.closest('div[class*="flex flex-col"]');
    expect(infoCard).toBeInTheDocument();
    expect(infoCard).toHaveTextContent(mockShelter.name);
    await waitFor(() => {
      expect(infoCard).toHaveTextContent('Adres: Warsaw, Poland');
    });
    expect(infoCard).toHaveTextContent(`Telefon: ${mockShelter.phoneNumber}`);
    expect(infoCard).toHaveTextContent(`Email: ${mockShelter.email}`);
  });

  it('toggles MobileInfoCard visibility when menu button is clicked', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
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
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
    const closeButton = await screen.findByTestId('close-button');

    const mobileCard = closeButton.closest('div[class*="fixed flex"]');

    expect(mobileCard).toHaveTextContent(mockShelter.name);
    await waitFor(() => {
      expect(mobileCard).toHaveTextContent('Adres: Warsaw, Poland');
    });
    expect(mobileCard).toHaveTextContent(`Telefon: ${mockShelter.phoneNumber}`);
    expect(mobileCard).toHaveTextContent(`Email: ${mockShelter.email}`);
  });

  it('shows backdrop blur when MobileInfoCard is visible', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
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

  it('opens animal modal when animalId is provided', async () => {
    const mockHandleAnimalClick = jest.fn();
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile
          shelterId="shelter123"
          animalId="animal1"
          handleAnimalClick={mockHandleAnimalClick}
        />
      </UserContext.Provider>
    );

    const backdrop = await screen.findByTestId('mobile-backdrop');
    expect(backdrop).toBeInTheDocument();
    waitFor(() => {
      expect(backdrop).toHaveClass('opacity-100');
    });

    expect(await screen.findByTestId('animal-card')).toBeInTheDocument();
  });

  it('does not call handleAnimalClick when animalId does not match any animal', () => {
    const mockHandleAnimalClick = jest.fn();

    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={2} />
        handleAnimalClick={mockHandleAnimalClick}
      </UserContext.Provider>
    );

    expect(mockHandleAnimalClick).not.toHaveBeenCalled();
  });

  it('does not call handleAnimalClick when animalId is null', () => {
    const mockHandleAnimalClick = jest.fn();

    const mockShelter = {
      animals: [
        { _id: '1', name: 'Animal 1' },
        { _id: '2', name: 'Animal 2' },
      ],
    };

    const mockAnimalId = null;

    render(
      <ShelterProfile
        shelterId="mockShelterId"
        animalId={mockAnimalId}
        shelter={mockShelter}
        handleAnimalClick={mockHandleAnimalClick}
      />
    );

    expect(mockHandleAnimalClick).not.toHaveBeenCalled();
  });

  describe('setRefreshShelter functionality', () => {
    it('calls setRefreshShelter when animal is deleted', async () => {
      render(
        <UserContext.Provider value={mockUserContext}>
          <ShelterProfile shelterId={1} animalId={null} />
        </UserContext.Provider>
      );

      const animalCard = await screen.findByTestId('animal-card');
      await userEvent.click(animalCard);

      const deleteButton = await screen.findByTestId('delete-animal-button');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(4); // Initial fetch + refetch
      });
    });
  });

  it('calls onEdit when edit button is clicked in InfoCard (desktop)', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
    window.alert = jest.fn();
    const editButton = await screen.findByTestId('infoCard-edit-button');
    await userEvent.click(editButton);
    expect(mockPush).toHaveBeenCalledWith('/shelterCreator?shelterId=1');
  });

  it('calls onEdit when edit button is clicked in MobileInfoCard', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <ShelterProfile shelterId={1} animalId={null} />
      </UserContext.Provider>
    );
    window.alert = jest.fn();
    const editButton = await screen.findByTestId('mobile-edit-button');
    await userEvent.click(editButton);
    expect(mockPush).toHaveBeenCalledWith('/shelterCreator?shelterId=1');
  });
});
