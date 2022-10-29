const Notification = ({ message }) => {
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const infoStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message) {
    return (
      <div className="msg" style={message.error ? errorStyle : infoStyle}>
        {message.text}
      </div>
    );
  }
};

export default Notification;
