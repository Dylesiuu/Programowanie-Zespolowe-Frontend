'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const GoogleSuccess = () => {
  const router = useRouter();
  const { token, userId, isFirstLogin, error } = router.query;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (error && error !== 'null') {
      router.replace(`/auth/google/failed?error=${error}`);
      return;
    }

    if (token && userId) {
      console.log('[GoogleSuccess] Received token and userId:', {
        token,
        userId,
        isFirstLogin,
      });

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      const firstLogin = isFirstLogin === 'true';

      if (firstLogin) {
        router.replace('/userCreatorPage');
      } else {
        router.replace('/swipePage');
      }
    } else {
      console.log('[GoogleSuccess] Missing token or userId, cannot proceed');
    }
  }, [router.isReady, token, userId, isFirstLogin, error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <p className="text-gray-600">Logowanie w toku, proszę czekać…</p>
    </div>
  );
};

export default GoogleSuccess;
