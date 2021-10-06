/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import defaultPicture from "../assets/profile.png";

const ProfileImageWithDefault = (props) => {
  let imageSource = defaultPicture;
  if (props.image) {
    imageSource = `/images/profile/${props.image}`;
  }
  //   console.log(props.src);
  return (
    <div>
      <img
        {...props}
        src={props.src ? props.src : imageSource}
        // src={props.src}
        onError={(event) => {
          event.target.src = defaultPicture;
        }}
      />
    </div>
  );
};

export default ProfileImageWithDefault;
