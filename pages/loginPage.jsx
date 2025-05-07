'use client';
import { useContext, useEffect } from 'react';
import LoginForm from '../src/login/components/LoginForm';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!userContext.isLoggedIn()) {
      return;
    }

    router.replace('/swipePage');
  }, [router, userContext]);

  return (
    <div className="m-0 p-0 h-[100vh] w-[100vw] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-[#FFF0E9]">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
