import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePersonalInfo from '../components/UserProfilePersonalInfo';

describe('ProfilePersonalInfo', () => {
  const mockUser = {
    name: 'Jan',
    avatar: '/avatar.jpg',
    city: 'Warszawa',
  };

  it('renders user information correctly', async () => {
    render(<ProfilePersonalInfo user={mockUser} />);
    expect(await screen.findByText(mockUser.name)).toBeInTheDocument();
    expect(await screen.findByText(`Miasto:`)).toBeInTheDocument();
    expect(await screen.findByText(`${mockUser.city}`)).toBeInTheDocument();
  });

  it('displays default city when not provided', async () => {
    render(<ProfilePersonalInfo user={{ ...mockUser, city: '' }} />);
    expect(await screen.findByText('Miasto:')).toBeInTheDocument();
    expect(await screen.findByText('Nie podano')).toBeInTheDocument();
  });

  it('renders avatar image with correct attributes', async () => {
    render(<ProfilePersonalInfo user={mockUser} />);
    const img = await screen.findByAltText('avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('rounded-full');
  });
});
