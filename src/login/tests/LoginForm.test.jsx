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

  it('renders the login form', () => {
    render(<LoginForm />);

    expect(screen.getByText('Zaloguj się!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hasło')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Zaloguj się' })
    ).toBeInTheDocument();
  });

  it('shows an error message when required fields are empty', async () => {
    render(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() => {
      expect(screen.getByText('Email jest wymagany.')).toBeInTheDocument();
      expect(screen.getByText('Hasło jest wymagane.')).toBeInTheDocument();
    });
  });

  it('shows an error message when login credencials are invalid', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      })
    );

    render(<LoginForm />);

    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'wrong@example.com'
    );
    await userEvent.type(screen.getByPlaceholderText('Hasło'), 'wrongpassword');
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

    await userEvent.type(screen.getByPlaceholderText('Email'), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    await waitFor(() => {
      expect(
        screen.getByText('Nieprawidłowy format adresu e-mail.')
      ).toBeInTheDocument();
    });
  });

  it('sets user and token in context when login is successful', async () => {
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
        <LoginForm />
      </UserContext.Provider>
    );

    // Simulate user input
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'john.doe@example.com'
    );
    await userEvent.type(
      screen.getByPlaceholderText('Hasło'),
      'StrongPassword123!'
    );

    // Simulate form submission
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }));

    // Wait for the assertion
    await waitFor(() => {
      // Check that the fetch API was called with the correct arguments
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

      // Check that the user data was set in the context
      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
      expect(mockSetToken).toHaveBeenCalledWith(mockToken);
    });
  });
});
