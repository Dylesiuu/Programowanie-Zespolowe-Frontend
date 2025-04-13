import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
import userEvents from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    render(<Navbar />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render without crashing', () => {
    expect(screen.getByText('Logo')).toBeInTheDocument();
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

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('close profile dropdown when clicking outside', async () => {
    const profileButton = screen.getByAltText('User Profile').closest('button');
    await userEvents.click(profileButton);

    expect(screen.getByText('Profile')).toBeInTheDocument();

    await userEvents.click(screen.getByText('Logo'));
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

      await waitFor(() => {
        expect(screen.getByText('Wyszukiwanie...')).toBeInTheDocument();
      });
    });

    it('display search results after typing', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      await waitFor(() => {
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
        expect(screen.getByText('Janek Wiśniewski')).toBeInTheDocument();
      });
    });

    it('navigate to profile when search result is clicked', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      await waitFor(async () => {
        const result = screen.getByText('Jan Kowalski');
        await userEvents.click(result);
        expect(mockPush).toHaveBeenCalledWith('/profile/1');
      });
    });

    it('close search dropdown when clicking outside', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'Jan');

      await waitFor(() => {
        expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
      });

      await userEvents.click(screen.getByText('Logo'));
      expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
    });

    it('do not show dropdown for queries shorter than 2 characters', async () => {
      const searchInput = screen.getByPlaceholderText(
        /Wpisz imię lub nazwisko użytkownika.../i
      );

      await userEvents.type(searchInput, 'J');

      await waitFor(() => {
        expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
      });
    });
  });

  it('trigger alerts for admin panel and shelter buttons', async () => {
    window.alert = jest.fn();

    const adminButton = screen.getByRole('button', {
      name: /Panel Kontrolny/i,
    });
    await userEvents.click(adminButton);
    expect(window.alert).toHaveBeenCalledWith('Panel');

    const shelterButton = screen.getByRole('button', { name: /Schronisko/i });
    await userEvents.click(shelterButton);
    expect(window.alert).toHaveBeenCalledWith('schronisko');
  });
});
