import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfilePersonalInfo from '../components/UserProfilePersonalInfo';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ProfilePersonalInfo', () => {
  const mockUser = {
    name: 'Jan',
    avatar: '/avatar.jpg',
    city: 'Warszawa',
  };

  it('renders user information correctly', async () => {
    render(<ProfilePersonalInfo user={mockUser} />);
    expect(await screen.findByText(mockUser.name)).toBeInTheDocument();
  });

  it('renders avatar image with correct attributes', async () => {
    render(<ProfilePersonalInfo user={mockUser} />);
    const img = await screen.findByAltText('avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('rounded-full');
  });
});
