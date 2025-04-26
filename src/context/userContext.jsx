import { createContext, useEffect, useState } from 'react';

const initialState = {
  token: null,
  userId: null,
  setToken: () => {},
  setUserId: () => {},
  isLoggedIn: () => false,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const isLoggedIn = () => Boolean(token);

  useEffect(() => {
    if (token) {
      console.warn('I have a token, saving... ', token);

      localStorage.setItem('userToken', token);

      return;
    }

    const storedToken = localStorage.getItem('userToken');

    if (!storedToken) {
      console.warn('no stored token, what a shame');

      return;
    }

    setToken(storedToken);

    console.warn('I have a token, setting... ', storedToken);
  }, [token]);

  return (
    <UserContext.Provider
      value={{ userId, setUserId, token, setToken, isLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};
