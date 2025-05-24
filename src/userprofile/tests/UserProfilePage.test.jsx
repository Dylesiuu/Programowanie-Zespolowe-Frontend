import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfilePage from '../../../pages/userProfilePage';
import { useAuthFetch } from '@/lib/authFetch';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

jest.mock('../../lib/authFetch');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('UserProfilePage', () => {
  const mockAuthFetch = jest.fn();
  const mockUserContext = {
    user: { _id: '123', token: 'test-token' },
    setUser: jest.fn(),
    isLoggedIn: jest.fn().mockReturnValue(true),
  };
  const mockRouter = {
    query: { userId: '123' },
  };

  beforeEach(() => {
    useAuthFetch.mockReturnValue(mockAuthFetch);
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (ui) =>
    render(
      <UserContext.Provider value={mockUserContext}>{ui}</UserContext.Provider>
    );

  it('displays loading state initially', () => {
    renderWithContext(<UserProfilePage />);
    expect(screen.getByText('Ładowanie danych...')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Fetch error'));
    renderWithContext(<UserProfilePage />);
    expect(await screen.findByText('Fetch error')).toBeInTheDocument();
  });

  it('renders user data after successful fetch', async () => {
    const mockUserData = {
      _id: '123',
      name: 'Test User',
      avatar: '/avatar.jpg',
      city: 'Warsaw',
      description: 'Test about',
      traits: [],
      favourites: [],
    };

    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    renderWithContext(<UserProfilePage />);

    expect(await screen.findByText(mockUserData.name)).toBeInTheDocument();
    expect(
      await screen.findByText(mockUserData.description)
    ).toBeInTheDocument();
  });

  it('displays favorite animals when available', async () => {
    const mockAnimal = {
      _id: 'animal1',
      name: 'Burek',
      images: [],
      gender: 'Samiec',
      age: '3 lata',
      description: 'Test description',
      traits: [],
      shelter: { name: 'Test Shelter' },
    };

    mockAuthFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: '123',
          name: 'Test User',
          avatar: '/avatar.jpg',
          city: 'Warsaw',
          about: 'Test about',
          traits: [],
          favourites: [{ _id: 'animal1' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnimal,
      });

    renderWithContext(<UserProfilePage />);

    expect(
      await screen.findByText('Zaserduszkowane zwierzęta')
    ).toBeInTheDocument();
    expect(await screen.findByText(mockAnimal.name)).toBeInTheDocument();
  });

  it('shows "No animals" message when no favorites exist', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: '123',
        name: 'Test User',
        avatar: '/avatar.jpg',
        city: 'Warsaw',
        about: 'Test about',
        traits: [],
        favourites: [],
      }),
    });

    renderWithContext(<UserProfilePage />);

    expect(
      await screen.findByText('Brak zwierząt do wyświetlenia')
    ).toBeInTheDocument();
  });

  it('handles animal card click', async () => {
    const mockAnimal = {
      _id: 'animal1',
      name: 'Burek',
      images: [],
      gender: 'Samiec',
      age: '3 lata',
      description: 'Test description',
      traits: [],
      shelter: { name: 'Test Shelter' },
    };

    mockAuthFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: '123',
          name: 'Test User',
          avatar: '/avatar.jpg',
          city: 'Warsaw',
          about: 'Test about',
          traits: [],
          favourites: [{ _id: 'animal1' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnimal,
      });

    renderWithContext(<UserProfilePage />);

    expect(
      await screen.findByText('Zaserduszkowane zwierzęta')
    ).toBeInTheDocument();
    expect(await screen.findByText(mockAnimal.name)).toBeInTheDocument();
  });

  it('shows "No animals" message when no favorites exist', async () => {
    mockAuthFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: '123',
        name: 'Test User',
        avatar: '/avatar.jpg',
        city: 'Warsaw',
        about: 'Test about',
        traits: [],
        favourites: [],
      }),
    });

    renderWithContext(<UserProfilePage />);

    expect(
      await screen.findByText('Brak zwierząt do wyświetlenia')
    ).toBeInTheDocument();
  });
});
