import React from "react";
import defaultPicture from "../assets/profile.png";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const ProfileCard = (props) => {
  const { displayName, username, image } = props.user;

  let imageSource = defaultPicture;
  if (image) {
    imageSource = "/images/profile/" + image;
  }

  return (
    <div className="card">
      <div className="card-header text-center">
        <ProfileImageWithDefault
          alt="profile"
          width="200"
          height="200"
          className="rounded-circle shadow"
          image={image}
        />
      </div>
      <div className="card-body text-center">
        <h4>{`${displayName}@${username}`}</h4>
      </div>
    </div>
  );
};

export default ProfileCard;
