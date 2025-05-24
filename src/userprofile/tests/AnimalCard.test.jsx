import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalCard from '../components/AnimalCard';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        shelter: { _id: 'schronisko123', name: 'Schronisko Warszawa' },
      }),
  })
);

describe('AnimalCard', () => {
  const mockAnimal = {
    images: ['/image1.jpg', '/image2.jpg'],
    name: 'Burek',
    gender: 'Samiec',
    age: '3 lata',
    description: 'Przyjazny piesek',
    traits: [{ _id: '1', text: 'Przyjazny' }],
    shelter: 'schronisko123',
    registrationNumber: 'REG123',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic animal information', async () => {
    render(<AnimalCard {...mockAnimal} />);
    expect(await screen.findByText(mockAnimal.name)).toBeInTheDocument();
    expect(
      await screen.findByText(`${mockAnimal.gender}, ${mockAnimal.age}`)
    ).toBeInTheDocument();
  });

  it('displays image navigation when multiple images exist', async () => {
    render(<AnimalCard {...mockAnimal} />);
    expect(await screen.findByText('1/2')).toBeInTheDocument();
    expect(await screen.findByText('‹')).toBeInTheDocument();
    expect(await screen.findByText('›')).toBeInTheDocument();
  });

  it('shows expanded view when clicked', async () => {
    const user = userEvent.setup();
    render(<AnimalCard {...mockAnimal} />);

    await user.click(await screen.findByText(mockAnimal.name));

    expect(await screen.findByText('OPIS')).toBeInTheDocument();
    expect(await screen.findByText(mockAnimal.description)).toBeInTheDocument();
  });

  it('displays traits correctly', async () => {
    const user = userEvent.setup();
    render(<AnimalCard {...mockAnimal} />);

    await user.click(await screen.findByText(mockAnimal.name));

    expect(await screen.findByText('TAGI')).toBeInTheDocument();
    expect(
      await screen.findByText(mockAnimal.traits[0].text)
    ).toBeInTheDocument();
  });

  it('handles missing images gracefully', async () => {
    render(<AnimalCard {...mockAnimal} images={[]} />);
    expect(await screen.findByText('Brak zdjęcia')).toBeInTheDocument();
  });
});
