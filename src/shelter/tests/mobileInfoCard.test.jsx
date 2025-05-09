import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileInfoCard from '../components/mobileInfoCard';
import { userEvent } from '@testing-library/user-event';
import { BiMenu } from 'react-icons/bi';

describe('MobileInfoCard Component', () => {
  const mockShelter = {
    name: 'Happy Paws Shelter',
    location: '123 Main Street, Springfield',
    phone: '+1 555-123-4567',
    email: 'contact@happypaws.com',
  };

  const mockOnEdit = jest.fn();
  const mockToggleCard = jest.fn();

  beforeEach(() => {
    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
      />
    );
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

  it('renders the close button with the BiMenu icon and Edit Info button', () => {
    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toBeInTheDocument();

    expect(closeButton).toContainElement(screen.getByTestId('bi-menu-icon'));

    expect(screen.getByText('Edit Info')).toBeInTheDocument();
  });

  it('calls the onEdit function when the Edit Info button is clicked', async () => {
    const editButton = screen.getByText('Edit Info');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls the toggleCard function when the close button is clicked', async () => {
    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);

    expect(mockToggleCard).toHaveBeenCalledTimes(1);
  });
});
