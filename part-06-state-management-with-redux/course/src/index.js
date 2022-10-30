import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";

import noteReducer from "./reducers/noteReducer";

// Create a Redux store holding the state of the app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(noteReducer);

const generateId = () => Number((Math.random() * 1000000).toFixed(0));

const App = () => {
  const addNote = (event) => {
    event.preventDefault();
    const content = event.target.note.value; // <input name="note" />
    event.target.note.value = "";
    store.dispatch({
      type: "NEW_NOTE",
      data: {
        content,
        important: false,
        id: generateId(),
      },
    });
  };

  const toggleImportance = (id) => {
    store.dispatch({
      type: "TOGGLE_IMPORTANCE",
      data: { id },
    });
  };

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map((note) => (
          <li key={note.id} onClick={() => toggleImportance(note.id)}>
            {note.content} <strong>{note.important ? "important" : ""}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () => root.render(<App />);

renderApp();

// store calls the callback function(renderApp) whenever
// an action is dispatched to the store.
store.subscribe(renderApp);
