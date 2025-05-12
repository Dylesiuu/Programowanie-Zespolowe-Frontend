import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalDetailScreen from '../components/AnimalDetailScreen';

describe('AnimalDetailScreen', () => {
  const mockAnimalData = {
    description: 'Test description',
    photos: [{ preview: 'test.jpg' }],
  };

  it('renders correctly', async () => {
    render(
      <AnimalDetailScreen
        animalData={mockAnimalData}
        onDescriptionChange={jest.fn()}
        onPhotoUpload={jest.fn()}
        onRemovePhoto={jest.fn()}
        onNext={jest.fn()}
        onBack={jest.fn()}
        fileInputRef={{ current: {} }}
      />
    );

    expect(await screen.findByText('Dodaj szczegóły')).toBeInTheDocument();
    expect(await screen.findByText('Opis zwierzęcia:')).toBeInTheDocument();
    expect(await screen.findByText('Zdjęcia zwierzęcia:')).toBeInTheDocument();
  });

  it('calls onDescriptionChange when text is entered', async () => {
    const mockDescriptionChange = jest.fn();
    render(
      <AnimalDetailScreen
        animalData={mockAnimalData}
        onDescriptionChange={mockDescriptionChange}
        onPhotoUpload={jest.fn()}
        onRemovePhoto={jest.fn()}
        onNext={jest.fn()}
        onBack={jest.fn()}
        fileInputRef={{ current: {} }}
      />
    );

    const textarea = await screen.findByPlaceholderText(
      'Opisz charakter i zwyczaje zwierzęcia...'
    );
    await userEvent.type(textarea, 'New description');

    expect(mockDescriptionChange).toHaveBeenCalled();
  });

  it('disables next button when no description or photos', async () => {
    render(
      <AnimalDetailScreen
        animalData={{ description: '', photos: [] }}
        onDescriptionChange={jest.fn()}
        onPhotoUpload={jest.fn()}
        onRemovePhoto={jest.fn()}
        onNext={jest.fn()}
        onBack={jest.fn()}
        fileInputRef={{ current: {} }}
      />
    );

    expect(await screen.findByText('Podsumowanie')).toBeDisabled();
  });
});
