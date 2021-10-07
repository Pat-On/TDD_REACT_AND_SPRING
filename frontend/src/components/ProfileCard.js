import React from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import Input from "./input";
import ButtonWithProgress from "./ButtonWithProgress";

const ProfileCard = (props) => {
  const { displayName, username, image } = props.user;

  const showEditButton = props.isEditable && !props.inEditMode;

  return (
    <div className="card">
      <div className="card-header text-center">
        <ProfileImageWithDefault
          alt="profile"
          width="200"
          height="200"
          src={props.loaderImage}
          className="rounded-circle shadow"
          image={image}
        />
      </div>
      <div className="card-body text-center">
        {!props.inEditMode && <h4>{`${displayName}@${username}`}</h4>}
        {props.inEditMode && (
          <div className="mb-2">
            <Input
              value={displayName}
              label={`Change Display Name for ${username}`}
              onChange={props.onChangeDisplayName}
            />
            <input
              className="form-control-file mt-2"
              type="file"
              onChange={props.onFileSelect}
            />
          </div>
        )}
        {showEditButton && (
          <button
            className="btn btn-outline-success"
            onClick={props.onClickEdit}
          >
            <i className="fas fa-user-edit" /> Edit
          </button>
        )}
        {props.inEditMode && (
          <>
            <ButtonWithProgress
              className="btn btn-primary"
              onClick={props.onClickSave}
              pendingApiCall={props.pendingUpdateCall}
              disabled={props.pendingUpdateCall}
              text={
                <span>
                  <i className="fas fa-save" /> Save
                </span>
              }
            />
            <button
              className="btn btn-outline-secondary ml-1"
              onClick={props.onClickCancel}
              disabled={props.pendingUpdateCall}
            >
              <i className="fas fa-window-close" /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
