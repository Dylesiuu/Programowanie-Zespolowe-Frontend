import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalStartScreen from '../components/AnimalStartScreen';

jest.mock('next/router', () => ({
  useRouter: () => ({}),
}));

describe('AnimalStartScreen', () => {
  it('renders title and buttons', async () => {
    render(<AnimalStartScreen onStart={() => {}} onSkip={() => {}} />);

    expect(await screen.findByText('Dodaj nowe zwierzę')).toBeInTheDocument();
    expect(await screen.findByText('Dodaj kota')).toBeInTheDocument();
    expect(await screen.findByText('Dodaj psa')).toBeInTheDocument();
    expect(await screen.findByText('Anuluj')).toBeInTheDocument();
  });

  it('calls onStart with "cat" when cat button is clicked', async () => {
    const mockOnStart = jest.fn();
    render(<AnimalStartScreen onStart={mockOnStart} onSkip={() => {}} />);

    const catButton = await screen.findByText('Dodaj kota');
    await userEvent.click(catButton);

    const understandButton = await screen.findByText('Rozumiem');
    await userEvent.click(understandButton);

    expect(mockOnStart).toHaveBeenCalledWith('kot');
  });

  it('calls onStart with "dog" when dog button is clicked', async () => {
    const mockOnStart = jest.fn();
    render(<AnimalStartScreen onStart={mockOnStart} onSkip={() => {}} />);

    const dogButton = await screen.findByText('Dodaj psa');
    await userEvent.click(dogButton);

    const understandButton = await screen.findByText('Rozumiem');
    await userEvent.click(understandButton);

    expect(mockOnStart).toHaveBeenCalledWith('pies');
  });

  it('calls onSkip when cancel is clicked', async () => {
    const mockOnSkip = jest.fn();
    render(<AnimalStartScreen onStart={() => {}} onSkip={mockOnSkip} />);

    const cancelButton = await screen.findByText('Anuluj');
    await userEvent.click(cancelButton);

    expect(mockOnSkip).toHaveBeenCalled();
  });
});
