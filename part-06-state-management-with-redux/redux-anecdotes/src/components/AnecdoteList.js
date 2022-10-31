import { useSelector, useDispatch } from "react-redux";

import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes} <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    // "Do not" mutate state here, only return a piece of the state
    if (!filter) {
      return anecdotes;
    }

    const regex = new RegExp(filter, "i");
    return anecdotes.filter((anecdote) => anecdote.content.match(regex));
  });

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(vote(anecdote.id));
            dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
          }}
        />
      ))}
    </div>
  );
};

export default AnecdoteList;
