import { useState } from "react";

const Display = ({ counter }) => <div>{counter}</div>;
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  // counter is assigned the initial value of state which is 0
  // setCounter is assigned to a function that will be used to modify the state
  const [counter, setCounter] = useState(0);

  const increaseByOne = () => setCounter(counter + 1);
  const decreaseByOne = () => setCounter(counter - 1);
  const setToZero = () => setCounter(0);

  return (
    <div>
      <Display counter={counter} />

      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  );
};

export default App;
