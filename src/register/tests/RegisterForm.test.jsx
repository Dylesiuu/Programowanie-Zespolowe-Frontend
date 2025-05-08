import { render, screen, waitFor } from '@testing-library/react';
import RegisterForm from '../components/RegisterForm';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RegisterForm', () => {
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
  it('renders form fields correctly', async () => {
    render(<RegisterForm />);
    expect(await screen.findByLabelText('Imię')).toBeInTheDocument();
    expect(await screen.findByLabelText('Nazwisko')).toBeInTheDocument();
    expect(await screen.findByLabelText('Email')).toBeInTheDocument();
    expect(await screen.findByLabelText('Hasło')).toBeInTheDocument();
    expect(await screen.findByLabelText('Powtórz hasło')).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(<RegisterForm />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Zarejestruj się' })
    );

    expect(await screen.findByText('Imię jest wymagane.')).toBeInTheDocument();
    expect(
      await screen.findByText('Nazwisko jest wymagane.')
    ).toBeInTheDocument();
    expect(await screen.findByText('Email jest wymagany.')).toBeInTheDocument();
    expect(await screen.findByText('Hasło jest wymagane.')).toBeInTheDocument();
    expect(await screen.findByText('Powtórz hasło.')).toBeInTheDocument();
  });

  it('shows password mismatch error', async () => {
    render(<RegisterForm />);

    await userEvent.type(
      await screen.findByLabelText('Hasło'),
      'StrongPassw0rd!'
    );
    await userEvent.type(
      await screen.findByLabelText('Powtórz hasło'),
      'DifferentPass'
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Zarejestruj się' })
    );

    expect(
      await screen.findByText('Hasła muszą być takie same!')
    ).toBeInTheDocument();
  });

  it('calls API and updates context on successful registration', async () => {
    const mockUserData = {
      _id: '123',
      name: 'Jan Doe',
      email: 'Jan.doe@example.com',
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
        <RegisterForm />
      </UserContext.Provider>
    );

    await userEvent.type(await screen.findByLabelText('Imię'), 'Jan');
    await userEvent.type(await screen.findByLabelText('Nazwisko'), 'Kowalski');
    await userEvent.type(
      await screen.findByLabelText('Email'),
      'jan@example.com'
    );
    await userEvent.type(
      await screen.findByLabelText('Hasło'),
      'StrongPassw0rd!'
    );
    await userEvent.type(
      await screen.findByLabelText('Powtórz hasło'),
      'StrongPassw0rd!'
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Zarejestruj się' })
    );

    expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    expect(mockSetToken).toHaveBeenCalledWith(mockToken);
  });

  it('renders Google register button', async () => {
    render(<RegisterForm />);
    expect(
      await screen.findByText('Zarejestruj się z Google')
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('img', { name: 'Google icon' })
    ).toBeInTheDocument();
  });

  it('redirects to Google auth endpoint when Google register button is clicked', async () => {
    render(<RegisterForm />);

    const googleButton = (
      await screen.findByText('Zarejestruj się z Google')
    ).closest('button');
    await userEvent.click(googleButton);

    expect(mockReplace).toHaveBeenCalledWith(`${API_BASE_URL}/auth/google`);
  });

  it('renders registration link', async () => {
    render(<RegisterForm />);
    const registerLink = (await screen.findByText('Zaloguj się')).closest('a');
    expect(registerLink).toHaveAttribute('href', '/loginPage');
  });

  it('shows error message on duplicate email', async () => {
    // global.fetch.mockResolvedValueOnce({
    //   ok: false,
    //   status: 409,
    // });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 409,
      })
    );

    render(<RegisterForm />);

    await userEvent.type(
      await screen.findByLabelText('Email'),
      'taken@example.com'
    );
    await userEvent.type(
      await screen.findByLabelText('Hasło'),
      'StrongPassw0rd!'
    );
    await userEvent.type(
      await screen.findByLabelText('Powtórz hasło'),
      'StrongPassw0rd!'
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Zarejestruj się' })
    );

    waitFor(() => {
      expect(
        screen.getByText('Dany email jest już zajęty.')
      ).toBeInTheDocument();
    });
  });
});
