import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../components/RegisterForm';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterForm', () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
      replace: mockPush,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the registration form', () => {
    render(<RegisterForm />);
    expect(screen.getByText('Zarejestruj się!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Imię')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nazwisko')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Powtórz hasło')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Zarejestruj' })
    ).toBeInTheDocument();
  });

  it('shows error messages when required fields are empty', async () => {
    render(<RegisterForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    await waitFor(() => {
      expect(screen.getByText('Imię jest wymagane.')).toBeInTheDocument();
      expect(screen.getByText('Nazwisko jest wymagane.')).toBeInTheDocument();
      expect(screen.getByText('Email jest wymagany.')).toBeInTheDocument();
      expect(screen.getByText('Hasło jest wymagane.')).toBeInTheDocument();
      expect(screen.getByText('Powtórz hasło.')).toBeInTheDocument();
    });
  });

  it('shows an error message when passwords do not match', async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByPlaceholderText('Hasło'), 'Password123!');
    await userEvent.type(
      screen.getByPlaceholderText('Powtórz hasło'),
      'DifferentPassword123!'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    await waitFor(() => {
      expect(
        screen.getByText('Hasła muszą być takie same!')
      ).toBeInTheDocument();
    });
  });

  it('shows an error message when password does not meet requirements', async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByPlaceholderText('Hasło'), 'weakpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Hasło musi mieć co najmniej 12 znaków, zawierać dużą literę, cyfrę i znak specjalny.'
        )
      ).toBeInTheDocument();
    });
  });

  it('shows an error message when email format is invalid', async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByPlaceholderText('Email'), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    await waitFor(() => {
      expect(
        screen.getByText('Nieprawidłowy format adresu e-mail.')
      ).toBeInTheDocument();
    });
  });

  it('shows an error message when email is already taken', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 409,
      })
    );

    render(<RegisterForm />);
    await userEvent.type(screen.getByPlaceholderText('Imię'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Nazwisko'), 'Doe');
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'taken@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Hasło'),
      'StrongPassword123!'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Powtórz hasło'),
      'StrongPassword123!'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    await waitFor(() => {
      expect(
        screen.getByText('Dany email jest już zajęty.')
      ).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/register`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John',
            lastname: 'Doe',
            email: 'taken@example.com',
            password: 'StrongPassword123!',
          }),
        })
      );
    });
  });

  it('sets user and token in context when registration is successful', async () => {
    // Mock the fetch API to return a successful response with user data
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

    // Mock the UserContext
    const mockSetUser = jest.fn();
    const mockSetToken = jest.fn();
    const mockUserContextValue = {
      setUser: mockSetUser,
      setToken: mockSetToken,
      isLoggedIn: jest.fn(),
    };

    // Render the component with the mocked UserContext
    render(
      <UserContext.Provider value={mockUserContextValue}>
        <RegisterForm />
      </UserContext.Provider>
    );

    // Simulate user input
    await userEvent.type(screen.getByPlaceholderText('Imię'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Nazwisko'), 'Doe');
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'john.doe@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Hasło'),
      'StrongPassword123!'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Powtórz hasło'),
      'StrongPassword123!'
    );

    // Simulate form submission
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    // Wait for the assertion
    await waitFor(() => {
      // Check that the fetch API was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/register`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            password: 'StrongPassword123!',
          }),
        })
      );

      // Check that the user data and token were set in the context
      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
      expect(mockSetToken).toHaveBeenCalledWith(mockToken);
    });
  });

  it('shows an error message when registration fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({ message: 'Wystąpił problem podczas rejestracji' }),
      })
    );

    render(<RegisterForm />);
    await userEvent.type(screen.getByPlaceholderText('Imię'), 'John');
    await userEvent.type(screen.getByPlaceholderText('Nazwisko'), 'Doe');
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'john.doe@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Hasło'),
      'StrongPassword123!'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Powtórz hasło'),
      'StrongPassword123!'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Zarejestruj' }));

    await waitFor(() => {
      expect(
        screen.getByText('Wystąpił problem podczas rejestracji.')
      ).toBeInTheDocument();
    });
  });
});
