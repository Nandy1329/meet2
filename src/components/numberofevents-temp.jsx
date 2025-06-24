import React, { useState } from 'react';

const NumberOfEvents = ({ setCurrentNOE, setErrorAlert }) => {
  const [eventNumber, setEventNumber] = useState(32);

  const handleInputChange = (event) => {
    const value = Number(event.target.value); // Convert input to number
    setEventNumber(value);

    let infoText;
    if (value < 1) {
      infoText = "The number of events needs to be higher than 0";
    } else if (isNaN(event.target.value)) {
      infoText = "The input needs to be a number";
    } else {
      infoText = "";
      setCurrentNOE(value);
    }
    setErrorAlert(infoText);
  };

  return (
    <div id="number-of-events">
      <label htmlFor="events-num">Number of Events:</label>
      <input
        type="number"
        id="events-num"  // 👈 Make sure this matches htmlFor in <label>
        className="events-num"
        role="textbox"
        value={eventNumber}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default NumberOfEvents;