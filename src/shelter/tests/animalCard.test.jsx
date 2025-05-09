import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnimalCard from '../components/animalCard';

describe('AnimalCard Component', () => {
  const mockAnimal = {
    _id: '123',
    name: 'Bella',
    shelter: '1',
    age: '3 lata',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    gender: 'Female',
    type: 'Dog',
    traits: ['Friendly', 'Playful', 'Energetic', 'Loyal'],
    images: ['/image1.jpg', '/image2.jpg'],
  };

  const mockUserContext = {
    user: {
      token: 'mockToken',
      shelterId: '1',
    },
  };

  const mockOnEdit = jest.fn();
  const mockAddToFavourites = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimal),
      })
    );

    render(
      <AnimalCard
        animalId={mockAnimal._id}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
        addToFavourite={mockAddToFavourites}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the AnimalCard component with animal details', async () => {
    expect(await screen.findByText('Bella')).toBeInTheDocument();
    expect(await screen.findByText('Wiek:')).toBeInTheDocument();
    expect(await screen.findByText('3 lata')).toBeInTheDocument();
    expect(await screen.findByText('Opis:')).toBeInTheDocument();
    expect(await screen.findByText('Więcej...')).toBeInTheDocument();
    expect(await screen.findByText('Płeć:')).toBeInTheDocument();
    expect(await screen.findByText('Female')).toBeInTheDocument();
    expect(await screen.findByText('Friendly')).toBeInTheDocument();
    expect(await screen.findByText('Pokaż więcej')).toBeInTheDocument();
  });

  it('calls the onEdit function when the "Edytuj" button is clicked', async () => {
    const editButton = await screen.findByText('Edytuj');
    await userEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('shows the description modal when "Więcej..." is clicked', async () => {
    const moreButton = await screen.findByText('Więcej...');
    await userEvent.click(moreButton);

    expect(await screen.findByText(mockAnimal.description)).toBeInTheDocument();

    const closeButton = await screen.findByText('✕');
    await userEvent.click(closeButton);

    expect(screen.queryByText(mockAnimal.description)).not.toBeInTheDocument();
  });

  it('shows the traits modal when "Pokaż więcej" is clicked', async () => {
    const showMoreButton = await screen.findByText('Pokaż więcej');
    await userEvent.click(showMoreButton);

    expect(await screen.findByText('Loyal')).toBeInTheDocument();

    const closeButton = await screen.findByText('✕');
    await userEvent.click(closeButton);

    expect(screen.queryByText('Loyal')).not.toBeInTheDocument();
  });

  it('navigates through images using the navigation buttons', async () => {
    const image = await screen.findByAltText(mockAnimal.name);
    expect(image).toHaveAttribute('src');

    const nextButton = await screen.findByTestId('next-button');
    await userEvent.click(nextButton);
    expect(image).toHaveAttribute('src');

    const prevButton = await screen.findByTestId('prev-button');
    await userEvent.click(prevButton);
    expect(image).toHaveAttribute('src');
  });

  it('shows the image modal when the image is clicked', async () => {
    const image = await screen.findByAltText(mockAnimal.name);
    await userEvent.click(image);

    expect(await screen.findByTestId('image-modal')).toBeInTheDocument();
    const modalImage = await screen.findByAltText(`modal-${mockAnimal.name}`);
    const imageUrl = new URL(modalImage.src, window.location.origin);
    expect(imageUrl.searchParams.get('url')).toBe('/image1.jpg');

    const closeButton = await screen.findByText('✕');
    await userEvent.click(closeButton);

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
  });

  it('calls the addToFavourite function when the like button is clicked', async () => {
    const likeButton = await screen.findByTestId('add-to-favourites-button');
    await userEvent.click(likeButton);

    expect(mockAddToFavourites).toHaveBeenCalledTimes(1);
    expect(mockAddToFavourites).toHaveBeenCalledWith(mockAnimal._id);
  });
});
