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
    _id: '1',
  };

  const mockOnEdit = jest.fn();
  const mockToggleCard = jest.fn();
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shelter information correctly', () => {
    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
        userContext={mockUserContext}
      />
    );

    expect(screen.getByText(mockShelter.name)).toBeInTheDocument();

    expect(screen.getByText(/Adres:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.location)).toBeInTheDocument();
    expect(screen.getByText(/Telefon:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.phone)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(mockShelter.email)).toBeInTheDocument();
  });

  it('renders the close button with the BiMenu icon and Edit Info button', async () => {
    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
        userContext={mockUserContext}
      />
    );

    const closeButton = await screen.findByTestId('close-button');
    expect(closeButton).toBeInTheDocument();

    expect(closeButton).toContainElement(screen.getByTestId('bi-menu-icon'));

    expect(await screen.findByTestId('mobile-edit-button')).toBeInTheDocument();
  });

  it('does not render the Edit Info button when user is not an employee', async () => {
    const mockUserContextWithDifferentShelterId = {
      ...mockUserContext,
      user: {
        ...mockUserContext.user,
        shelterId: '2',
      },
    };

    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
        userContext={mockUserContextWithDifferentShelterId}
      />
    );

    expect(screen.queryByTestId('mobile-edit-button')).not.toBeInTheDocument();
  });

  it('calls the onEdit function when the Edit Info button is clicked', async () => {
    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
        userContext={mockUserContext}
      />
    );

    const editButton = await screen.findByTestId('mobile-edit-button');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls the toggleCard function when the close button is clicked', async () => {
    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
        userContext={mockUserContext}
      />
    );

    const closeButton = screen.getByTestId('close-button');
    await userEvent.click(closeButton);

    expect(mockToggleCard).toHaveBeenCalledTimes(1);
  });
});
