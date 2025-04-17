import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartScreen from '../components/StartScreen';

describe('StartScreen', () => {
  it('renders title and buttons', async () => {
    render(<StartScreen onStart={() => {}} onSkip={() => {}} />);

    expect(
      await screen.findByText('Opowiedz nam o sobie!')
    ).toBeInTheDocument();
    expect(await screen.findByText('Zaczynajmy')).toBeInTheDocument();
    expect(await screen.findByText('Pomiń')).toBeInTheDocument();
  });

  it('calls onStart when start button is clicked', async () => {
    const mockOnStart = jest.fn();
    render(<StartScreen onStart={mockOnStart} onSkip={() => {}} />);

    const startButton = await screen.findByText('Zaczynajmy');
    await userEvent.click(startButton);

    expect(mockOnStart).toHaveBeenCalled();
  });

  it('calls onSkip when skip button is clicked', async () => {
    const mockOnSkip = jest.fn();
    render(<StartScreen onStart={() => {}} onSkip={mockOnSkip} />);

    const skipButton = await screen.findByText('Pomiń');
    await userEvent.click(skipButton);

    expect(mockOnSkip).toHaveBeenCalled();
  });
});
