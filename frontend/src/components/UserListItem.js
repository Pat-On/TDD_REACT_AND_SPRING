import React from "react";
import defaultPicture from "../assets/profile.png";
import { Link } from "react-router-dom";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const UserListItem = (props) => {
  let imageSource = defaultPicture;
  // if (props.user.image) {
  //   imageSource = `/images/profile/${props.user.image}`;
  // }

  return (
    <Link
      to={`/${props.user.username}`}
      className="list-group-item list-group-item-action"
      key={props.user.username}
    >
      <ProfileImageWithDefault
        className="rounded-circle"
        alt="profile"
        width="32"
        height="32"
        image={props.user.image}
      />
      <span className="pl-2">{`${props.user.displayName}@${props.user.username}`}</span>
    </Link>
  );
};
export default UserListItem;
