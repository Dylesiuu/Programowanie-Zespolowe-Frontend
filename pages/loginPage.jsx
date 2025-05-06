'use client';
import { useContext, useEffect } from 'react';
import LoginForm from '../src/login/components/LoginForm';
import styles from '../src/styles/registerPage.module.css';
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
    <div className={styles.registerPageContainer}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
