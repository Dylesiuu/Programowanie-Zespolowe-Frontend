import { render, screen } from '@testing-library/react';
import Navbar from '../components/navbar';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
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
    user: { name: 'John Doe', email: 'john.doe@example.com', shelterId: 1 },
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
    await userEvent.click(profileButton);

    expect(await screen.findByText('Profile')).toBeInTheDocument();
    expect(await screen.findByText('Settings')).toBeInTheDocument();
    expect(await screen.findByText('Logout')).toBeInTheDocument();
  });

  it('close profile dropdown when clicking outside', async () => {
    const profileButton = screen.getByAltText('User Profile').closest('button');
    await userEvent.click(profileButton);

    expect(await screen.findByText('Profile')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Logo'));
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('navigate to home page when home button is clicked', async () => {
    const homeButton = screen.getByRole('button', { name: /Strona Główna/i });
    await userEvent.click(homeButton);
    expect(mockPush).toHaveBeenCalledWith('/swipePage');
  });

  it('navigate to shelter page when shetler button is clicked', async () => {
    const homeButton = screen.getByRole('button', { name: /Schronisko/i });
    await userEvent.click(homeButton);
    expect(mockPush).toHaveBeenCalledWith(
      `/shelterProfilePage?shelterId=${mockUserContextValue.user.shelterId}`
    );
  });

  it('navigate to admin panel when admin button is clicked', async () => {
    window.alert = jest.fn();
    const homeButton = screen.getByRole('button', { name: /Panel Kontrolny/i });
    await userEvent.click(homeButton);
    expect(window.alert).toHaveBeenCalledWith('Panel');
  });

  describe('Search functionality', () => {
    it('renders UserSearchBar by default', () => {
      expect(
        screen.getByPlaceholderText('Wpisz imię lub nazwisko użytkownika...')
      ).toBeInTheDocument();
    });

    it('switches to ShelterSearchBar when "Schroniska" is selected', async () => {
      await userEvent.click(screen.getByLabelText('Schroniska'));

      expect(
        screen.getByPlaceholderText('Kliknij, aby wybrać lokalizację')
      ).toBeInTheDocument();
    });

    it('switches back to UserSearchBar when "Użytkownicy" is selected', async () => {
      await userEvent.click(screen.getByLabelText('Schroniska'));

      expect(
        screen.getByPlaceholderText('Kliknij, aby wybrać lokalizację')
      ).toBeInTheDocument();

      await userEvent.click(screen.getByLabelText('Użytkownicy'));

      expect(
        screen.getByPlaceholderText('Wpisz imię lub nazwisko użytkownika...')
      ).toBeInTheDocument();
    });
  });
});
