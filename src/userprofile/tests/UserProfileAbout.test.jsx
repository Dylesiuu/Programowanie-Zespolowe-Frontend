import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileAbout from '../components/UserProfileAbout';

describe('ProfileAbout', () => {
  it('renders the about section with correct title', async () => {
    render(<ProfileAbout about="Testowy opis" />);
    expect(await screen.findByText('O Mnie')).toBeInTheDocument();
    expect(await screen.findByText('Testowy opis')).toBeInTheDocument();
  });

  it('displays default text when no about is provided', async () => {
    render(<ProfileAbout about="" />);
    expect(await screen.findByText('Brak opisu')).toBeInTheDocument();
  });

  it('applies correct styling', async () => {
    render(<ProfileAbout about="Test" />);
    const title = await screen.findByText('O Mnie');
    expect(title).toHaveClass('text-[#CE8455]');
    expect(title).toHaveClass('font-bold');
  });
});
