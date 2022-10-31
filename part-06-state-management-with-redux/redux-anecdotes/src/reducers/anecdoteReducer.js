import { createSlice } from "@reduxjs/toolkit";

import anecdoteService from "../services/anecdotes";

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const anecdoteSlice = createSlice({
  name: "anecdotes", // prefix which is used in the action's type values
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },

    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

// Export the action creators
export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  // asynchronous action
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes.sort((a, b) => b.votes - a.votes)));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const vote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState();

    const anecdoteToChange = anecdotes.find((a) => a.id === id);
    const changedAnecdote = await anecdoteService.update(id, {
      votes: anecdoteToChange.votes + 1,
    });

    dispatch(
      setAnecdotes(
        anecdotes.map((anecdote) =>
          anecdote.id === id ? changedAnecdote : anecdote
        )
      )
    );
  };
};

// Export the reducer
export default anecdoteSlice.reducer;
