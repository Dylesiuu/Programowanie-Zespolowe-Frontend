import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { UserContext, UserProvider } from '@/context/userContext';

describe('UserContext', () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  it('provides the correct initial state', () => {
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            expect(value.user).toBeNull();
            expect(value.isLoggedIn()).toBe(false);
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it('updates the user state when setUser is called', () => {
    const testUser = { _id: '123', name: 'John Doe', token: 'some_jwt_token' };

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            act(() => {
              value.setUser(testUser);
            });
            waitFor(() => {
              expect(value.user).toEqual(testUser);
            });
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it('returns true for isLoggedIn when user has a valid token', async () => {
    const testUser = { _id: '123', name: 'John Doe', token: 'some_jwt_token' };

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            act(() => {
              value.setUser(testUser);
            });
            waitFor(() => {
              expect(value.isLoggedIn()).toBe(true);
            });
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it('returns false for isLoggedIn when no user is set', () => {
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            expect(value.isLoggedIn()).toBe(false);
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it('clears user state, localStorage, and sends a logout request to the backend', async () => {
    const testUser = { _id: '123', name: 'John Doe', token: 'some_jwt_token' };
    localStorage.setItem('user', JSON.stringify(testUser));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'User logged out successfully',
            token: null,
            statusCode: 200,
          }),
      })
    );

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            act(() => {
              value.setUser(testUser);
            });

            waitFor(() => {
              expect(value.user).toEqual(testUser);
            });

            act(() => {
              value.logout();
            });

            waitFor(() => {
              expect(value.user).toBeNull();

              expect(localStorage.getItem('user')).toBeNull();

              expect(global.fetch).toHaveBeenCalledWith(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${testUser.token}`,
                  },
                }
              );
            });
          }}
        </UserContext.Consumer>
      </UserProvider>
    );

    global.fetch.mockRestore();
  });

  it('loads user from localStorage on initial render', () => {
    const testUser = { _id: '123', name: 'John Doe', token: 'some_jwt_token' };
    localStorage.setItem('user', JSON.stringify(testUser));

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            waitFor(() => {
              expect(value.user).toEqual(testUser);
            });
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });

  it('saves user to localStorage when setUser is called', () => {
    const testUser = { _id: '123', name: 'John Doe', token: 'some_jwt_token' };

    render(
      <UserProvider>
        <UserContext.Consumer>
          {(value) => {
            act(() => {
              value.setUser(testUser);
            });
            waitFor(() => {
              expect(localStorage.getItem('user')).toEqual(
                JSON.stringify(testUser)
              );
            });
          }}
        </UserContext.Consumer>
      </UserProvider>
    );
  });
});
