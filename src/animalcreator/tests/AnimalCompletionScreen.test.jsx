import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnimalCompletionScreen from '../components/AnimalCompletionScreen';
import { userEvent } from '@testing-library/user-event';

jest.mock('next/image', () => {
  const MockNextImage = ({ src, alt, width, height, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  };
  MockNextImage.displayName = 'MockNextImage';
  return MockNextImage;
});

describe('AnimalCompletionScreen', () => {
  const mockAnimalData = {
    name: 'Burek',
    birthDate: '2020-01-01',
    gender: 'Samiec',
    tags: [1, 2],
    description: 'Fajny piesek',
    photos: [
      { preview: 'photo1.jpg', width: 500, height: 500 },
      { preview: 'photo2.jpg', width: 500, height: 500 },
    ],
  };

  const mockAnimalTags = [
    { id: 1, text: 'Przyjazny' },
    { id: 2, text: 'Aktywny' },
  ];

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
    expect(await screen.findByText('Imię:')).toBeInTheDocument();
    expect(await screen.findByText('Burek')).toBeInTheDocument();
    expect(
      await screen.findByText('Szacowana data urodzenia:')
    ).toBeInTheDocument();
    expect(await screen.findByText('2020-01-01')).toBeInTheDocument();
    expect(await screen.findByText('Płeć:')).toBeInTheDocument();
    expect(await screen.findByText('Samiec')).toBeInTheDocument();
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
    expect(await screen.findByText('Aktywny')).toBeInTheDocument();
  });

  it('shows photo modal when photo is clicked', async () => {
    render(
      <AnimalCompletionScreen
        animalData={mockAnimalData}
        animalTags={mockAnimalTags}
        onSubmit={jest.fn()}
        onBack={jest.fn()}
      />
    );

    const photo = await screen.findAllByAltText(/Preview/)[0];
    await userEvent.click(photo);

    waitFor(() => {
      expect(screen.getByAltText('Powiększone zdjęcie')).toBeInTheDocument();
    });
  });

  it('calls onSubmit when confirm button is clicked', async () => {
    const mockSubmit = jest.fn();
    render(
      <AnimalCompletionScreen
        animalData={mockAnimalData}
        animalTags={mockAnimalTags}
        onSubmit={mockSubmit}
        onBack={jest.fn()}
      />
    );

    const confirmButton = await screen.findByText('Potwierdź');
    await userEvent.click(confirmButton);

    expect(mockSubmit).toHaveBeenCalled();
  });
});
