import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimalCard from '../components/animalCard';

test('renders AnimalCard with props', () => {
  const props = {
    name: 'Buddy',
    location: 'New York',
    gender: 'Male',
    age: '2 years',
    traits: ['Friendly', 'Playful'],
    image: 'https://www.animalhumanesociety.org/sites/default/files/styles/scale_width_960/public/media/image/2017-07/IMG_6115.jpg?itok=4J9RLI6L',
    shelter: 'NY Shelter'
  };

  const { getByText, getByAltText } = render(<AnimalCard {...props} />);

  expect(getByText('Buddy')).toBeInTheDocument();
  expect(getByText('Male, 2 years')).toBeInTheDocument();
  expect(getByText('New York')).toBeInTheDocument();
  expect(getByText('Friendly')).toBeInTheDocument();
  expect(getByText('Playful')).toBeInTheDocument();
  expect(getByText('NY Shelter')).toBeInTheDocument();
  expect(getByAltText('Buddy')).toHaveAttribute('src', 'https://www.animalhumanesociety.org/sites/default/files/styles/scale_width_960/public/media/image/2017-07/IMG_6115.jpg?itok=4J9RLI6L');
});

test('renders AnimalCard without traits', () => {
  const props = {
    name: 'Buddy',
    location: 'New York',
    gender: 'Male',
    age: '2 years',
    image: 'https://www.animalhumanesociety.org/sites/default/files/styles/scale_width_960/public/media/image/2017-07/IMG_6115.jpg?itok=4J9RLI6L',
    shelter: 'NY Shelter'
  };

  const { getByText, getByAltText } = render(<AnimalCard {...props} />);

  expect(getByText('Buddy')).toBeInTheDocument();
  expect(getByText('Male, 2 years')).toBeInTheDocument();
  expect(getByText('New York')).toBeInTheDocument();
  expect(getByText('NY Shelter')).toBeInTheDocument();
  expect(getByAltText('Buddy')).toHaveAttribute('src', 'https://www.animalhumanesociety.org/sites/default/files/styles/scale_width_960/public/media/image/2017-07/IMG_6115.jpg?itok=4J9RLI6L');
});

test('renders AnimalCard without image', () => {
  const props = {
    name: 'Buddy',
    location: 'New York',
    gender: 'Male',
    age: '2 years',
    traits: ['Friendly', 'Playful'],
    shelter: 'NY Shelter'
  };

  const { getByText } = render(<AnimalCard {...props} />);

  expect(getByText('Buddy')).toBeInTheDocument();
  expect(getByText('Male, 2 years')).toBeInTheDocument();
  expect(getByText('New York')).toBeInTheDocument();
  expect(getByText('Friendly')).toBeInTheDocument();
  expect(getByText('Playful')).toBeInTheDocument();
  expect(getByText('NY Shelter')).toBeInTheDocument();
});