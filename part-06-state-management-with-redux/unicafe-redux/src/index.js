import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from "redux";
import counterReducer from "./reducers/counterReducer";

const counterStore = createStore(counterReducer);

const App = () => {
  const good = () => {
    counterStore.dispatch({
      type: "GOOD",
    });
  };

  const ok = () => {
    counterStore.dispatch({
      type: "OK",
    });
  };

  const bad = () => {
    counterStore.dispatch({
      type: "BAD",
    });
  };

  const reset = () => {
    counterStore.dispatch({
      type: "ZERO",
    });
  };

  return (
    <div>
      <button onClick={good}>good</button>
      <button onClick={ok}>ok</button>
      <button onClick={bad}>bad</button>
      <button onClick={reset}>reset stats</button>

      <div>good {counterStore.getState().good}</div>
      <div>ok {counterStore.getState().ok}</div>
      <div>bad {counterStore.getState().bad}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () => {
  root.render(<App />);
};

renderApp();
counterStore.subscribe(renderApp);
