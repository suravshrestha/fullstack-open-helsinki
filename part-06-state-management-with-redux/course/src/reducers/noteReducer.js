const noteReducer = (state = [], action) => {
  switch (action.type) {
    case "NEW_NOTE":
      // Incorrect: Reducer must not directly mutate the state
      // Docs: https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers
      // state.push(action.data);
      // return state;

      // OK
      // return state.concat(action.data);

      // With spread operator
      return [...state, action.data];

    case "TOGGLE_IMPORTANCE": {
      const id = action.data.id;
      const noteToChange = state.find((n) => n.id === id);
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important,
      };
      return state.map((note) => (note.id !== id ? note : changedNote));
    }
    default:
      return state;
  }
};

export default noteReducer;
