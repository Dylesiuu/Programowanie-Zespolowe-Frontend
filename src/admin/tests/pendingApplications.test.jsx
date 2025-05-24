import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PendingShelterApplications from '../components/pendingApplications';
import { UserContext } from '@/context/userContext';

jest.mock('../../lib/authFetch', () => ({
  useAuthFetch: () =>
    jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              _id: '1',
              name: 'Schronisko Test',
              location: 'Miasto',
              email: 'test@shelter.pl',
              shelterData: {
                name: 'Schronisko Test',
                location: 'Miasto',
                email: 'test@shelter.pl',
                website: 'https://schronisko.pl',
                description: 'Opis schroniska',
              },
              user: {
                _id: 'u1',
                name: 'Jan',
                lastname: 'Kowalski',
                email: 'jan@user.pl',
              },
            },
          ]),
      })
    ),
}));

const userContextValue = {
  token: 'test-token',
};

describe('PendingShelterApplications', () => {
  it('renders loading and then applications', async () => {
    render(
      <UserContext.Provider value={userContextValue}>
        <PendingShelterApplications />
      </UserContext.Provider>
    );
    expect(await screen.findByText(/Ładowanie/)).toBeInTheDocument();
    expect(await screen.findByText('Schronisko Test')).toBeInTheDocument();
    expect(await screen.findByText('Miasto')).toBeInTheDocument();
  });

  it('shows modal with details when application is clicked', async () => {
    render(
      <UserContext.Provider value={userContextValue}>
        <PendingShelterApplications />
      </UserContext.Provider>
    );
    const item = await screen.findByText('Schronisko Test');
    fireEvent.click(item.closest('li'));
    expect(await screen.findByText('Wniosek o schronisko')).toBeInTheDocument();
    expect(await screen.findByText('Jan Kowalski')).toBeInTheDocument();
    expect(await screen.findByText('jan@user.pl')).toBeInTheDocument();
    expect(
      await screen.findByText('https://schronisko.pl')
    ).toBeInTheDocument();
    expect(await screen.findByText('Opis schroniska')).toBeInTheDocument();
  });

  it('calls handleDecision and onUpdate when approve is clicked', async () => {
    const onUpdate = jest.fn();
    render(
      <UserContext.Provider value={userContextValue}>
        <PendingShelterApplications onUpdate={onUpdate} />
      </UserContext.Provider>
    );
    const item = await screen.findByText('Schronisko Test');
    fireEvent.click(item.closest('li'));
    const approveBtn = await screen.findByText('Zatwierdź');
    fireEvent.click(approveBtn);
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it('shows "Brak oczekujących wniosków." when no applications', async () => {
    jest.spyOn(require('../../lib/authFetch'), 'useAuthFetch').mockReturnValue(
      jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      )
    );
    render(
      <UserContext.Provider value={userContextValue}>
        <PendingShelterApplications />
      </UserContext.Provider>
    );
    expect(
      await screen.findByText('Brak oczekujących wniosków.')
    ).toBeInTheDocument();
  });
});
