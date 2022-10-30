import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";

import noteReducer from "./reducers/noteReducer";
import counterReducer from "./reducers/counterReducer";

// Create a Redux store holding the state of the app.
// Its API is { subscribe, dispatch, getState }.
const noteStore = createStore(noteReducer);

const counterStore = createStore(counterReducer);

noteStore.dispatch({
  type: "NEW_NOTE",
  data: {
    content: "the app state is in redux store",
    important: true,
    id: 1,
  },
});

noteStore.dispatch({
  type: "NEW_NOTE",
  data: {
    content: "state changes are made with actions",
    important: false,
    id: 2,
  },
});

const App = () => {
  return (
    <div>
      <ul>
        {noteStore.getState().map((note) => (
          <li key={note.id}>
            {note.content} <strong>{note.important ? "important" : ""}</strong>
          </li>
        ))}
      </ul>

      <div>{counterStore.getState()}</div>

      <div>
        {/* Mutate the internal state using dispatch */}
        <button onClick={(e) => counterStore.dispatch({ type: "INCREMENT" })}>
          plus
        </button>
        <button onClick={(e) => counterStore.dispatch({ type: "DECREMENT" })}>
          minus
        </button>
        <button onClick={(e) => counterStore.dispatch({ type: "ZERO" })}>
          zero
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () => root.render(<App />);

renderApp();

// store calls the callback function(renderApp) whenever
// an action is dispatched to the store.
noteStore.subscribe(renderApp);
counterStore.subscribe(renderApp);
