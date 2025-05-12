import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalCreator from '../components/AnimalCreator';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../data/animalQuestions', () => [
  {
    id: 1,
    text: 'Test question',
  },
  {
    id: 2,
    text: 'Second test question',
  },
  {
    id: 3,
    text: 'Third test question',
  },
  {
    id: 4,
    text: 'Fourth test question',
  },
]);

jest.mock('../data/animalTags', () => [
  { id: 1, text: 'Option A', collectionId: 4 },
  { id: 2, text: 'Option B', collectionId: 4 },
]);

describe('AnimalCreator', () => {
  const mockPush = jest.fn();
  const setUserMock = jest.fn();
  const mockUserContext = {
    token: 'mockToken',
    user: {
      shelterId: '1',
      email: 'test@example.com',
      favourites: [],
    },
    isLoggedIn: jest.fn(),
    setUser: setUserMock,
  };
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    window.alert = jest.fn();
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator />
      </UserContext.Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders start screen initially', async () => {
    expect(await screen.findByText('Dodaj nowe zwierzę')).toBeInTheDocument();
    expect(await screen.findByText('Dodaj psa')).toBeInTheDocument();
    expect(await screen.findByText('Dodaj kota')).toBeInTheDocument();
  });

  it('navigates through the form steps correctly', async () => {
    await userEvent.click(await screen.findByText('Dodaj psa'));

    expect(await screen.findByText('Ważna informacja')).toBeInTheDocument();
    await userEvent.click(await screen.findByText('Rozumiem'));

    expect(
      await screen.findByText('Podstawowe informacje')
    ).toBeInTheDocument();

    await userEvent.type(
      await screen.findByPlaceholderText('Wpisz imię zwierzęcia'),
      'Testowy'
    );
    const dateInput = await screen.findByLabelText(
      'Szacowana data urodzenia zwierzęcia'
    );
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2020-01-01');
    await userEvent.click(await screen.findByText('Samiec'));
    await userEvent.click(await screen.findByText('Dalej'));
    expect(await screen.findByText('Fourth test question')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Option A'));

    await userEvent.click(await screen.findByText('Zakończ'));
    expect(await screen.findByText('+ Dodaj zdjęcia')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Podsumowanie'));
    expect(await screen.findByText('Podsumowanie')).toBeInTheDocument();
  });

  it('shows alerts when required fields are missing', async () => {
    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));
    await userEvent.click(await screen.findByText('Dalej'));

    expect(window.alert).toHaveBeenCalledWith('Proszę podać imię zwierzęcia');
  });

  it('handles navigation back correctly', async () => {
    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));

    await userEvent.type(
      await screen.findByPlaceholderText('Wpisz imię zwierzęcia'),
      'Testowy'
    );
    const dateInput = await screen.findByLabelText(
      'Szacowana data urodzenia zwierzęcia'
    );
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2020-01-01');
    await userEvent.click(await screen.findByText('Samiec'));

    await userEvent.click(await screen.findByText('Dalej'));

    await userEvent.click(await screen.findByText('Wróć'));
    expect(
      await screen.findByText('Podstawowe informacje')
    ).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Wróć'));
    expect(await screen.findByText('Dodaj nowe zwierzę')).toBeInTheDocument();
  });

  it('handles tag selection correctly', async () => {
    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));
    await userEvent.type(
      await screen.findByPlaceholderText('Wpisz imię zwierzęcia'),
      'Testowy'
    );
    const dateInput = await screen.findByLabelText(
      'Szacowana data urodzenia zwierzęcia'
    );
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2020-01-01');
    await userEvent.click(await screen.findByText('Samiec'));
    await userEvent.click(await screen.findByText('Dalej'));

    const optionA = await screen.findByText('Option A');
    await userEvent.click(optionA);
    expect(optionA).toHaveClass('bg-[#CE8455]');

    await userEvent.click(optionA);
    expect(optionA).not.toHaveClass('bg-[#CE8455]');
  });
});
