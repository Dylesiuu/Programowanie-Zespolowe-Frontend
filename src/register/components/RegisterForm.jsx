import React, { useState } from "react";
import styles from "../Register.module.css";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const passwordRequirements =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) newErrors.name = "Imię jest wymagane.";
    if (!lastname) newErrors.lastname = "Nazwisko jest wymagane.";
    if (!email) newErrors.email = "Email jest wymagany.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Nieprawidłowy format adresu e-mail.";
    if (!password) newErrors.password = "Hasło jest wymagane.";
    if (!confirmPassword) newErrors.confirmPassword = "Powtórz hasło.";


    if (password && !passwordRequirements.test(password)) {
      newErrors.password =
        "Hasło musi mieć co najmniej 12 znaków, zawierać dużą literę, cyfrę i znak specjalny.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Hasła muszą być takie same!";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;


    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastname, email, password }),
      });
      if (response.ok) {
        await router.replace("/loginPage");
      } else if (response.status === 409) {
          setErrors({
            global: "Dany email jest już zajęty.",
          });
        }
        else {
          setErrors({
            global: "Wystąpił problem podczas rejestracji.",
          });
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
        <h1 className={styles.headerRegister}>Zarejestruj się!</h1>
        <div className={styles.nameAndLastnameInput}>
          <div className={styles.userNameContainer}>
            <input
              className={styles.userNamesInput}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Imię"
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name}</p>
            )}
          </div>
          <div className={styles.userNameContainer}>
            <input
              className={styles.userNamesInput}
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Nazwisko"
            />
            {errors.lastname && (
              <p className={styles.errorMessage}>{errors.lastname}</p>
            )}
          </div>
        </div>
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
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password}</p>
          )}
        </div>
        <div className={styles.userInfoInput}>
          <input
            className={styles.userInput}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Powtórz hasło"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>{errors.confirmPassword}</p>
          )}
        </div>
        <button className={styles.registerButton} type="submit">
          Zarejestruj
        </button>
        {errors.global && (
            <p className={styles.errorMessage}>{errors.global}</p>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
