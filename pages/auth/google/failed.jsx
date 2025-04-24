'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const GoogleFailed = () => {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    console.log('[GoogleFailed] OAuth error parameter:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Błąd logowania</h1>
      <p className="mb-6">
        Coś poszło nie tak: <strong>{error || 'Unknown error'}</strong>
      </p>
      <button
        onClick={() => {
          router.replace('/index');
        }}
        className="bg-[#f4a261] text-white px-5 py-2 rounded-lg hover:bg-[#e08e3e] transition"
      >
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default GoogleFailed;
