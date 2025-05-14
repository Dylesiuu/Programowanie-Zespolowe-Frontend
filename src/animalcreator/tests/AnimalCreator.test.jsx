import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
    // Mock URL.createObjectURL to prevent errors in tests
    global.URL.createObjectURL = jest.fn(() => 'http://localhost/mock-url');
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
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

  it('displays animal data when givenAnimalId is provided', async () => {
    const mockAnimalData = {
      type: true,
      name: 'Testowy',
      birthYear: 2020,
      birthMonth: 1,
      gender: 'Samiec',
      traits: [1, 2],
      description: 'Testowy opis',
      images: [
        { file: 'image1.jpg', preview: 'preview1.jpg' },
        { file: 'image2.jpg', preview: 'preview2.jpg' },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimalData),
      })
    );

    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId="123" />
      </UserContext.Provider>
    );

    expect(await screen.findByDisplayValue('Testowy')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('2020-01-01')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/animals/123`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockUserContext.token}`,
        }),
      })
    );
  });
  it('handles photo upload correctly', async () => {
    const file = new File(['dummy content'], 'photo.png', {
      type: 'image/png',
    });

    await userEvent.click(screen.getByText('Dodaj psa'));
    await userEvent.click(screen.getByText('Rozumiem'));

    await userEvent.type(
      screen.getByPlaceholderText('Wpisz imię zwierzęcia'),
      'Testowy'
    );

    const dateInput = screen.getByLabelText(
      'Szacowana data urodzenia zwierzęcia'
    );
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2020-01-01');

    await userEvent.click(screen.getByText('Samiec'));
    await userEvent.click(screen.getByText('Dalej'));

    await userEvent.click(screen.getByText('Option A'));
    await userEvent.click(screen.getByText('Zakończ'));

    const input = screen.getByTestId('file-input');
    await act(async () => {
      await userEvent.upload(input, file);
    });

    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
    });
  });
});
