import React, { useContext, useEffect } from 'react';
import AdminPanel from '@/admin/components/adminPanel';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const ShelterProfilePage = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (userContext.isLoggedIn()) {
      return;
    }

    router.replace('/');
  }, [router, userContext]);

  return (
    <div className="m-0 p-0 h-[100vh] w-[100vw] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-[#FFF0E9]">
      <AdminPanel />
    </div>
  );
};

export default ShelterProfilePage;
