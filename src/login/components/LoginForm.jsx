import { useState } from "react";
import styles from "../../register/Register.module.css";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Hasła muszą być takie same!");
      return;
    }

    const userData = { email, password };

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/SwipePage"); //sprawdzic czy jest ok
      } else {
        const errorData = await response.json();
        setMessage(
          `Błąd: ${errorData.message || "Wystąpił problem podczas logowania"}`
        );
      }
    } catch {
      setMessage("Wystąpił problem z połączeniem. Spróbuj ponownie później.");
    }
  };

  return (
    <div className={styles.registerFormContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>PETFINITY</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.registerform}>
        <h1 className={styles.headerRegister}>Zaloguj się!</h1>
        <div className={styles.userInfoInput}>
          <input
            className={styles.userInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            autoComplete="off"
          />
        </div>
        <div className={styles.userInfoInput}>
          <input
            className={styles.userInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Hasło"
            autoComplete="new-password"
          />
        </div>
        <button className={styles.registerButton} type="submit">
          Zaloguj się
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;