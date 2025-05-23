import { useContext, useEffect, useState } from 'react';
import LoginForm from '../src/login/components/LoginForm';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import LoggedUser from '../src/login/components/loggedUser';

const LoginPage = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!userContext.isLoggedIn()) {
      return;
    }
    setIsLoggedIn(true);

    const timeout = setTimeout(() => {
      router.replace('/swipePage');
    }, 500); // Wait for 0.5 seconds (500 milliseconds)

    return () => clearTimeout(timeout);
  }, [router, userContext]);

  return (
    <div className="m-0 p-0 h-[100vh] w-[100vw] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-[#FFF0E9]">
      {isLoggedIn ? <LoggedUser /> : <LoginForm />}
    </div>
  );
};

export default LoginPage;
