import Country from "./Country";

const Content = ({ countries, setCountries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 0) {
    return;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  return (
    <div>
      {countries.map((country, idx) => (
        <div key={idx}>
          <li>{country.name.common}</li>{" "}
          <button onClick={() => setCountries([country])}>show</button>
        </div>
      ))}
    </div>
  );
};

export default Content;
