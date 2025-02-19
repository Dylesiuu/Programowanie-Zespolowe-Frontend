import React, { useState } from "react";
import styles from "../src/user profile/Profile.module.css";
import ProfileHeader from "../src/user profile/components/ProfileHeader";
import ProfileAbout from "../src/user profile/components/ProfileAbout";
import ProfileTags from "../src/user profile/components/ProfileTags";
import ProfileNews from "../src/user profile/components/ProfileNews";
import ProfilePersonalInfo from "../src/user profile/components/ProfilePersonalInfo";
import mockUserData from "../src/user profile/mockUserData";
import "normalize.css/normalize.css";

const UserProfile = () => {
  const [userData] = useState(mockUserData);

  return (
    <div className={styles.pageBackground}>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileCardUser}>
            <ProfilePersonalInfo user={userData} />
          </div>
        </div>
        <div className={styles.profileCard}>
          <ProfileAbout about={userData.about} />
        </div>
        <div className={styles.profileCard}>
          <ProfileTags tags={userData.tags} />
        </div>
        <div className={styles.profileCard}>
          <ProfileNews />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
