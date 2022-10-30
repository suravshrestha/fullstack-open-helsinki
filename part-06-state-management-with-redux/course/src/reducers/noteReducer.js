import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    content: "reducer defines how redux store works",
    important: true,
    id: 1,
  },
  {
    content: "state of store can contain any data",
    important: false,
    id: 2,
  },
];

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

// returns an object containing the reducer as well as
// the action creators defined by the reducers parameter.
const noteSlice = createSlice({
  name: "notes", // prefix which is used in the action's type values
  initialState,
  reducers: {
    createNote(state, action) {
      // type value "notes/createNote"
      const content = action.payload; // argument provided by calling the action creator

      // With Redux, this is incorrect as reducer should not directly mutate the state
      // but Redux Toolkit uses Immer library which makes it possible to mutate the
      // state arg inside the reducer
      state.push({
        content,
        important: false,
        id: generateId(),
      });
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
  },
});

// Export the action creators
export const { createNote, toggleImportanceOf } = noteSlice.actions;

// Export the reducer
export default noteSlice.reducer;
