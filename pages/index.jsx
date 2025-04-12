import React from "react";
import styles from "../src/styles/index.module.css";
import Link from "next/link";
import Image from "next/image";
import img from "../public/img/mainPagePic.png";
import googleLogo from "../public/img/google.png";

const MainPage = () => {
  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.navbar}>
        <h1 className={styles.logo}>Petfinity</h1>
        <div className={styles.navButtons}>
          <Link href="/loginPage" className={styles.loginButton}>Zaloguj się</Link>
          <Link href="/registerPage" className={styles.registerButton}>Zarejestruj się</Link>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>Adoptuj przyjaciela na całe życie</h2>
          <p className={styles.description}>
          Dzięki Petfinity łatwiej odnajdziesz futrzastego przyjaciela idealnie dopasowanego do Twoich preferencji.
          </p>
          <button className={styles.googleButton}>
            <Image src={googleLogo} alt="Google icon" className={styles.googleIcon} />
            Zaloguj się z Google
          </button>
        </div>

        <div className={styles.imageContainer}>
          <Image src={img} alt="dziewczyna ze zwierzakami" className={styles.illustration} />
        </div>
      </div>
      <div className={styles.aboutSection} id="about">
        <div className={styles.aboutTextSection}>
            <h2 className={styles.aboutTitle}>Poznaj Petfinity</h2>
            <p className={styles.aboutParagraph}>
                Petfinity powstało z miłości do zwierząt i potrzeby tworzenia prawdziwych, wartościowych relacji między ludźmi a ich przyszłymi pupilami.
            </p>
            <p className={styles.aboutParagraph}>
                Naszą misją jest uproszczenie procesu adopcji, tak by był on bardziej przemyślany i lepiej dopasowany do Twoich potrzeb oraz stylu życia. Wierzymy, że każde zwierzę zasługuje na kochający dom, a każda osoba — na wiernego towarzysza.
            </p>
            <p className={styles.aboutParagraph}>
                Dzięki naszemu zaawansowanemu systemowi dopasowań oraz intuicyjnemu interfejsowi możesz z łatwością przeglądać profile zwierząt i znajdować tych pupili, którzy najlepiej odpowiadają Twoim oczekiwaniom i możliwościom.
            </p>
            <p className={styles.aboutParagraphLast}>
                Nasza platforma to dopiero początek — budujemy przestrzeń, która z czasem stanie się centrum adopcji pełnym empatii, zaufania i radości ze wspólnego życia.
            </p>

            <Link href="/registerPage" className={styles.aboutButton}>Dołącz do Petfinity</Link>
        </div>

        <div className={styles.aboutImageContainer}>
            <div className={styles.aboutImageSection}>
                <img src="https://media1.tenor.com/m/EE6KCl3SJ5gAAAAC/%D9%83%D8%B3%D9%85%D9%83-cats.gif" alt="kotek" />

            </div>

            <div className={styles.mission}>
            <p><strong>Nasza misja:</strong><br />Chcemy sprawić, aby proces adopcji był łatwy, świadomy i pełen miłości 🧡</p>
            <p><strong>Nasze wartości:</strong></p>
            <ul className={styles.valuesList}>
                <li>🐶 Empatia</li>
                <li>🤝 Zaufanie</li>
                <li>🧡 Odpowiedzialność</li>
                <li>🧍‍♀️ Partnerstwo</li>
            </ul>
            </div>
        </div>
    </div>

    </div>
  );
};

export default MainPage;
