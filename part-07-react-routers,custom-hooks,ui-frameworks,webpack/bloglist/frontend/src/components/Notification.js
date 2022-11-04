import React from "react";
import { useSelector } from "react-redux";
import Alert from "react-bootstrap/Alert";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  if (!notification) {
    return null;
  }

  return (
    <Alert
      id="notification"
      className="mt-3"
      variant={notification.error ? "danger" : "success"}
    >
      {notification.msg}
    </Alert>
  );
};

export default Notification;
