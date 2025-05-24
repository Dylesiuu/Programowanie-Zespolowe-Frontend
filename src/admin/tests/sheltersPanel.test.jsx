import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SheltersPanel from '../components/sheltersPanel';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SheltersPanel', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    mockPush.mockClear();
  });

  it('renders a list of shelters', async () => {
    const shelters = [
      { _id: '1', name: 'Schronisko A' },
      { _id: '2', name: 'Schronisko B' },
    ];
    render(<SheltersPanel shelters={shelters} />);
    expect(await screen.findByText('Lista schronisk')).toBeInTheDocument();
    expect(await screen.findByText('Schronisko A')).toBeInTheDocument();
    expect(await screen.findByText('Schronisko B')).toBeInTheDocument();
  });

  it('shows message when no shelters', async () => {
    render(<SheltersPanel shelters={[]} />);
    expect(
      await screen.findByText('Brak schronisk do wyświetlenia')
    ).toBeInTheDocument();
  });

  it('navigates to shelter profile on card click', async () => {
    const shelters = [{ _id: '1', name: 'Schronisko A' }];
    render(<SheltersPanel shelters={shelters} />);
    const cardComponent = await screen.findByText('Schronisko A');
    const card = cardComponent.closest('div');
    await userEvent.click(card);
    expect(mockPush).toHaveBeenCalledWith('/shelterProfilePage?shelterId=1');
  });
});
