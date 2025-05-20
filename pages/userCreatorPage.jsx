import React, { useContext, useEffect } from 'react';
import UserCreator from '../src/creator/components/UserCreator';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const UserCreatorPage = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  return (
    <div className="m-0 p-0 max-h-[calc(100vh-3.75rem)] w-full h-full bg-white">
      <UserCreator givenUserId={userId} />
    </div>
  );
};

export default UserCreatorPage;
