import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import userEvents from '@testing-library/user-event';
import { UserContext } from '@/context/userContext';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockPush = jest.fn();
  window.alert = jest.fn();
  const mockLogout = jest.fn();

  // Mock the UserContext value
  const mockUserContextValue = {
    user: { name: 'John Doe', email: 'john.doe@example.com' },
    logout: mockLogout,
    isLoggedIn: () => true,
  };

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    // Render the Navbar with the mocked UserContext
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <Navbar />
      </UserContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render without crashing', async () => {
    expect(await screen.findByText('Logo')).toBeInTheDocument();
  });

  it('display navigation buttons', () => {
    expect(
      screen.getByRole('button', { name: /Panel Kontrolny/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Schronisko/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Strona Główna/i })
    ).toBeInTheDocument();
  });

  it('show profile dropdown when profile image is clicked', async () => {
    const profileButton = screen.getByAltText('User Profile').closest('button');
    await userEvents.click(profileButton);

    expect(await screen.findByText('Profile')).toBeInTheDocument();
    expect(await screen.findByText('Settings')).toBeInTheDocument();
    expect(await screen.findByText('Logout')).toBeInTheDocument();
  });

  it('close profile dropdown when clicking outside', async () => {
    const profileButton = screen.getByAltText('User Profile').closest('button');
    await userEvents.click(profileButton);

    expect(await screen.findByText('Profile')).toBeInTheDocument();

    await userEvents.click(await screen.findByText('Logo'));
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('navigate to home page when home button is clicked', async () => {
    const homeButton = screen.getByRole('button', { name: /Strona Główna/i });
    await userEvents.click(homeButton);
    expect(mockPush).toHaveBeenCalledWith('/swipePage');
  });

  describe('Search functionality', () => {
    it('show search input', () => {
      expect(
        screen.getByPlaceholderText(/Wpisz imię lub nazwisko użytkownika.../i)
      ).toBeInTheDocument();
    });

    it('display loading state when searching', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      expect(await screen.findByText('Wyszukiwanie...')).toBeInTheDocument();
    });

    it('display search results after typing', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      expect(await screen.findByText('Jan Kowalski')).toBeInTheDocument();
      expect(await screen.findByText('Janek Wiśniewski')).toBeInTheDocument();
    });

    it('navigate to profile when search result is clicked', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      const result = await screen.findByText('Jan Kowalski');
      await userEvents.click(result);
      expect(window.alert).toHaveBeenCalledWith('profile/1');
    });

    it('close search dropdown when clicking outside', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      expect(await screen.findByText('Jan Kowalski')).toBeInTheDocument();

      await userEvents.click(await screen.findByText('Logo'));
      expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
    });

    it('do not show dropdown for queries shorter than 2 characters', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'J');

      expect(await screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
    });
  });

  it('trigger alerts for admin panel and shelter buttons', async () => {
    const adminButton = screen.getByRole('button', {
      name: /Panel Kontrolny/i,
    });
    await userEvents.click(adminButton);
    expect(window.alert).toHaveBeenCalledWith('Panel');

    const shelterButton = screen.getByRole('button', { name: /Schronisko/i });
    await userEvents.click(shelterButton);
    expect(mockPush).toHaveBeenCalledWith('/shelterProfilePage');
  });

  it('calls the logout function when the logout button is clicked', async () => {
    const profileButton = screen.getByAltText('User Profile');
    await userEvents.click(profileButton);

    const logoutButton = screen.getByText('Logout');
    await userEvents.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
