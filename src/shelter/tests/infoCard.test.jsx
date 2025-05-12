import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoCard from '../components/infoCard';
import { userEvent } from '@testing-library/user-event';

describe('InfoCard Component', () => {
  const mockShelter = {
    _id: '1',
    name: 'Happy Paws Shelter',
    location: '123 Main Street, Springfield',
    phone: '+1 555-123-4567',
    email: 'contact@happypaws.com',
  };

  const mockUserContext = {
    user: {
      token: 'mockToken',
      shelterId: '1',
    },
  };

  const mockOnEdit = jest.fn();

  beforeEach(() => {
    render(
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shelter information correctly', () => {
    expect(screen.getByText(mockShelter.name)).toBeInTheDocument();

    expect(screen.getByText(/Adres:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.location)).toBeInTheDocument();
    expect(screen.getByText(/Telefon:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.phone)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.email)).toBeInTheDocument();
  });

  it('renders the Edit Info button', async () => {
    const editButton = await screen.findByTestId('infoCard-edit-button');
    expect(editButton).toBeInTheDocument();
  });

  it('calls the onEdit function when the Edit Info button is clicked', async () => {
    const editButton = await screen.findByTestId('infoCard-edit-button');
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
