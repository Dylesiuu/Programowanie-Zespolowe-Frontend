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

  const mockUserContextValue = {
    user: {
      _id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      shelterId: 1,
      role: 'admin',
    },
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

    expect(await screen.findByText('Profil')).toBeInTheDocument();
    expect(await screen.findByText('Wyloguj')).toBeInTheDocument();
  });

  it('close profile dropdown when clicking outside', async () => {
    const profileButton = screen.getByAltText('User Profile').closest('button');
    await userEvent.click(profileButton);

    expect(await screen.findByText('Profil')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Logo'));
    expect(screen.queryByText('Profil')).not.toBeInTheDocument();
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
      `/shelterProfilePage?shelterId=${mockUserContextValue.user.shelterId}&animal=null`
    );
  });

  it('navigate to admin panel when admin button is clicked', async () => {
    const adminButton = screen.getByRole('button', {
      name: /Panel Kontrolny/i,
    });
    await userEvent.click(adminButton);
    expect(mockPush).toHaveBeenCalledWith('/adminPanelPage');
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

  describe('Navbar dropdown navigation', () => {
    it('navigates to Profile when "Profil" is clicked', async () => {
      const profileImg = await screen.findAllByAltText('User Profile');
      await userEvent.click(profileImg[0]);

      const profileOption = await screen.findByText('Profil');
      await userEvent.click(profileOption);

      expect(mockPush).toHaveBeenCalledWith('/userProfilePage?userId=123');
    });

    it('navigates to shelter creator when "Stwórz Schronisko" is clicked', async () => {
      mockUserContextValue.user.shelterId = null;
      render(
        <UserContext.Provider value={mockUserContextValue}>
          <Navbar />
        </UserContext.Provider>
      );
      const profileImg = await screen.findAllByAltText('User Profile');
      await userEvent.click(profileImg[1].closest('button'));

      const createShelterOption = await screen.findByText('Stwórz Schronisko');
      await userEvent.click(createShelterOption);

      expect(mockPush).toHaveBeenCalledWith('/shelterCreator?shelterId=null');
    });
  });
});
