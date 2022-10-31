import { createSlice } from "@reduxjs/toolkit";

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const noteSlice = createSlice({
  name: "notes", // prefix which is used in the action's type values
  initialState: [],
  reducers: {
    createNote(state, action) {
      // type value "notes/createNote"
      // action.payload is the argument provided when calling the action creator

      // With Redux, this is incorrect as reducer should not directly mutate the state
      // but Redux Toolkit uses Immer library which makes it possible to mutate the
      // state arg inside the reducer
      state.push(action.payload);
    },

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
export const { createNote, toggleImportanceOf, appendNote, setNotes } =
  noteSlice.actions;

// Export the reducer
export default noteSlice.reducer;
