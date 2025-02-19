import React from "react";
import styles from "../Profile.module.css";

const ProfileNews = ({ news }) => {
  return (
    <div className={styles.profileTile}>
      <h2>Aktualności</h2>
      <div className={styles.profileNews}>
        <p>{news}</p>
      </div>
    </div>
  );
};

export default ProfileNews;
