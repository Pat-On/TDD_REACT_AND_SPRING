import React from "react";

const Input = (props) => {
  let inputClassName = "form-control";

  if (props.hasError === false) {
    inputClassName += " is-valid";
  }
  if (props.hasError === true) {
    inputClassName += " is-invalid";
  }

  return (
    <div>
      {props.label && <label>{props.label}</label>}
      <input
        className={inputClassName}
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      {props.hasError && (
        <span className="invalid-feedback">{props.error}</span>
      )}
    </div>
  );
};

Input.defaultProps = {
  onChange: () => {},
};

export default Input;
