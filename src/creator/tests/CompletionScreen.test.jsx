import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompletionScreen from '../components/CompletionScreen';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('CompletionScreen', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders completion message and selected tags', async () => {
    const selectedTags = [1, 2];
    render(<CompletionScreen selectedTags={selectedTags} />);

    expect(
      await screen.findByText('Twój profil został utworzony!')
    ).toBeInTheDocument();
    expect(await screen.findByText('Dom')).toBeInTheDocument();
    expect(
      await screen.findByText('Mieszkanie wielopokojowe')
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Przejdź do przeglądania')
    ).toBeInTheDocument();
  });

  it('navigates to swipe page when continue button is clicked', async () => {
    render(<CompletionScreen selectedTags={[]} />);
    const continueButton = await screen.findByText('Przejdź do przeglądania');
    await userEvent.click(continueButton);

    expect(mockPush).toHaveBeenCalledWith('/swipePage');
  });
});
