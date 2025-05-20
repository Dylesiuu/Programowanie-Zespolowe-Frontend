import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompletionScreen from '../components/CompletionScreen';

describe('CompletionScreen', () => {
  const mockAllTraits = [
    { _id: '1', text: 'Dom' },
    { _id: '2', text: 'Mieszkanie wielopokojowe' },
  ];

  it('renders completion message and selected tags', async () => {
    const selectedTags = ['1', '2'];
    render(
      <CompletionScreen
        selectedTags={selectedTags}
        allTraits={mockAllTraits}
        onSubmit={jest.fn()}
      />
    );

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

  it('calls onSubmit when continue button is clicked', async () => {
    const mockSubmit = jest.fn();
    render(
      <CompletionScreen
        selectedTags={[]}
        allTraits={[]}
        onSubmit={mockSubmit}
      />
    );

    const continueButton = await screen.findByText('Przejdź do przeglądania');
    await userEvent.click(continueButton);

    expect(mockSubmit).toHaveBeenCalled();
  });
});
