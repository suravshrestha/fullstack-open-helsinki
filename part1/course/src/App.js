import { useState } from "react";

const App = () => {
  // counter is assigned the initial value of state which is 0
  // setCounter is assigned to a function that will be used to modify the state
  const [counter, setCounter] = useState(0);

  const increaseByOne = () => setCounter(counter + 1);

  const setToZero = () => setCounter(0);

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>plus</button>
      <button onClick={setToZero}>zero</button>
    </div>
  );
};

export default App;
