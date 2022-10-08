import axios from "axios";
import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import Content from "./components/Content";

const App = () => {
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        setCountries(res.data);
      })
      .catch((err) => {
        setCountries([]);
      });
  }, []);

  useEffect(() => {
    if (!filter) {
      return setCountriesToShow([]);
    }

    setCountriesToShow(
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <Filter value={filter} onChange={handleFilterChange} />

      <Content countries={countriesToShow} setCountries={setCountriesToShow} />
    </div>
  );
};

export default App;
