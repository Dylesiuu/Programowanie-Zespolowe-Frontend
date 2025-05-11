import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserSearchBar from '../components/userSearchBar';
import userEvent from '@testing-library/user-event';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: [
          { _id: '1', name: 'Jan', lastname: 'Kowalski' },
          { _id: '2', name: 'Janek', lastname: 'Wiśniewski' },
        ],
      }),
  })
);

describe('UserSearchBar', () => {
  const mockUserContext = {
    token: 'test-token',
  };

  beforeEach(() => {
    render(<UserSearchBar userContext={mockUserContext} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input field', () => {
    const inputField = screen.getByPlaceholderText(
      'Wpisz imię lub nazwisko użytkownika...'
    );
    expect(inputField).toBeInTheDocument();
  });

  it('displays search results in the dropdown', async () => {
    const inputField = screen.getByPlaceholderText(
      'Wpisz imię lub nazwisko użytkownika...'
    );
    await userEvent.type(inputField, 'Jan');

    expect(await screen.findByText('Jan Kowalski')).toBeInTheDocument();
    expect(await screen.findByText('Janek Wiśniewski')).toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', async () => {
    const inputField = screen.getByPlaceholderText(
      'Wpisz imię lub nazwisko użytkownika...'
    );
    await userEvent.type(inputField, 'Jan');

    expect(await screen.findByText('Jan Kowalski')).toBeInTheDocument();

    await userEvent.click(document.body);

    expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
  });

  it('handles selecting a result from the dropdown', async () => {
    window.alert = jest.fn();

    const inputField = screen.getByPlaceholderText(
      'Wpisz imię lub nazwisko użytkownika...'
    );
    await userEvent.type(inputField, 'Jan');

    const resultItems = await screen.findByText('Jan Kowalski');
    expect(resultItems).toBeInTheDocument();

    await userEvent.click(resultItems);

    expect(window.alert).toHaveBeenCalledWith('profile/1');
  });
});
