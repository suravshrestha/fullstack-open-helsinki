import { useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Anecdote = ({ text, votes }) => (
  <div>
    {text}
    <br />
    has votes {votes}
  </div>
);

const AnecdoteWithMostVotes = ({ anecdotes }) => {
  let mostVotes = 0;
  let mostVotedAnecdote = anecdotes[0];

  for (const anecdote of anecdotes) {
    if (anecdote.votes > mostVotes) {
      mostVotes = anecdote.votes;
      mostVotedAnecdote = anecdote;
    }
  }

  return (
    <Anecdote text={mostVotedAnecdote.text} votes={mostVotedAnecdote.votes} />
  );
};

const App = () => {
  const [selected, setSelected] = useState(0);

  const [anecdotes, setAnecdotes] = useState([
    { text: "If it hurts, do it more often.", votes: 0 },
    {
      text: "Adding manpower to a late software project makes it later!",
      votes: 0,
    },
    {
      text: "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      votes: 0,
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      votes: 0,
    },
    { text: "Premature optimization is the root of all evil.", votes: 0 },
    {
      text: "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
      votes: 0,
    },
    {
      text: "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
      votes: 0,
    },
  ]);

  const getRandomAnecdote = () =>
    setSelected(Math.floor(Math.random() * anecdotes.length));

  const incrementVote = (selected) => {
    let copy = [...anecdotes];
    copy[selected].votes += 1;

    setAnecdotes(copy);
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote
        text={anecdotes[selected].text}
        votes={anecdotes[selected].votes}
      />

      <Button handleClick={() => incrementVote(selected)} text="vote" />
      <Button handleClick={getRandomAnecdote} text="next anecdote" />

      <h1>Anecdote with most votes</h1>
      <AnecdoteWithMostVotes anecdotes={anecdotes} />
    </div>
  );
};

export default App;
