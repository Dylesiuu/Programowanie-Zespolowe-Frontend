import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileInfoCard from '../components/mobileInfoCard';
import { userEvent } from '@testing-library/user-event';

describe('MobileInfoCard Component', () => {
  const mockShelter = {
    name: 'Happy Paws Shelter',
    location: [23.4567, 45.6789],
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

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                formatted: 'Warsaw, Poland',
                components: {
                  city: 'Warsaw',
                },
              },
            ],
          }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the shelter information correctly', async () => {
    render(
      <MobileInfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        toggleCard={mockToggleCard}
        userContext={mockUserContext}
      />
    );

    expect(await screen.findByText(mockShelter.name)).toBeInTheDocument();

    expect(await screen.findByText(/Adres:/)).toBeInTheDocument();
    expect(await screen.findByText('Warsaw, Poland')).toBeInTheDocument();
    expect(await screen.findByText(/Telefon:/)).toBeInTheDocument();
    expect(await screen.findByText(mockShelter.phone)).toBeInTheDocument();
    expect(await screen.findByText(/Email:/)).toBeInTheDocument();
    expect(await screen.findByText(mockShelter.email)).toBeInTheDocument();
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
