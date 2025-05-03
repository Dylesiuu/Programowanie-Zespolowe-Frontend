import { createContext, useEffect, useState } from 'react';

const initialState = {
  user: null,
  setUser: () => {},
  isLoggedIn: () => false,
  logout: () => {},
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const isLoggedIn = () => {
    //comment to go to normal mode
    // if (process.env.NODE_ENV === 'development') {
    //   return true; // Always return true in development mode
    // }
    return Boolean(user && user.token); // Normal behavior in production
  };

  const logout = async () => {
    if (user && user.token) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
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
    localStorage.removeItem('user'); // Remove user from localStorage
    console.warn('User logged out and removed from localStorage.');
  };

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      console.warn('Saving user to localStorage...', user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.warn('Loading user from localStorage...', storedUser);
      setUser(JSON.parse(storedUser));
    } else {
      console.warn('No user found in localStorage.');
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, logout }}>
      {children}
    </UserContext.Provider>
  );
};
