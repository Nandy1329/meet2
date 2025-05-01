import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    summary: eventName,
    created: eventCreated,
    location: eventLocation,
    description: eventDescription,
    htmlLink,
  } = event || {};

  return (
    <li className="event">
      <div className="eventTitle">{eventName}</div>
      <div className="eventCreated">{eventCreated}</div>
      <div className="eventLocation">{eventLocation}</div>
      <button className="details-btn" onClick={() => setShowDetails((prev) => !prev)}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="detailsInformation">
          <div>About event:</div>
          <a href={htmlLink} target="_blank" rel="noopener noreferrer">
            See details on Google Calendar
          </a>
          <div className="eventDescription">{eventDescription}</div>
        </div>
      )}
    </li>
  );
};

export default Event;
