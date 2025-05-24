import { createContext, useEffect, useState, useRef } from 'react';

const initialState = {
  user: null,
  token: null,
  setToken: () => {},
  setUser: () => {},
  isLoggedIn: () => false,
  logout: () => {},
  loading: true,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const refreshIntervalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const refreshTime = 270; //4.5 min

  useEffect(() => {
    if (!token) return;

    const isTokenExpiredSoon = (token) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        console.log('Token payload:', payload);
        return payload.exp < now + refreshTime;
      } catch {
        return true;
      }
    };

    const checkAndRefresh = async () => {
      if (isTokenExpiredSoon(token)) {
        try {
          if (
            token &&
            typeof token === 'string' &&
            token.split('.').length === 3
          ) {
            console.log('Time now:', Math.floor(Date.now() / 1000));
            console.log(
              'Token expiration time:',
              JSON.parse(atob(token.split('.')[1])).exp
            );
          }
          const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            console.error('Refresh failed');
            logout();
          }

          const data = await res.json();
          console.log('Token refreshed successfully');
          setToken(data.token);

          // const userRes = await fetch(`${API_BASE_URL}/user/searchUserById`, {
          //   method: 'POST',
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          //   body: JSON.stringify({ id: user._id }),
          // });

          // if (!userRes.ok) {
          //   console.error('Failed to refresh user data');
          //   logout();
          // }

          // const userData = await userRes.json();

          // setUser(userData.user);
          // console.log('User data refreshed successfully');
        } catch (err) {
          console.error('Background refresh failed', err);
          logout();
        }
      } else {
        console.log('Token still valid.');
      }
    };

    refreshIntervalRef.current = setInterval(
      checkAndRefresh,
      refreshTime * 1000
    );

    return () => {
      clearInterval(refreshIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const isLoggedIn = () => {
    // if (process.env.NODE_ENV === 'development') {
    //   if (!token) {
    //     setToken(
    //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInN1YiI6IjY3ZTM1MzRmMWYyNTJlMjM5MzNkNTY4NCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0Njc3MzYwMiwiZXhwIjoxNzQ2Nzc0NTAyfQ.Dl1NLVZr_iVIA22BY8ZC7VucRj1nBuQH1bXF6aBLX-A'
    //     ); // Set a dummy token in development mode
    //   }
    //   if (!user) {
    //     setUser({
    //       location: [],
    //       _id: '67e3534f1f252e23933d5684',
    //       name: 'admin',
    //       lastname: 'admin',
    //       email: 'admin@gmail.com',
    //       favourites: [],
    //       role: 'admin',
    //       traits: [],
    //       __v: 0,
    //       shelterId: '6818dedeb73fd00332e3518e',
    //     }); //Set a dummy user in development mode
    //   }

    //   return true; // Always return true in development mode
    // }
    if ((!user || !token) && loading) {
      console.log('Loading user context...');
      return true;
    }

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

    setLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, token, setToken, setUser, isLoggedIn, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
