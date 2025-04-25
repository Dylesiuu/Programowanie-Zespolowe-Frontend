import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimalsCard from '../components/animalsField';
import userEvent from '@testing-library/user-event';

describe('AnimalsCard Component', () => {
  const mockAnimals = [
    {
      id: 1,
      name: 'Bella',
      images: ['/image1.jpg'],
    },
    {
      id: 2,
      name: 'Max',
      images: ['/image2.jpg'],
    },
    {
      id: 3,
      name: 'Charlie',
      images: ['/image3.jpg'],
    },
  ];
  const mockOnAnimalClick = jest.fn();

  it('renders the AnimalsCard component with a list of animals', () => {
    render(
      <AnimalsCard animals={mockAnimals} onAnimalClick={mockOnAnimalClick} />
    );

    mockAnimals.forEach((animal) => {
      expect(screen.getByText(animal.name)).toBeInTheDocument();
    });

    mockAnimals.forEach((animal) => {
      const image = screen.getByAltText(animal.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src');
      expect(decodeURIComponent(image.getAttribute('src'))).toContain(
        animal.images[0]
      );
    });
  });

  it('calls the onAnimalClick function when an animal card is clicked', () => {
    render(
      <AnimalsCard animals={mockAnimals} onAnimalClick={mockOnAnimalClick} />
    );

    fireEvent.click(screen.getByText('Bella'));

    expect(mockOnAnimalClick).toHaveBeenCalledTimes(1);
    expect(mockOnAnimalClick).toHaveBeenCalledWith(mockAnimals[0]);
  });

  it('applies hover effects when an animal card is hovered', async () => {
    render(
      <AnimalsCard animals={mockAnimals} onAnimalClick={mockOnAnimalClick} />
    );

    const animalElement = await screen.findByText('Bella');
    const animalCard = animalElement.closest('div');

    await userEvent.hover(animalCard);

    expect(animalCard).toHaveClass('hover:scale-105');
  });

  it('renders an empty state when no animals are provided', async () => {
    render(<AnimalsCard animals={[]} onAnimalClick={mockOnAnimalClick} />);

    expect(screen.queryByText('Bella')).not.toBeInTheDocument();
    expect(screen.queryByText('Max')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

    expect(
      await screen.findByText('Brak zwierzaków w schronisku.')
    ).toBeInTheDocument();
  });
});
