import React from 'react';
import LoginForm from '../src/login/components/LoginForm';
import styles from '../src/styles/registerPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.registerPageContainer}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
