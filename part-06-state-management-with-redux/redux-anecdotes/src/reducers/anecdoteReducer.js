import { createSlice } from "@reduxjs/toolkit";

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const anecdoteSlice = createSlice({
  name: "anecdotes", // prefix which is used in the action's type values
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      // type value "anecdotes/createAnecdote"
      // action.payload is the argument provided when calling the action creator

      // With Redux, this is incorrect as reducer should not directly mutate the state
      // but Redux Toolkit uses Immer library which makes it possible to mutate the
      // state arg inside the reducer
      state.push(action.payload);
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

    appendAnecdote(state, action) {
      state.push(action.payload);
    },

    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

// Export the action creators
export const { createAnecdote, vote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

// Export the reducer
export default anecdoteSlice.reducer;
