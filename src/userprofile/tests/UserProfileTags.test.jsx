import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProfileTags from '../components/UserProfileTags';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('UserProfileTags', () => {
  const mockTags = [
    { _id: '1', text: 'Miłośnik kotów' },
    { _id: '2', text: 'Wolontariusz' },
  ];
  const mockPush = jest.fn();
  const mockUserId = '123';

  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tags section with correct title', async () => {
    render(<UserProfileTags userTags={mockTags} userId={mockUserId} />);
    expect(await screen.findByText('Tagi')).toBeInTheDocument();
  });

  it('displays all user tags', async () => {
    render(<UserProfileTags userTags={mockTags} userId={mockUserId} />);
    for (const tag of mockTags) {
      expect(await screen.findByText(tag.text)).toBeInTheDocument();
    }
  });

  it('renders correct styling for tags', async () => {
    render(<UserProfileTags userTags={mockTags} userId={mockUserId} />);
    const tagElements = await screen.findAllByRole('listitem');
    tagElements.forEach((tag) => {
      expect(tag).toHaveClass('bg-[#fefaf7]');
      expect(tag).toHaveClass('text-[#CE8455]');
    });
  });

  it('does not break when no tags are provided', async () => {
    render(<UserProfileTags userTags={[]} userId={mockUserId} />);
    expect(await screen.findByText('Tagi')).toBeInTheDocument();
  });

  it('navigates to userCreatorPage when edit icon is clicked', async () => {
    render(<UserProfileTags userTags={mockTags} userId={mockUserId} />);
    const editIcon = await screen.findByTestId('edit-icon');
    await userEvent.click(editIcon);
    expect(mockPush).toHaveBeenCalledWith(
      `/userCreatorPage?userId=${mockUserId}`
    );
  });
});
