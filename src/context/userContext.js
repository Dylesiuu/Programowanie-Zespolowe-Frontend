import { createContext, useState } from 'react';

const initialState = {
  token: null,
  userId: null,
  setToken: () => {},
  setUserId: () => {},
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState('123-456');
  const [token, setToken] = useState('token-token');

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
