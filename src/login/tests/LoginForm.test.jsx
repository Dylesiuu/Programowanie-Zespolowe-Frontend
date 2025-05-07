import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../components/LoginForm';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  let mockPush;
  let mockReplace;

  beforeEach(() => {
    mockPush = jest.fn();
    mockReplace = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
      replace: mockReplace,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginForm />);

    expect(screen.getByText('Zaloguj się!')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Wpisz swój adres e-mail')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Wpisz swoje hasło')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Zaloguj się' })
    ).toBeInTheDocument();
    expect(screen.getByText('Zaloguj się z Google')).toBeInTheDocument();
    expect(screen.getByText('Nie masz konta?')).toBeInTheDocument();
    expect(screen.getByText('Zarejestruj się')).toBeInTheDocument();
  });

  it('shows an error message when required fields are empty', async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() => {
      expect(screen.getByText('Email jest wymagany.')).toBeInTheDocument();
      expect(screen.getByText('Hasło jest wymagane.')).toBeInTheDocument();
    });
  });

  it('shows an error message when login credentials are invalid', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      })
    );

    render(<LoginForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Wpisz swój adres e-mail'),
      'wrong@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Wpisz swoje hasło'),
      'wrongpassword'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() => {
      expect(screen.getByText('Złe dane logowania.')).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'wrong@example.com',
            password: 'wrongpassword',
          }),
        })
      );
    });
  });

  it('shows an error message when email format is invalid', async () => {
    render(<LoginForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Wpisz swój adres e-mail'),
      'invalid-email'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() => {
      expect(
        screen.getByText('Nieprawidłowy format adresu e-mail.')
      ).toBeInTheDocument();
    });
  });

  it('sets user and token in context when login is successful', async () => {
    const mockUserData = {
      _id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const mockToken = 'mock token';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: mockUserData, token: mockToken }),
      })
    );

    const mockSetUser = jest.fn();
    const mockSetToken = jest.fn();
    const mockUserContextValue = {
      setUser: mockSetUser,
      setToken: mockSetToken,
      isLoggedIn: jest.fn(),
    };

    render(
      <UserContext.Provider value={mockUserContextValue}>
        <LoginForm />
      </UserContext.Provider>
    );

    await userEvent.type(
      screen.getByPlaceholderText('Wpisz swój adres e-mail'),
      'john.doe@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Wpisz swoje hasło'),
      'StrongPassword123!'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'john.doe@example.com',
            password: 'StrongPassword123!',
          }),
        })
      );

      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
      expect(mockSetToken).toHaveBeenCalledWith(mockToken);
    });
  });

  it('renders Google login button', () => {
    render(<LoginForm />);
    expect(screen.getByText('Zaloguj się z Google')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Google icon' })
    ).toBeInTheDocument();
  });

  it('redirects to Google auth endpoint when Google login button is clicked', async () => {
    render(<LoginForm />);

    const googleButton = screen
      .getByText('Zaloguj się z Google')
      .closest('button');
    await userEvent.click(googleButton);

    expect(mockReplace).toHaveBeenCalledWith(`${API_BASE_URL}/auth/google`);
  });

  it('renders registration link', () => {
    render(<LoginForm />);
    const registerLink = screen.getByText('Zarejestruj się').closest('a');
    expect(registerLink).toHaveAttribute('href', '/registerPage');
  });
});
