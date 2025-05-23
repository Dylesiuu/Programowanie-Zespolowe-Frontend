import React, { useContext, useEffect } from 'react';
import UserBasicInfoUpload from '@/detailcreator/components/userBasicInfoUpload';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const UserCreatorPage = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const { isNew } = router.query;

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  return (
    <div className="min-h-screen bg-[#FFF0E9] bg-[url('/cats.svg')] bg-repeat bg-[length:150rem_100rem] bg-fixed pt-26">
      <UserBasicInfoUpload isNew={isNew} />
    </div>
  );
};

export default UserCreatorPage;
