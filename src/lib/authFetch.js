import { useContext } from 'react';
import { UserContext } from '@/context/userContext';

export function useAuthFetch() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const userContext = useContext(UserContext);

  const fetchData = async (input, init = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      const tokenFromHeaders =
        init?.headers?.Authorization?.split(' ')[1] || userContext.token;

      if (!tokenFromHeaders || isTokenExpired(tokenFromHeaders)) {
        try {
          console.log('Token expired, refreshing...');
          console.log('Time now:', Math.floor(Date.now() / 1000));
          console.log(
            'Token expiration time:',
            JSON.parse(atob(tokenFromHeaders.split('.')[1])).exp
          );
          console.log('Token:', tokenFromHeaders);
          console.log('User context token:', userContext.token);
          const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userContext.token}`,
            },
          });

          if (!res.ok) {
            console.error('Refresh failed');
            userContext.logout();
            return Promise.reject('Refresh failed');
          }

          const data = await res.json();
          userContext.setToken(data.token);
        } catch (err) {
          console.error('Token refresh error:', err);
          userContext.logout();
          return Promise.reject(err);
        }
      }
    }

    return fetch(input, {
      ...init,
    });
  };

  return fetchData;
}

function isTokenExpired(token) {
  try {
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return true;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now + 60;
  } catch {
    return true;
  }
}
