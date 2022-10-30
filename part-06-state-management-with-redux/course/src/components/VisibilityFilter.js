import { filterChange } from "../reducers/filterReducer";
import { useDispatch } from "react-redux";

const VisibilityFilter = (props) => {
  const dispatch = useDispatch();

  return (
    // Since the name attribute of all the radio buttons is the same,
    // they form a button group where only one option can be selected.
    <div>
      <div>
        all
        <input
          type="radio"
          name="filter"
          onChange={() => dispatch(filterChange("ALL"))}
        />
      </div>

      <div>
        important
        <input
          type="radio"
          name="filter"
          onChange={() => dispatch(filterChange("IMPORTANT"))}
        />
      </div>

      <div>
        nonimportant
        <input
          type="radio"
          name="filter"
          onChange={() => dispatch(filterChange("NONIMPORTANT"))}
        />
      </div>
    </div>
  );
};

export default VisibilityFilter;
