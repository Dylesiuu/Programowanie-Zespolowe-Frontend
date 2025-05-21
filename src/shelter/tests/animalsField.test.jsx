import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimalsField from '../components/animalsField';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('AnimalsCard Component', () => {
  const mockAnimals = [
    {
      id: 1,
      name: 'Bella',
      images: [{ preview: '/image1.jpg' }],
    },
    {
      id: 2,
      name: 'Max',
      images: [{ preview: '/image2.jpg' }],
    },
    {
      id: 3,
      name: 'Charlie',
      images: [{ preview: '/image3.jpg' }],
    },
  ];
  const mockOnAnimalClick = jest.fn();
  const setUserMock = jest.fn();

  const mockUserContext = {
    token: 'mockToken',
    user: {
      shelterId: '1',
      email: 'test@example.com',
      favourites: [],
    },
    isLoggedIn: jest.fn(),
    setUser: setUserMock,
  };

  const mockShelterId = '1';
  const mockPush = jest.fn();
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the AnimalsCard component with a list of animals', () => {
    render(
      <AnimalsField
        animals={mockAnimals}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={mockShelterId}
      />
    );

    mockAnimals.forEach((animal) => {
      expect(screen.getByText(animal.name)).toBeInTheDocument();
    });

    mockAnimals.forEach((animal) => {
      const image = screen.getByAltText(animal.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src');
      expect(decodeURIComponent(image.getAttribute('src'))).toContain(
        animal.images[0].preview
      );
    });
  });

  it('calls the onAnimalClick function when an animal card is clicked', () => {
    render(
      <AnimalsField
        animals={mockAnimals}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={mockShelterId}
      />
    );

    fireEvent.click(screen.getByText('Bella'));

    expect(mockOnAnimalClick).toHaveBeenCalledTimes(1);
    expect(mockOnAnimalClick).toHaveBeenCalledWith(mockAnimals[0]);
  });

  it('applies hover effects when an animal card is hovered', async () => {
    render(
      <AnimalsField
        animals={mockAnimals}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={mockShelterId}
      />
    );

    const animalElement = await screen.findByText('Bella');
    const animalCard = animalElement.closest('div');

    await userEvent.hover(animalCard);

    expect(animalCard).toHaveClass('hover:scale-105');
  });

  it('renders an empty state when no animals are provided', async () => {
    render(
      <AnimalsField
        animals={[]}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={mockShelterId}
      />
    );

    expect(screen.queryByText('Bella')).not.toBeInTheDocument();
    expect(screen.queryByText('Max')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();

    expect(
      await screen.findByText('Brak zwierzaków w schronisku.')
    ).toBeInTheDocument();
  });

  it('renders the "Dodaj zwierzę" button only when the shelterId matches the user\'s shelterId', () => {
    const differentShelterId = '2';

    const { rerender } = render(
      <AnimalsField
        animals={mockAnimals}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={mockShelterId}
      />
    );

    expect(screen.getByTestId('add-animal-button')).toBeInTheDocument();

    rerender(
      <AnimalsField
        animals={mockAnimals}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={differentShelterId}
      />
    );

    expect(screen.queryByTestId('add-animal-button')).not.toBeInTheDocument();
  });

  it('navigates to the animal creator page when the "Dodaj zwierzę" button is clicked', async () => {
    render(
      <AnimalsField
        animals={mockAnimals}
        onAnimalClick={mockOnAnimalClick}
        userContext={mockUserContext}
        shelterId={mockShelterId}
      />
    );

    const addAnimalButton = screen.getByTestId('add-animal-button');

    await userEvent.click(addAnimalButton);

    expect(mockPush).toHaveBeenCalledWith('/animalCreatorPage?animalId=null');
  });
});
