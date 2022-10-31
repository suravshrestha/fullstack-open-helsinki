import { createSlice } from "@reduxjs/toolkit";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const anecdoteSlice = createSlice({
  name: "anecdotes", // prefix which is used in the action's type values
  initialState,
  reducers: {
    createAnecdote(state, action) {
      // type value "anecdotes/createAnecdote"
      const content = action.payload; // argument provided by calling the action creator

      // With Redux, this is incorrect as reducer should not directly mutate the state
      // but Redux Toolkit uses Immer library which makes it possible to mutate the
      // state arg inside the reducer
      state.push({
        content,
        id: getId(),
        votes: 0,
      });
    },

    vote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      return state
        .map((anecdote) => (anecdote.id === id ? changedAnecdote : anecdote))
        .sort((a, b) => b.votes - a.votes);
    },
  },
});

// Export the action creators
export const { createAnecdote, vote } = anecdoteSlice.actions;

// Export the reducer
export default anecdoteSlice.reducer;
