import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationButton from '../components/NavigationButton';

describe('NavigationButton', () => {
  const mockNext = jest.fn();
  const mockPrevious = jest.fn();
  it('renders back and next buttons', async () => {
    render(
      <NavigationButton
        onNext={mockNext}
        onPrevious={mockPrevious}
        isLast={false}
      />
    );

    expect(await screen.findByText('Wróć')).toBeInTheDocument();
    expect(await screen.findByText('Dalej')).toBeInTheDocument();
  });

  it('renders finish button when isLast is true', async () => {
    render(
      <NavigationButton
        onNext={mockNext}
        onPrevious={mockPrevious}
        isLast={true}
      />
    );

    expect(await screen.findByText('Wróć')).toBeInTheDocument();
    expect(await screen.findByText('Zakończ')).toBeInTheDocument();
    expect(await screen.queryByText('Dalej')).not.toBeInTheDocument();
  });

  it('calls onPrevious when back button is clicked', async () => {
    render(
      <NavigationButton
        onNext={mockNext}
        onPrevious={mockPrevious}
        isLast={false}
      />
    );
    const backButton = await screen.findByText('Wróć');
    await userEvent.click(backButton);

    expect(mockPrevious).toHaveBeenCalled();
  });

  it('calls onNext when next button is clicked', async () => {
    render(
      <NavigationButton
        onNext={mockNext}
        onPrevious={mockPrevious}
        isLast={false}
      />
    );
    const nextButton = await screen.findByText('Dalej');
    await userEvent.click(nextButton);

    expect(mockNext).toHaveBeenCalled();
  });
});
