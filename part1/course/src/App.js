import { useState } from "react";

const History = ({ allClicks }) => {
  if (allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>;
  }

  return <div>button press history: {allClicks.join(" ")}</div>;
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // allClicks is assigned the initial value of state which is empty array []
  // setAll is assigned to a function that will be used to modify the state
  const [allClicks, setAll] = useState([]);

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"));
    setLeft(left + 1);
  };

  const handleRightClick = () => {
    setAll(allClicks.concat("R"));
    setRight(right + 1);
  };

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text="left" />
      <Button handleClick={handleRightClick} text="right" />
      {right}

      <History allClicks={allClicks} />
    </div>
  );
};

export default App;
