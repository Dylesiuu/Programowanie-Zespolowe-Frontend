import React from "react";
import styles from "../Profile.module.css";

const ProfileTags = ({ tags }) => {
  return (
    <div className={styles.profileTags}>
      <div className={styles.profileTile}>
        <h2>Tagi</h2>
      </div>
      <div className={styles.tagsListContainer}>
        {" "}
        {}
        {Object.keys(tags).map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            <ul>
              {tags[category].map((tag, index) => (
                <li className={styles.singleTagContainer} key={index}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileTags;
