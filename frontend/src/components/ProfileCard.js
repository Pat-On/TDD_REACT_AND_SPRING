import React from "react";
import defaultPicture from "../assets/profile.png";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const ProfileCard = (props) => {
  const { displayName, username, image } = props.user;

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
        {props.isEditable && (
          <button className="btn btn-outline-success">
            <i className="fas fa-user-edit" /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
