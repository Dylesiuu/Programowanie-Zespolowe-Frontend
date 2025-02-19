import React from "react";
import styles from "../Profile.module.css";

const ProfileAbout = ({ about }) => {
  return (
    <div className={styles.profileTile}>
      <h2>O Mnie</h2>
      <div className={styles.profileAbout}>
        <p>{about}</p>
      </div>
    </div>
  );
};

export default ProfileAbout;
