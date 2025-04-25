import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ShelterProfile from '../components/shelterProfile';
import AnimalsField from '../components/animalsField';

describe('ShelterProfile Component', () => {
  const mockAnimals = [
    {
      id: 1,
      name: 'Buddy',
      age: 3,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: [
        'Playful',
        'Loyal',
        'Good with kids',
        'Playful',
        'Loyal',
        'Good with kids',
        'Playful',
        'Loyal',
        'Good with kids',
      ],
      images: ['/img/dog.jpg', '/img/dog2.jpeg'],
    },
    {
      id: 2,
      name: 'Mittens',
      age: 2,
      description: 'Ciekawski i czuły kot rasy tabby.',
      gender: 'Samica',
      type: 'Kot',
      shelterId: 102,
      traits: [
        'Independent',
        'Loves to cuddle',
        'Super długi tag, który zajmie dziwnie dużo miejsca',
        'A tu taki krótki',
      ],
      images: ['/img/cat.jpg'],
    },
    {
      id: 3,
      name: 'Charlie',
      age: 4,
      description: 'Zabawny i przygodowy beagle.',
      gender: 'Samiec',
      type: 'Pies',
      shelterId: 101,
      traits: ['Energetic', 'Friendly', 'Good with other dogs'],
      images: ['/img/dog2.jpeg', '/img/dog.jpg'],
    },
  ];

  beforeEach(() => {
    render(<ShelterProfile />);
  });

  it('renders the shelter information and animals list', async () => {
    const buddyElements = await screen.findAllByText('Buddy');
    expect(buddyElements.length).toBeGreaterThan(0);
    const mittensElements = await screen.findAllByText('Mittens');
    expect(mittensElements.length).toBeGreaterThan(0);
    const CharlieElements = await screen.findAllByText('Charlie');
    expect(CharlieElements.length).toBeGreaterThan(0);
  });

  it('opens the animal modal when an animal card is clicked', async () => {
    const buddyElement = await screen.findAllByText('Buddy');
    const buddyCard = buddyElement[0];
    await userEvent.click(buddyCard);

    expect(await screen.findByText('Samiec')).toBeInTheDocument();
    expect(await screen.findByText('Pies')).toBeInTheDocument();
  });

  it('closes the animal modal when the close button is clicked', async () => {
    const buddyElement = await screen.findAllByText('Buddy');
    const buddyCard = buddyElement[0];
    await userEvent.click(buddyCard);

    expect(await screen.findByText('Samiec')).toBeInTheDocument();
    expect(await screen.findByText('Pies')).toBeInTheDocument();

    const closeButton = await screen.findByText('✕');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Samiec')).not.toBeInTheDocument();
      expect(screen.queryByText('Pies')).not.toBeInTheDocument();
    });
  });

  it('displays the correct animal details in the modal', async () => {
    const mittensElement = await screen.findAllByText('Mittens');
    const mittenCard = mittensElement[0];
    await userEvent.click(mittenCard);

    expect(await screen.findByText('Typ:')).toBeInTheDocument();

    expect(
      await screen.findByText('Ciekawski i czuły kot rasy tabby.')
    ).toBeInTheDocument();
    expect(await screen.findByText('Samica')).toBeInTheDocument();
    expect(await screen.findByText('Kot')).toBeInTheDocument();
  });
});
