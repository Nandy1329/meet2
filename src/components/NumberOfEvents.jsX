import React, { useState } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
  const [numberOfEvents, setNumberOfEvents] = useState(currentNOE);

  const handleInputChanged = (event) => {
    const value = event.target.value;

    if (isNaN(value) || value < 0) {
      setErrorAlert('Please enter a valid number.');
      return;
    } else if (value > 32) {
      setErrorAlert('Please enter a number less than or equal to 32.');
      return;
    } else {
      setErrorAlert('');
      setCurrentNOE(value);
      setNumberOfEvents(value);
    }
  };

  return (
    <div id="numberOfEvents">
      <label htmlFor="numberOfEventsInput">Number of Events</label>
      <input
        id="numberOfEventsInput"
        type="text"
        className="number"
        placeholder="Enter number of events"
        onChange={handleInputChanged}
        value={numberOfEvents}
      />
    </div>
  );
};

export default NumberOfEvents;  // src/components/NumberOfEvents.jsx