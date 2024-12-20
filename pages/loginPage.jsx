import React, { useEffect } from "react";
import LoginForm from "../src/login/components/LoginForm";
import styles from "../src/styles/registerPage.module.css";

const LoginPage = () => {
  useEffect(() => {
    document.body.style.margin = "0";

    return () => {
      document.body.style.margin = "";
    };
  }, []);

  return (
    <div className={styles.registerPageContainer}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
