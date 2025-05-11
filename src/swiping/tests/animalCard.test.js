import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnimalCard from '../components/animalCard';

describe('AnimalCard Component', () => {
  const mockProps = {
    images: [
      'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Dog_in_animal_shelter_in_Washington%2C_Iowa.jpg',
    ],
    name: 'Mike',
    gender: 'Male',
    age: '3 years old',
    location: 'Gdańsk',
    traits: ['Friendly', 'Playful', 'Energetic'],
    shelter: 'Happy Tails Shelter',
  };

  test('renders AnimalCard with props', () => {
    render(<AnimalCard {...mockProps} />);

    expect(screen.getByText('Mike')).toBeInTheDocument();
    expect(screen.getByText('Male, 3 years old')).toBeInTheDocument();
    expect(screen.getByText('Gdańsk')).toBeInTheDocument();
    expect(screen.getByText('Friendly')).toBeInTheDocument();
    expect(screen.getByText('Playful')).toBeInTheDocument();
    expect(screen.getByText('Energetic')).toBeInTheDocument();
    expect(screen.getByText('Happy Tails Shelter')).toBeInTheDocument();
    expect(screen.getByAltText('Mike')).toHaveAttribute(
      'src',
      mockProps.images[0]
    );
  });

  test('switches images on button click', async () => {
    render(<AnimalCard {...mockProps} />);

    const nextButton = screen.getByText('›');
    const prevButton = screen.getByText('‹');
    const image = screen.getByAltText('Mike');

    expect(image).toHaveAttribute('src', mockProps.images[0]);

    await userEvent.click(nextButton);
    expect(image).toHaveAttribute('src', mockProps.images[1]);

    await userEvent.click(prevButton);
    expect(image).toHaveAttribute('src', mockProps.images[0]);
  });

  test('toggles full image view on click', async () => {
    render(<AnimalCard {...mockProps} />);

    const image = screen.getByAltText('Mike');
    const imageContainer = image.closest('div');

    await userEvent.click(imageContainer);

    expect(image).toHaveClass('fixed');
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    // Kliknij aby zamknąć (overlay)
    const overlay = screen.getByTestId('image-overlay');
    await userEvent.click(overlay);

    expect(image).not.toHaveClass('fixed');
  });
  test('renders without traits', () => {
    const propsWithoutTraits = { ...mockProps, traits: [] };
    render(<AnimalCard {...propsWithoutTraits} />);

    expect(screen.queryByText('Friendly')).not.toBeInTheDocument();
  });

  test('renders without image', () => {
    const propsWithoutImage = { ...mockProps, images: [] };
    render(<AnimalCard {...propsWithoutImage} />);

    expect(screen.getByText('No Image')).toBeInTheDocument();

    expect(screen.queryByAltText('Mike')).not.toBeInTheDocument();
  });
});
