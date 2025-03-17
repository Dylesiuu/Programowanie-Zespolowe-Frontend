import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimalCard from '../components/animalCard';

describe('AnimalCard Component', () => {
  const mockProps = {
    image: [
      'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/1/1e/Dog_in_animal_shelter_in_Washington%2C_Iowa.jpg'
    ],
    name: 'Mike',
    gender: 'Male',
    age: '3 years old',
    location: 'Gdańsk',
    traits: ['Friendly', 'Playful', 'Energetic'],
    shelter: 'Happy Tails Shelter'
  };

  test('renders AnimalCard with props', () => {
    render(<AnimalCard {...mockProps} />);

    //All the props are rendered correctly
    expect(screen.getByText('Mike')).toBeInTheDocument();
    expect(screen.getByText('Male, 3 years old')).toBeInTheDocument();
    expect(screen.getByText('Gdańsk')).toBeInTheDocument();
    expect(screen.getByText('Friendly')).toBeInTheDocument();
    expect(screen.getByText('Playful')).toBeInTheDocument();
    expect(screen.getByText('Energetic')).toBeInTheDocument();
    expect(screen.getByText('Happy Tails Shelter')).toBeInTheDocument();
    expect(screen.getByAltText('Mike')).toHaveAttribute('src', mockProps.image[0]);
  });

  test('switches images on button click', () => {
    render(<AnimalCard {...mockProps} />);

    const nextButton = screen.getByText('›');
    const prevButton = screen.getByText('‹');
    const image = screen.getByAltText('Mike');

    //Image is displayed
    expect(image).toHaveAttribute('src', mockProps.image[0]);

    //Verify that the image changes
    fireEvent.click(nextButton);
    expect(image).toHaveAttribute('src', mockProps.image[1]);

    //Same here - verify that the image changes
    fireEvent.click(prevButton);
    expect(image).toHaveAttribute('src', mockProps.image[0]);
  });

  test('toggles full image view on click', () => {
    render(<AnimalCard {...mockProps} />);

    const imageContainer = screen.getByAltText('Mike').parentElement;
    const image = screen.getByAltText('Mike');

    //Check if its not in fullscreen
    expect(image).not.toHaveClass('fullImage');

    //Check if its in fullscreen
    fireEvent.click(imageContainer);
    expect(image).toHaveClass('fullImage');

    //Check if it goes back to normal
    fireEvent.click(imageContainer);
    expect(image).not.toHaveClass('fullImage');
  });

  test('renders without traits', () => {
    const propsWithoutTraits = { ...mockProps, traits: [] };
    render(<AnimalCard {...propsWithoutTraits} />);

    //No traits are displayed
    expect(screen.queryByText('Friendly')).not.toBeInTheDocument();
  });

  test('renders without image', () => {
    const propsWithoutImage = { ...mockProps, image: [] };
    render(<AnimalCard {...propsWithoutImage} />);
  
    //"No Image" message is displayed
    expect(screen.getByText('No Image')).toBeInTheDocument();
  
    //Image is not rendered
    expect(screen.queryByAltText('Mike')).not.toBeInTheDocument();
  });
});