import React, { act } from 'react';
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
    adopted: false,
  };

  const mockUserContext = {
    user: {
      token: 'mockToken',
      shelterId: '1',
    },
  };

  const mockOnEdit = jest.fn();
  const mockAddToFavourites = jest.fn();
  const mockRemoveFromFavourites = jest.fn();
  const mockSetRefreshShelter = jest.fn();

  beforeEach(async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimal),
      })
    );

    await act(async () => {
      render(
        <AnimalCard
          animalId={mockAnimal._id}
          onEdit={mockOnEdit}
          userContext={mockUserContext}
          addToFavourite={mockAddToFavourites}
          removeFromFavourite={mockRemoveFromFavourites}
          setRefreshShelter={mockSetRefreshShelter}
        />
      );
    });
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

  it('calls the removeFromFavourite function when the remove-from-favourites button is clicked', async () => {
    const mockUserContextWithFavourites = {
      user: {
        token: 'mockToken',
        shelterId: '1',
        favourites: [mockAnimal._id],
      },
    };

    const mockRemoveFromFavourites = jest.fn();

    await act(async () => {
      render(
        <AnimalCard
          animalId={mockAnimal._id}
          onEdit={mockOnEdit}
          userContext={mockUserContextWithFavourites}
          addToFavourite={mockAddToFavourites}
          removeFromFavourite={mockRemoveFromFavourites}
        />
      );
    });

    const removeButton = await screen.findByTestId(
      'remove-from-favourites-button'
    );
    await userEvent.click(removeButton);

    expect(mockRemoveFromFavourites).toHaveBeenCalledTimes(1);
    expect(mockRemoveFromFavourites).toHaveBeenCalledWith(mockAnimal._id);
  });

  it('shows the correct color and behavior for the "Adopcja" button based on adoption status', async () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const adoptionButton = await screen.findByText('Adopcja');
    expect(adoptionButton).toHaveClass('bg-[#4caf50]');
    await userEvent.click(adoptionButton);

    expect(mockAlert).toHaveBeenCalledWith(
      'Zwierzę zostało oznaczone jako zaadoptowane!'
    );

    const mockAnimalAdopted = { ...mockAnimal, adopted: true };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnimalAdopted),
      })
    );

    await act(async () => {
      render(
        <AnimalCard
          animalId={mockAnimalAdopted._id}
          onEdit={mockOnEdit}
          userContext={mockUserContext}
          addToFavourite={mockAddToFavourites}
          removeFromFavourite={mockRemoveFromFavourites}
        />
      );
    });

    const adoptionButtonAdopted = await screen.findAllByText('Adopcja');
    expect(adoptionButtonAdopted[1]).toHaveClass('bg-[#FF0000]');
    await userEvent.click(adoptionButtonAdopted[1]);

    expect(mockAlert).toHaveBeenCalledWith(
      'Zwierzę zostało już oznaczone jako zaadoptowane!'
    );

    mockAlert.mockRestore();
  });

  it('navigates through images and displays the correct image counter', async () => {
    const image = await screen.findByAltText(mockAnimal.name);
    expect(image).toHaveAttribute('src', expect.stringContaining('image1.jpg'));

    const imageCounter = await screen.findByText('1/2');
    expect(imageCounter).toBeInTheDocument();

    const nextButton = await screen.findByTestId('next-button');
    await userEvent.click(nextButton);

    expect(image).toHaveAttribute('src', expect.stringContaining('image2.jpg'));

    const updatedImageCounter = await screen.findByText('2/2');
    expect(updatedImageCounter).toBeInTheDocument();

    const prevButton = await screen.findByTestId('prev-button');
    await userEvent.click(prevButton);

    expect(image).toHaveAttribute('src', expect.stringContaining('image1.jpg'));

    const resetImageCounter = await screen.findByText('1/2');
    expect(resetImageCounter).toBeInTheDocument();
  });

  it('shows the warning modal when the trash button is clicked', async () => {
    // Find and click the trash button
    const trashButton = await screen.findByTestId('delete-animal-button');
    await userEvent.click(trashButton);

    // Verify that the warning modal is displayed
    expect(
      await screen.findByText('Czy na pewno chcesz usunąć to zwierzę?')
    ).toBeInTheDocument();
  });

  it('calls the removeAnimal function when "Tak" is clicked in the warning modal', async () => {
    const trashButton = await screen.findByTestId('delete-animal-button');
    await userEvent.click(trashButton);

    const confirmButton = await screen.findByText('Tak');
    await userEvent.click(confirmButton);

    expect(mockSetRefreshShelter).toHaveBeenCalledTimes(1);
  });

  it('hides the warning modal when "Nie" is clicked', async () => {
    const trashButton = await screen.findByTestId('delete-animal-button');
    await userEvent.click(trashButton);

    const cancelButton = await screen.findByText('Nie');
    await userEvent.click(cancelButton);

    expect(
      screen.queryByText('Czy na pewno chcesz usunąć to zwierzę?')
    ).not.toBeInTheDocument();
  });
});
