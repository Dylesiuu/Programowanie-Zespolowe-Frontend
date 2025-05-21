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
  { _id: 1, text: 'Option A', collectionId: 4 },
  { _id: 2, text: 'Option B', collectionId: 4 },
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
      query: {},
    }));

    window.alert = jest.fn();

    global.URL.createObjectURL = jest.fn(() => 'http://localhost/mock-url');
    global.URL.revokeObjectURL = jest.fn();

    global.fetch = jest.fn((url) => {
      if (url.includes('/getAllAnimalTraits')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              traits: [
                { _id: 1, text: 'Option A', collectionId: 4 },
                { _id: 2, text: 'Option B', collectionId: 4 },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders start screen initially', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    expect(await screen.findByText('Dodaj nowe zwierzę')).toBeInTheDocument();
    expect(await screen.findByText('Dodaj psa')).toBeInTheDocument();
    expect(await screen.findByText('Dodaj kota')).toBeInTheDocument();
  });

  it('navigates through the form steps correctly', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    await userEvent.click(await screen.findByText('Dodaj psa'));

    if (screen.queryByText('Ważna informacja')) {
      await userEvent.click(await screen.findByText('Rozumiem'));
    }

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

    expect(await screen.findByText('Dodaj szczegóły')).toBeInTheDocument();

    await userEvent.type(
      await screen.findByPlaceholderText(
        'Opisz charakter i zwyczaje zwierzęcia...'
      ),
      'Test description'
    );

    const file = new File(['dummy content'], 'photo.png', {
      type: 'image/png',
    });

    const input = await screen.findByTestId('file-input');
    await act(async () => {
      await userEvent.upload(input, file);
    });

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    await userEvent.click(await screen.findByText('Podsumowanie'));

    expect(await screen.findByText('Podsumowanie')).toBeInTheDocument();
  });

  it('shows alerts when required fields are missing', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    await userEvent.click(await screen.findByText('Dodaj kota'));

    if (screen.queryByText('Ważna informacja')) {
      await userEvent.click(await screen.findByText('Rozumiem'));
    }

    await userEvent.click(await screen.findByText('Dalej'));

    expect(window.alert).toHaveBeenCalledWith('Proszę podać imię zwierzęcia');
  });

  it('handles navigation back correctly', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    await userEvent.click(await screen.findByText('Dodaj kota'));

    if (screen.queryByText('Ważna informacja')) {
      await userEvent.click(await screen.findByText('Rozumiem'));
    }

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
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    await userEvent.click(await screen.findByText('Dodaj kota'));

    if (screen.queryByText('Ważna informacja')) {
      await userEvent.click(await screen.findByText('Rozumiem'));
    }

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
      images: [{ preview: 'preview1.jpg' }, { preview: 'preview2.jpg' }],
    };

    global.fetch = jest.fn((url) => {
      if (url.includes('/animals/123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAnimalData),
        });
      }
      if (url.includes('/getAllAnimalTraits')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              traits: [
                { _id: 1, text: 'Option A', collectionId: 4 },
                { _id: 2, text: 'Option B', collectionId: 4 },
              ],
            }),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId="123" />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Testowy')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2020-01-01')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/animals/123'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockUserContext.token}`,
        }),
      })
    );
  });

  it('handles photo upload and removal correctly', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    await userEvent.click(await screen.findByText('Dodaj psa'));
    if (screen.queryByText('Ważna informacja')) {
      await userEvent.click(await screen.findByText('Rozumiem'));
    }
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
    await userEvent.click(await screen.findByText('Option A'));
    await userEvent.click(await screen.findByText('Zakończ'));

    const file = new File(['dummy content'], 'photo.png', {
      type: 'image/png',
    });

    const input = await screen.findByTestId('file-input');
    await act(async () => {
      await userEvent.upload(input, file);
    });

    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    const removeButton = await screen.findByTestId('remove-photo-button');
    await userEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('shows error when submitting without required fields', async () => {
    render(
      <UserContext.Provider value={mockUserContext}>
        <AnimalCreator givenAnimalId={null} />
      </UserContext.Provider>
    );

    await userEvent.click(await screen.findByText('Dodaj psa'));
    if (screen.queryByText('Ważna informacja')) {
      await userEvent.click(await screen.findByText('Rozumiem'));
    }
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
    await userEvent.click(await screen.findByText('Option A'));
    await userEvent.click(await screen.findByText('Zakończ'));

    const submitButton = await screen.findByText('Podsumowanie');
    expect(submitButton).toBeDisabled();
  });
});
