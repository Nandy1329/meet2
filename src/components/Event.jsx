/* eslint-disable no-unused-vars */
// src/components/Event.jsx
import React from "react";
import { useState } from "react";
import { formatDate } from "../api";
import PropTypes from "prop-types";

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <li>
      <div className="event">
        <h2>{event.summary}</h2>
        <p>
          <strong>{formatDate(event.start.dateTime)}</strong>
        </p>
        <p> {event.location}</p>

        {showDetails ? (
          <div className="event-details">
            <p data-testid="event-description">{event.description}</p>
            <button className="btn-to-calendar">
              <a
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="link-to-calendar"
              >
                See on Google Calendar
              </a>
            </button>
          </div>
        ) : null}
        <button
          className="show-details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>
    </li>
  );
};

Event.propTypes = {
  event: PropTypes.shape({
    summary: PropTypes.string.isRequired,
    start: PropTypes.shape({
      dateTime: PropTypes.string,
    }).isRequired,
    location: PropTypes.string,
    description: PropTypes.string,
    htmlLink: PropTypes.string,
  }).isRequired,
};

export default Event;
