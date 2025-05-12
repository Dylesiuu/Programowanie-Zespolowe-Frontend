import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DescriptionField from '../components/DescriptionField';

describe('DescriptionField', () => {
  it('renders correctly', async () => {
    render(<DescriptionField value="" onChange={jest.fn()} />);

    expect(await screen.findByText('Opis zwierzęcia')).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(
        'Opisz zwierzę, jego charakter, specjalne potrzeby...'
      )
    ).toBeInTheDocument();
  });

  it('calls onChange when text is entered', async () => {
    const mockOnChange = jest.fn();
    render(<DescriptionField value="" onChange={mockOnChange} />);

    const textarea = await screen.findByPlaceholderText(
      'Opisz zwierzę, jego charakter, specjalne potrzeby...'
    );
    await userEvent.type(textarea, 'Test description');

    expect(mockOnChange).toHaveBeenCalled();
  });
});
