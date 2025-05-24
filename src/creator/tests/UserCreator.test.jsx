import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserCreator from '../components/UserCreator';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../lib/authFetch', () => ({
  useAuthFetch: () =>
    jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ traits: [], user: {} }),
      })
    ),
}));

describe('UserCreator', () => {
  const mockPush = jest.fn();
  const mockUser = {
    _id: '123',
    traits: [],
  };
  const mockSetUser = jest.fn();
  const mockToken = 'test-token';

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(
      <UserContext.Provider
        value={{
          user: mockUser,
          setUser: mockSetUser,
          token: mockToken,
        }}
      >
        <UserCreator user={mockUser} />
      </UserContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders StartScreen initially', async () => {
    expect(
      await screen.findByText('Opowiedz nam o sobie!')
    ).toBeInTheDocument();
    expect(await screen.findByText('Zaczynajmy')).toBeInTheDocument();
    expect(await screen.findByText('Pomiń')).toBeInTheDocument();
  });

  it('navigates to first question when start button is clicked', async () => {
    const startButton = await screen.findByText('Zaczynajmy');
    await userEvent.click(startButton);

    expect(
      await screen.findByText(
        'Wybierz odpowiedzi, które najlepiej opisują Twoje miejsce zamieszkania.'
      )
    ).toBeInTheDocument();
  });

  it('shows skip warning when skip button is clicked', async () => {
    const skipButton = await screen.findByText('Pomiń');
    await userEvent.click(skipButton);

    expect(
      await screen.findByText('Czy na pewno chcesz pominąć?')
    ).toBeInTheDocument();
  });

  it('should navigate to userDetailsInfoPage when skip is confirmed', async () => {
    const skipButton = await screen.findByText('Pomiń');
    await userEvent.click(skipButton);

    const confirmButton = await screen.findByText('Pomiń i przejdź dalej');
    await userEvent.click(confirmButton);

    expect(mockPush).toHaveBeenCalledWith(
      `/userDetailsCreatorPage?userId=${mockUser._id}`
    );
  });

  it('should close skip warning when continue is clicked', async () => {
    const skipButton = await screen.findByText('Pomiń');
    await userEvent.click(skipButton);

    const continueButton = await screen.findByText('Kontynuuj ankietę');
    await userEvent.click(continueButton);

    expect(
      screen.queryByText('Czy na pewno chcesz pominąć?')
    ).not.toBeInTheDocument();
  });
});
