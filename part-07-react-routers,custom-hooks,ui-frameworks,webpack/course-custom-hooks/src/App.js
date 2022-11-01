import { useCounter, useField } from "./hooks";

const Counter = () => {
  const counter = useCounter();

  return (
    <div>
      <div>Count: {counter.value}</div>
      <button onClick={counter.increase}>+</button>{" "}
      <button onClick={counter.decrease}>-</button>{" "}
      <button onClick={counter.zero}>0</button>
    </div>
  );
};

const Form = () => {
  const username = useField("text");
  const password = useField("password");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(username.value, password.value);
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type={username.type}
          value={username.value}
          onChange={username.onChange}
        />
      </div>

      <div>
        <label htmlFor="password">Password: </label>
        {/* spread attributes */}
        <input id="password" {...password} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

function App() {
  return (
    <div>
      <h2>Counter:</h2>
      <Counter />

      <h2>Login form:</h2>
      <Form />
    </div>
  );
}

export default App;
