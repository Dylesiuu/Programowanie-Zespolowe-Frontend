import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfileTags from '../components/UserProfileTags';

describe('UserProfileTags', () => {
  const mockTags = [
    { _id: '1', text: 'Miłośnik kotów' },
    { _id: '2', text: 'Wolontariusz' },
  ];

  it('renders the tags section with correct title', () => {
    render(<UserProfileTags userTags={mockTags} />);
    expect(screen.getByText('Tagi')).toBeInTheDocument();
  });

  it('displays all user tags', () => {
    render(<UserProfileTags userTags={mockTags} />);
    mockTags.forEach((tag) => {
      expect(screen.getByText(tag.text)).toBeInTheDocument();
    });
  });

  it('renders correct styling for tags', () => {
    render(<UserProfileTags userTags={mockTags} />);
    const tagElements = screen.getAllByRole('listitem');
    tagElements.forEach((tag) => {
      expect(tag).toHaveClass('bg-[#fefaf7]');
      expect(tag).toHaveClass('text-[#CE8455]');
    });
  });

  it('does not break when no tags are provided', () => {
    render(<UserProfileTags userTags={[]} />);
    expect(screen.getByText('Tagi')).toBeInTheDocument();
  });
});
