import React, { useState } from "react";
import PropTypes from "prop-types";

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert }) => {
  const [inputValue, setInputValue] = useState(32);

  const handleInputChanged = (event) => {
    const value = parseInt(event.target.value, 10);
    setInputValue(value);
    if (value < 1 || isNaN(value)) {
      setErrorAlert("Please enter a valid number (1 or more).");
    } else {
      setErrorAlert("");
      setCurrentNOE(value);
    }
  };

  return (
    <div>
      <label htmlFor="number-of-events">Number of Events:</label>
      <input
        id="number-of-events"
        type="number"
        value={inputValue}
        onChange={handleInputChanged}
      />
    </div>
  );
};

NumberOfEvents.propTypes = {
  setCurrentNOE: PropTypes.func.isRequired,
  setErrorAlert: PropTypes.func.isRequired,
};

export default NumberOfEvents;
