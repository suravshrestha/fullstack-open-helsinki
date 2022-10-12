import React from "react";
import PropTypes from "prop-types";

const Notification = ({ message }) => {
  const { error, text } = message;

  if (text) {
    return <div className={error ? "error" : "message"}>{text}</div>;
  }
};

Notification.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Notification;
