import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminInfoPanel from '../components/adminInfoPanel';

describe('AdminInfoPanel', () => {
  it('renders admin info with avatar', async () => {
    render(
      <AdminInfoPanel
        user={{
          name: 'Jan Kowalski',
          email: 'jan@example.com',
          avatar: { preview: '/avatar.jpg' },
        }}
      />
    );
    expect(await screen.getByAltText('Admin avatar')).toBeInTheDocument();
    expect(await screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(await screen.getByText('jan@example.com')).toBeInTheDocument();
  });

  it('renders admin info with default icon if no avatar', async () => {
    render(
      <AdminInfoPanel
        user={{
          name: 'Anna Nowak',
          email: 'anna@example.com',
        }}
      />
    );
    expect(await screen.getByText('👑')).toBeInTheDocument();
    expect(await screen.getByText('Anna Nowak')).toBeInTheDocument();
    expect(await screen.getByText('anna@example.com')).toBeInTheDocument();
  });

  it('renders "Administrator" if no name provided', async () => {
    render(<AdminInfoPanel user={{ email: 'admin@example.com' }} />);
    expect(await screen.getByText('Administrator')).toBeInTheDocument();
    expect(await screen.getByText('admin@example.com')).toBeInTheDocument();
  });
});
