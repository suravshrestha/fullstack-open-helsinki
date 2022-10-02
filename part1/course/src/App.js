import { useState } from "react";

const App = () => {
  // clicks is assigned the initial value of state which is the object { left: 0, right: 0 }
  // setClicks is assigned to a function that will be used to modify the state
  const [clicks, setClicks] = useState({ left: 0, right: 0 });

  const handleLeftClick = () => setClicks({ ...clicks, left: clicks.left + 1 });

  const handleRightClick = () =>
    setClicks({ ...clicks, right: clicks.right + 1 });

  return (
    <div>
      {clicks.left}

      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>

      {clicks.right}
    </div>
  );
};

export default App;
