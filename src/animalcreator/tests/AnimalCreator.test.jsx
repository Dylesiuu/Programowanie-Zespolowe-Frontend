import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalCreator from '../components/AnimalCreator';
import { useRouter } from 'next/router';

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

// jest.mock('../../context/userContext', () => ({
//   useUserContext: () => ({
//     user: { id: 'test-user' },
//     isAuthenticated: true,
//   }),
// }));


describe('AnimalCreator', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders start screen initially', async () => {
    render(<AnimalCreator />);
    expect(await screen.findByText('Dodaj nowe zwierzę')).toBeInTheDocument();
  });

  it('navigates to basic info screen when animal type is selected', async () => {
    render(<AnimalCreator />);

    await userEvent.click(await screen.findByText('Dodaj psa'));
    expect(await screen.findByText('Ważna informacja')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Jeśli nie znasz odpowiedzi na jakieś pytanie, możesz przejść dalej. Pamiętaj jednak, że im więcej informacji podasz, tym większa szansa na znalezienie idealnego domu dla zwierzęcia.'
      )
    ).toBeInTheDocument();

    expect(await screen.findByText('Nie pokazuj ponownie')).toBeInTheDocument();
    expect(await screen.findByText('Wróć')).toBeInTheDocument();
    expect(await screen.findByText('Rozumiem')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('Rozumiem'));

    expect(
      await screen.findByText('Podstawowe informacje')
    ).toBeInTheDocument();
  });

  it('shows alert when required fields are missing', async () => {
    render(<AnimalCreator />);

    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));

    await userEvent.click(await screen.findByText('Dalej'));

    expect(window.alert).toHaveBeenCalledWith('Proszę podać imię zwierzęcia');
  });

  it('updates animal data and navigates to questions', async () => {
    render(<AnimalCreator />);

    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));

    await userEvent.type(
      screen.getByPlaceholderText('Wpisz imię zwierzęcia'),
      'Testowy'
    );

    const dateInput = screen.getByLabelText(
      'Szacowana data urodzenia zwierzęcia'
    );
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2020-01-01');

    await userEvent.click(await screen.findByText('Samiec'));
    await userEvent.click(await screen.findByText('Dalej'));

    expect(await screen.findByText('Fourth test question')).toBeInTheDocument();
  });

  it('handles navigation back to start screen', async () => {
    render(<AnimalCreator />);

    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));

    await userEvent.click(await screen.findByText('Wróć'));

    expect(await screen.findByText('Dodaj nowe zwierzę')).toBeInTheDocument();
  });

  it('handles tag selection in questions screen', async () => {
    render(<AnimalCreator />);

    await userEvent.click(await screen.findByText('Dodaj kota'));
    await userEvent.click(await screen.findByText('Rozumiem'));

    await userEvent.type(
      screen.getByPlaceholderText('Wpisz imię zwierzęcia'),
      'Testowy'
    );

    const dateInput = screen.getByLabelText(
      'Szacowana data urodzenia zwierzęcia'
    );
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2020-01-01');

    await userEvent.click(await screen.findByText('Samiec'));
    await userEvent.click(await screen.findByText('Dalej'));

    await userEvent.click(await screen.findByText('Option A'));

    expect(await screen.findByText('Option A')).toHaveClass('bg-[#CE8455]');
  });
});
