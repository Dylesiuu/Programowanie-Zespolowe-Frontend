import React, { useState } from "react";
import styles from "../../register/Register.module.css";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = "Email jest wymagany.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Nieprawidłowy format adresu e-mail.";
    if (!password) newErrors.password = "Hasło jest wymagane.";

    setErrors(newErrors);
    if(Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        await router.replace("/swipePage");
      } else {
        if(response.status === 401 || response.status === 409) {
          setErrors({
            global: "Złe dane logowania.",
          });
        }
      }
    } catch (error) {
      setErrors({
        global: "Wystąpił problem z połączeniem. Spróbuj ponownie później.",
      });
    }
  };

  return (
      <div className={styles.registerFormContainer}>
        <div className={styles.headerContainer}>
          <h1 className={styles.title}>PETFINITY</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.registerform} noValidate>
          <h1 className={styles.headerRegister}>Zaloguj się!</h1>

          <div className={styles.userInfoInput}>
            <input
                className={styles.userInput}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="off"
            />
            {errors.email && (
                <p className={styles.errorMessage}>{errors.email}</p>
            )}
          </div>
          <div className={styles.userInfoInput}>
            <input
                className={styles.userInput}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
                autoComplete="new-password"
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>
          <button className={styles.registerButton} type="submit">
            Zaloguj się
          </button>
          {errors.global && <p className={styles.errorMessage}>{errors.global}</p>}
        </form>
      </div>
  );
};

export default LoginForm;