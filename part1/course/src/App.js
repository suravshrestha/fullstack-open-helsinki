import { useState } from "react";

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
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}

      <p>{allClicks.join(" ")}</p>
    </div>
  );
};

export default App;
