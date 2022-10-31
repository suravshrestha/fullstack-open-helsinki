import { connect } from "react-redux";

const Notification = (props) => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };

  return props.notification && <div style={style}>{props.notification}</div>;
};

const mapStateToProps = (state) => {
  // "Do not" mutate state here, only return a piece of the state
  return {
    notification: state.notification,
  };
};

export default connect(mapStateToProps, null)(Notification);
