import { useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>
      {value} {text === "positive" ? "%" : ""}
    </td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  if (!(good || neutral || bad)) return <div>No feedback given</div>;

  return (
    <div>
      <table>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />

        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine
          text="average"
          value={(good - bad) / (good + neutral + bad)}
        />
        <StatisticLine
          text="positive"
          value={(good / (good + neutral + bad)) * 100}
        />
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGoodCount = () => setGood(good + 1);
  const increaseNeutralCount = () => setNeutral(neutral + 1);
  const increaseBadCount = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={increaseGoodCount} text="good" />
      <Button handleClick={increaseNeutralCount} text="neutral" />
      <Button handleClick={increaseBadCount} text="bad" />

      <h1>statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
