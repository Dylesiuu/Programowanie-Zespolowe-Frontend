import React from "react";
import RegisterForm from "../src/register/components/RegisterForm";
import styles from "../src/styles/registerPage.module.css";

const RegisterPage = () => {
  return (
    <div className={styles.registerPageContainer}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
