import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkipWarning from '../components/SkipWarning';

describe('SkipWarning', () => {
  it('renders warning message and buttons', async () => {
    render(<SkipWarning onConfirm={() => {}} onCancel={() => {}} />);

    expect(
      await screen.findByText('Czy na pewno chcesz pominąć?')
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        'Pominięcie ankiety może skutkować mniej dokładnym dopasowaniem zwierząt.'
      )
    ).toBeInTheDocument();
    expect(await screen.findByText('Kontynuuj ankietę')).toBeInTheDocument();
    expect(
      await screen.findByText('Pomiń i przejdź dalej')
    ).toBeInTheDocument();
  });

  it('calls onCancel when continue button is clicked', async () => {
    const mockOnCancel = jest.fn();
    render(<SkipWarning onConfirm={() => {}} onCancel={mockOnCancel} />);

    const continueButton = await screen.findByText('Kontynuuj ankietę');
    await userEvent.click(continueButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when skip button is clicked', async () => {
    const mockOnConfirm = jest.fn();
    render(<SkipWarning onConfirm={mockOnConfirm} onCancel={() => {}} />);

    const skipButton = await screen.findByText('Pomiń i przejdź dalej');
    await userEvent.click(skipButton);

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
