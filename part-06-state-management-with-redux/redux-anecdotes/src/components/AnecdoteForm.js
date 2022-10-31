import { connect } from "react-redux";

import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = (props) => {
  const addAnecdote = (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    props.createAnecdote(content);

    props.setNotification(`new anecdote '${content}'`, 5);
  };

  return (
    <form onSubmit={addAnecdote}>
      <h2>create new</h2>
      <div>
        <input name="anecdote" />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAnecdote: (content) => {
      dispatch(createAnecdote(content));
    },

    setNotification: (notification, timeoutInSeconds) => {
      dispatch(setNotification(notification, timeoutInSeconds));
    },
  };
};

export default connect(null, mapDispatchToProps)(AnecdoteForm);
