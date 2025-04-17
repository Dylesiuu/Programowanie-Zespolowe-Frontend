import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserCreator from '../components/UserCreator';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('UserCreator', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    render(<UserCreator />);
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
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

  it('should show next or previuos question when navigation button is clicked', async () => {
    const startButton = await screen.findByText('Zaczynajmy');
    await userEvent.click(startButton);

    const nextButton = await screen.findByText('Dalej');
    await userEvent.click(nextButton);

    expect(
      await screen.findByText(
        'Czy wchodząc do domu musisz skorzystać ze schodów lub windy?'
      )
    ).toBeInTheDocument();

    const previousButton = await screen.findByText('Wróć');
    await userEvent.click(previousButton);

    expect(
      await screen.findByText(
        'Wybierz odpowiedzi, które najlepiej opisują Twoje miejsce zamieszkania.'
      )
    ).toBeInTheDocument();
  });
  it('should navigate to swipePage when skip button is clicked in skip warning', async () => {
    const skipButton = await screen.findByText('Pomiń');
    await userEvent.click(skipButton);

    const confirmButton = await screen.findByText('Pomiń i przejdź dalej');
    await userEvent.click(confirmButton);

    expect(mockPush).toHaveBeenCalledWith('/swipePage');
  });

  it('should close skip warning when continue button is clicked', async () => {
    const skipButton = await screen.findByText('Pomiń');
    await userEvent.click(skipButton);

    const continueButton = await screen.findByText('Kontynuuj ankietę');
    await userEvent.click(continueButton);

    expect(
      await screen.queryByText('Czy na pewno chcesz pominąć?')
    ).not.toBeInTheDocument();
  });
});
