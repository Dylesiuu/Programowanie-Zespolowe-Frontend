import React, { useContext, useEffect } from 'react';
import RegisterForm from '../src/register/components/RegisterForm';
import styles from '../src/styles/registerPage.module.css';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const RegisterPage = () => {
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
      <RegisterForm userContext={userContext} />
    </div>
  );
};

export default RegisterPage;
