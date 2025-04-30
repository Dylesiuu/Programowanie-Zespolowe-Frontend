import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoCard from '../components/infoCard';
import { userEvent } from '@testing-library/user-event';

describe('InfoCard Component', () => {
  const mockShelter = {
    name: 'Happy Paws Shelter',
    location: '123 Main Street, Springfield',
    phone: '+1 555-123-4567',
    email: 'contact@happypaws.com',
  };

  const mockOnEdit = jest.fn();

  beforeEach(() => {
    render(<InfoCard shelter={mockShelter} onEdit={mockOnEdit} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shelter information correctly', () => {
    expect(screen.getByText(mockShelter.name)).toBeInTheDocument();

    expect(screen.getByText(/Location:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.location)).toBeInTheDocument();
    expect(screen.getByText(/Phone:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.phone)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.email)).toBeInTheDocument();
  });

  it('renders the Edit Info button', () => {
    const editButton = screen.getByText('Edit Info');
    expect(editButton).toBeInTheDocument();
  });

  it('calls the onEdit function when the Edit Info button is clicked', async () => {
    const editButton = screen.getByText('Edit Info');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('renders with the correct structure and styles', () => {
    const container = screen.getByText('Happy Paws Shelter').closest('div');
    expect(container).toHaveClass(
      'flex flex-col w-full p-6 bg-white rounded-3xl items-center justify-around'
    );
  });
});
