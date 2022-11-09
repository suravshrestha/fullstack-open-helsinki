import React from "react";
import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

const Togglable = forwardRef((props, ref) => {
  // forwardRef allows this component to access the ref that is assigned for it
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // useImperativeHandle hook is used for defining functions in a component
  // which can be invoked from outside of the component.
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div className="mb-5">
      <span style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </span>
      <span style={showWhenVisible}>
        {props.children} {/* children of component Togglable */}
        <Button variant="warning" onClick={toggleVisibility}>
          cancel
        </Button>
      </span>
    </div>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default Togglable;
