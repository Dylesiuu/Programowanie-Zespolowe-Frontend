import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalCompletionScreen from '../components/AnimalCompletionScreen';

const mockAnimalData = {
  name: 'Burek',
  birthDate: '2020-01-01',
  gender: 'Samiec',
  tags: [1, 2],
  description: 'Fajny piesek',
  photos: [
    { preview: 'photo1.jpg' },
    { preview: 'photo2.jpg' },
    { preview: 'photo3.jpg' },
  ],
};

const mockAnimalTags = [
  { id: 1, text: 'Przyjazny' },
  { id: 2, text: 'Energiczny' },
];

describe('AnimalCompletionScreen', () => {
  it('renders basic information correctly', async () => {
    render(
      <AnimalCompletionScreen
        animalData={mockAnimalData}
        animalTags={mockAnimalTags}
        onSubmit={jest.fn()}
        onBack={jest.fn()}
      />
    );

    expect(await screen.findByText('Podsumowanie')).toBeInTheDocument();
    expect(await screen.findByText('Imię: Burek')).toBeInTheDocument();
    expect(
      await screen.findByText('Szacowana data urodzenia: 2020-01-01')
    ).toBeInTheDocument();
    expect(await screen.findByText('Płeć: Samiec')).toBeInTheDocument();
  });

  it('displays tags correctly', async () => {
    render(
      <AnimalCompletionScreen
        animalData={mockAnimalData}
        animalTags={mockAnimalTags}
        onSubmit={jest.fn()}
        onBack={jest.fn()}
      />
    );

    expect(await screen.findByText('Przyjazny')).toBeInTheDocument();
    expect(await screen.findByText('Energiczny')).toBeInTheDocument();
  });

  it('shows photo previews and opens modal when clicked', async () => {
    render(
      <AnimalCompletionScreen
        animalData={mockAnimalData}
        animalTags={mockAnimalTags}
        onSubmit={jest.fn()}
        onBack={jest.fn()}
      />
    );

    const firstPhoto = (await screen.findAllByAltText(/Preview/))[0];
    await userEvent.click(firstPhoto);

    expect(
      await screen.findByAltText('Powiększone zdjęcie')
    ).toBeInTheDocument();
  });

  it('calls onSubmit and onBack when buttons are clicked', async () => {
    const mockSubmit = jest.fn();
    const mockBack = jest.fn();

    render(
      <AnimalCompletionScreen
        animalData={mockAnimalData}
        animalTags={mockAnimalTags}
        onSubmit={mockSubmit}
        onBack={mockBack}
      />
    );

    await userEvent.click(await screen.findByText('Potwierdź'));
    await userEvent.click(await screen.findByText('Wróć'));

    expect(mockSubmit).toHaveBeenCalled();
    expect(mockBack).toHaveBeenCalled();
  });
});
