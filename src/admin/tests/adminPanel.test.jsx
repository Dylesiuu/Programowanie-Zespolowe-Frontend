import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminPanel from '../components/adminPanel';
import { UserContext } from '@/context/userContext';

jest.mock('../components/adminInfoPanel', () => {
  const MockAdminInfoPanel = () => <div data-testid="admin-info-panel" />;
  MockAdminInfoPanel.displayName = 'MockAdminInfoPanel';
  return MockAdminInfoPanel;
});
jest.mock('../components/sheltersPanel', () => {
  const MockSheltersPanel = ({ shelters }) => (
    <div data-testid="shelters-panel">
      {shelters && shelters.length} shelters
    </div>
  );
  MockSheltersPanel.displayName = 'MockSheltersPanel';
  return MockSheltersPanel;
});
jest.mock('../components/pendingApplications', () => {
  const MockPendingApplications = ({ onUpdate }) => (
    <div data-testid="pending-applications" />
  );
  MockPendingApplications.displayName = 'MockPendingApplications';
  return MockPendingApplications;
});

jest.mock('../../lib/authFetch', () => ({
  useAuthFetch: () =>
    jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            shelters: [
              { _id: '1', name: 'Schronisko A' },
              { _id: '2', name: 'Schronisko B' },
            ],
          }),
        text: () => Promise.resolve('error'),
      })
    ),
}));

const adminUser = {
  user: {
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.pl',
    avatar: { preview: '/avatar.png' },
  },
  token: 'admin-token',
};

const nonAdminUser = {
  user: { role: 'user', name: 'User', email: 'user@user.pl' },
  token: 'user-token',
};

describe('AdminPanel', () => {
  it('shows loading state', async () => {
    render(
      <UserContext.Provider value={adminUser}>
        <AdminPanel />
      </UserContext.Provider>
    );
    expect(await screen.findByText(/Ładowanie schronisk/)).toBeInTheDocument();
  });

  it('renders admin panel for admin user', async () => {
    render(
      <UserContext.Provider value={adminUser}>
        <AdminPanel />
      </UserContext.Provider>
    );
    expect(await screen.findByTestId('admin-info-panel')).toBeInTheDocument();
    expect(await screen.findByTestId('shelters-panel')).toHaveTextContent(
      '2 shelters'
    );
    expect(
      await screen.findByTestId('pending-applications')
    ).toBeInTheDocument();
  });

  it('shows access denied for non-admin user', async () => {
    render(
      <UserContext.Provider value={nonAdminUser}>
        <AdminPanel />
      </UserContext.Provider>
    );
    expect(
      await screen.findByText(/Dostęp tylko dla administratora/)
    ).toBeInTheDocument();
  });
});
