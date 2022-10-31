import { createSlice } from "@reduxjs/toolkit";

import noteService from "../services/notes";

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const noteSlice = createSlice({
  name: "notes", // prefix which is used in the action's type values
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      // type value "notes/toggleImportanceOf"
      const id = action.payload;
      const noteToChange = state.find((n) => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      };

      return state.map((note) => (note.id !== id ? note : changedNote));
    },

    appendNote(state, action) {
      state.push(action.payload);
    },

    setNotes(state, action) {
      return action.payload;
    },
  },
});

// Export the action creators
export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions;

export const initializeNotes = () => {
  // asynchronous action
  return async (dispatch) => {
    const notes = await noteService.getAll();
    dispatch(setNotes(notes));
  };
};

export const createNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content);
    dispatch(appendNote(newNote));
  };
};

// Export the reducer
export default noteSlice.reducer;
