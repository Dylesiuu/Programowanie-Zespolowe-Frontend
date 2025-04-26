import React, { useContext, useEffect } from 'react';
import UserCreator from '../src/creator/components/UserCreator';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const UserCreatorPage = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  return (
    <div className="m-0 p-0 min-h-screen bg-white">
      <UserCreator />
    </div>
  );
};

export default UserCreatorPage;
