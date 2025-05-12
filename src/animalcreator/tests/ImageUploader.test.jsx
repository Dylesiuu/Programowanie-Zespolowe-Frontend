import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUploader from '../components/ImageUploader';

describe('ImageUploader', () => {
  const mockPhotos = [{ preview: 'photo1.jpg' }, { preview: 'photo2.jpg' }];

  it('renders correctly', async () => {
    render(
      <ImageUploader
        photos={mockPhotos}
        onUpload={jest.fn()}
        onRemove={jest.fn()}
      />
    );

    expect(await screen.findByText('Zdjęcia zwierzęcia:')).toBeInTheDocument();
    expect(await screen.findByText('+ Dodaj zdjęcia')).toBeInTheDocument();

    const previewImages = await screen.findAllByAltText(/Preview/);
    expect(previewImages).toHaveLength(2);
  });

  it('calls onRemove when delete button is clicked', async () => {
    const mockOnRemove = jest.fn();
    render(
      <ImageUploader
        photos={mockPhotos}
        onUpload={jest.fn()}
        onRemove={mockOnRemove}
      />
    );

    const deleteButtons = await screen.findAllByText('×');
    await userEvent.click(deleteButtons[0]);

    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it('calls onUpload when file is selected', async () => {
    const mockOnUpload = jest.fn();
    render(
      <ImageUploader photos={[]} onUpload={mockOnUpload} onRemove={jest.fn()} />
    );

    const fileInput = screen.getByRole('button', {
      name: '+ Dodaj zdjęcia',
    }).nextSibling;

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    await userEvent.upload(fileInput, file);

    expect(mockOnUpload).toHaveBeenCalled();
  });
});
