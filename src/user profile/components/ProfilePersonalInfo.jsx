import React from "react";
import styles from "../Profile.module.css";

const ProfilePersonalInfo = ({ user }) => {
  return (
    <div className={styles.profilePersonalInfo}>
      <div className={styles.profilePicAndName}>
        <img src={user.avatar} alt="avatar" className={styles.profilePic} />
        <h2>{user.name}</h2>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.profileInfoItem}>
          <p className={styles.profileInfoItemLabel}>
            Miasto: {user.city || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
