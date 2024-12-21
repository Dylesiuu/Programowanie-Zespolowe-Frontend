import { useState } from "react";
import styles from "../Register.module.css";
import { useRouter } from "next/router";


const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const passwordRequirements =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRequirements.test(password)) {
      setMessage(
        "Hasło musi mieć co najmniej 12 znaków, zawierać co najmniej jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Hasła muszą być takie same!");
      return;
    }

    const userData = { name, lastname, email, password };

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // navigate("/SwipePage"); //sprawdzic czy jest ok
        setMessage("Rejestacja powiodła się!");
        await router.replace("/loginPage");
        
      } else {
        const errorData = await response.json();
        setMessage(
          `Błąd: ${errorData.message || "Wystąpił problem podczas rejestracji"}`
        );
      }
    } catch (error) {
      setMessage("Wystąpił problem z połączeniem. Spróbuj ponownie później.");
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.registerFormContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>PETFINITY</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.registerform}>
        <h1 className={styles.headerRegister}>Zarejestruj się!</h1>
        <div className={styles.nameAndLastnameInput}>
          <input
            className={styles.userNamesInput}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Imię"
          />
          <input
            className={styles.userNamesInput}
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            placeholder="Nazwisko"
          />
        </div>
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
        <div className={styles.userInfoInput}>
          <input
            className={styles.userInput}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Powtórz hasło"
            autoComplete="new-password"
          />
        </div>
        <button className={styles.registerButton} type="submit">
          Zarejestruj
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
