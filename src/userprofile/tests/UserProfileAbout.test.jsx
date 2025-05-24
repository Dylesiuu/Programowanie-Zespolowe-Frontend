import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileAbout from '../components/UserProfileAbout';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ProfileAbout', () => {
  it('renders the about section with correct title', async () => {
    render(<ProfileAbout description="Testowy opis" />);
    expect(await screen.findByText('O mnie')).toBeInTheDocument();
    expect(await screen.findByText('Testowy opis')).toBeInTheDocument();
  });

  it('displays default text when no description is provided', async () => {
    render(<ProfileAbout description="" />);
    expect(await screen.findByText('Brak opisu')).toBeInTheDocument();
  });
});
