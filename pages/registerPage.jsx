import React, { useEffect } from "react";
import RegisterForm from "../src/register/components/RegisterForm";
import styles from "../src/styles/registerPage.module.css";
import "normalize.css/normalize.css";

const RegisterPage = () => {
  useEffect(() => {
    document.body.style.margin = "0";

    return () => {
      document.body.style.margin = "";
    };
  }, []);
  return (
    <div className={styles.registerPageContainer}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
