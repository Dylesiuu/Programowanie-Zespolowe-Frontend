import { createContext, useEffect, useState } from 'react';

const initialState = {
  user: null,
  token: null,
  setToken: () => {},
  setUser: () => {},
  isLoggedIn: () => false,
  logout: () => {},
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const isLoggedIn = () => {
    // if (process.env.NODE_ENV === 'development') {
    //   return true; // Always return true in development mode
    // }
    return Boolean(user && token); // Normal behavior in production
  };

  const logout = async () => {
    if (user && token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.warn(data.message);
        } else {
          console.error('Logout request failed: ', data.message);
        }
      } catch (error) {
        console.error('Error during logout request:', error);
      }
    }
    setUser(null); // Clear user state
    setToken(null); // Clear token state
    localStorage.removeItem('user'); // Remove user from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
    console.warn('User logged out and removed from localStorage.');
  };

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      console.warn('Saving user to localStorage...', user);
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (token) {
      console.warn('Saving token to localStorage...', token);
      localStorage.setItem('token', token);
    }
  }, [user, token]);

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.warn('Loading user from localStorage...', storedUser);
      setUser(JSON.parse(storedUser));
    } else {
      console.warn('No user found in localStorage.');
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.warn('Loading token from localStorage...', storedToken);
      setToken(storedToken);
    } else {
      console.warn('No token found in localStorage.');
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, token, setToken, setUser, isLoggedIn, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
