import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoCard from '../components/infoCard';
import { userEvent } from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('InfoCard Component', () => {
  const mockShelter = {
    _id: '1',
    name: 'Happy Paws Shelter',
    location: [52.2297, 21.0122],
    phoneNumber: '+1 555-123-4567',
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
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
      />
    );

    expect(await screen.findByText(mockShelter.name)).toBeInTheDocument();

    expect(await screen.findByText(/Adres:/)).toBeInTheDocument();
    expect(await screen.findByText('Warsaw, Poland')).toBeInTheDocument();
    expect(await screen.findByText(/Telefon:/)).toBeInTheDocument();
    expect(
      await screen.findByText(mockShelter.phoneNumber)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email:/)).toBeInTheDocument();
    expect(await screen.findByText(mockShelter.email)).toBeInTheDocument();
  });

  it('renders the Edit Info button', async () => {
    render(
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
      />
    );

    const editButton = await screen.findByTestId('infoCard-edit-button');
    expect(editButton).toBeInTheDocument();
  });

  it('calls the onEdit function when the Edit Info button is clicked', async () => {
    render(
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
      />
    );

    const editButton = await screen.findByTestId('infoCard-edit-button');
    await userEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('renders with the correct structure and styles', async () => {
    render(
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
      />
    );

    const container = await screen.findByText('Happy Paws Shelter');
    expect(container.closest('div')).toHaveClass(
      'flex flex-col w-full p-6 bg-white rounded-3xl items-center justify-around'
    );
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
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContextWithDifferentShelterId}
      />
    );

    expect(screen.queryByTestId('mobile-edit-button')).not.toBeInTheDocument();
  });

  it('renders the delete button only when user is an employee of the shelter', async () => {
    const mockUserContextWithDifferentShelterId = {
      ...mockUserContext,
      user: {
        ...mockUserContext.user,
        shelterId: '2',
      },
    };
    render(
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContextWithDifferentShelterId}
      />
    );
    expect(
      screen.queryByTestId('infoCard-delete-button')
    ).not.toBeInTheDocument();
  });

  it('calls removeShelter and closes warning when delete is confirmed', async () => {
    render(
      <InfoCard
        shelter={mockShelter}
        onEdit={mockOnEdit}
        userContext={mockUserContext}
      />
    );

    const deleteButton = await screen.findByTestId('infoCard-delete-button');
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByText('Tak');
    await userEvent.click(confirmButton);

    expect(global.fetch).toHaveBeenCalled();
    expect(
      screen.queryByText('Czy na pewno chcesz usunąć swoje schronisko?')
    ).not.toBeInTheDocument();
  });
});
