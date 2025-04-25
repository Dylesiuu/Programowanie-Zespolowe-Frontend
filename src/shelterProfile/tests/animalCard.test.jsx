import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnimalCard from '../components/animalCard';

describe('AnimalCard Component', () => {
  const mockAnimal = {
    name: 'Bella',
    age: 3,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    gender: 'Female',
    type: 'Dog',
    traits: ['Friendly', 'Playful', 'Energetic', 'Loyal'],
    images: ['/image1.jpg', '/image2.jpg'],
  };

  const mockOnEdit = jest.fn();

  it('renders the AnimalCard component with animal details', async () => {
    render(<AnimalCard animal={mockAnimal} onEdit={mockOnEdit} />);

    expect(await screen.findByText('Bella')).toBeInTheDocument();
    expect(await screen.findByText('Wiek:')).toBeInTheDocument();
    expect(await screen.findByText('3 lata')).toBeInTheDocument();
    expect(await screen.findByText('Opis:')).toBeInTheDocument();
    expect(
      await screen.findByText(
        mockAnimal.description.slice(0, 100).trimEnd() + '...'
      )
    ).toBeInTheDocument();
    expect(await screen.findByText('Więcej...')).toBeInTheDocument();
    expect(await screen.findByText('Płeć:')).toBeInTheDocument();
    expect(await screen.findByText('Female')).toBeInTheDocument();
    expect(await screen.findByText('Typ:')).toBeInTheDocument();
    expect(await screen.findByText('Dog')).toBeInTheDocument();

    expect(await screen.findByText('Tagi:')).toBeInTheDocument();
    expect(await screen.findByText('Friendly')).toBeInTheDocument();
    expect(await screen.findByText('Playful')).toBeInTheDocument();
    expect(await screen.findByText('Energetic')).toBeInTheDocument();

    expect(await screen.findByText('Pokaż więcej')).toBeInTheDocument();
  });

  it('calls the onEdit function when the "Edytuj" button is clicked', async () => {
    render(<AnimalCard animal={mockAnimal} onEdit={mockOnEdit} />);

    await userEvent.click(await screen.findByText('Edytuj'));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('shows the description modal when "Więcej..." is clicked', async () => {
    render(<AnimalCard animal={mockAnimal} onEdit={mockOnEdit} />);

    await userEvent.click(await screen.findByText('Więcej...'));

    expect(await screen.findByText(mockAnimal.description)).toBeInTheDocument();

    await userEvent.click(await screen.findByText('✕'));

    expect(screen.queryByText(mockAnimal.description)).not.toBeInTheDocument();
  });

  it('shows the traits modal when "Pokaż więcej" is clicked', async () => {
    render(<AnimalCard animal={mockAnimal} onEdit={mockOnEdit} />);

    await userEvent.click(await screen.findByText('Pokaż więcej'));

    expect(await screen.findByText('Loyal')).toBeInTheDocument();

    await userEvent.click(await screen.findByText('✕'));

    expect(screen.queryByText('Loyal')).not.toBeInTheDocument();
  });

  it('navigates through images using the navigation buttons', async () => {
    render(<AnimalCard animal={mockAnimal} onEdit={mockOnEdit} />);

    const image = screen.getByAltText(mockAnimal.name);

    expect(image).toHaveAttribute('src');
    expect(decodeURIComponent(image.getAttribute('src'))).toContain(
      '/image1.jpg'
    );

    await userEvent.click(await screen.findByText('›'));

    expect(image).toHaveAttribute('src');
    expect(decodeURIComponent(image.getAttribute('src'))).toContain(
      '/image2.jpg'
    );

    await userEvent.click(await screen.findByText('‹'));

    expect(image).toHaveAttribute('src');
    expect(decodeURIComponent(image.getAttribute('src'))).toContain(
      '/image1.jpg'
    );
  });
});
