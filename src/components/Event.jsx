import React, {useState} from "react";

const Event = ({ event }) => {
    const [showDetails, setShowDetails] = useState(false);
    const { summary, start, location, description, created } = event;
    const { dateTime } = start;

       
    return (
        <li key={event.id} role="listitem">
        <h2 id="summary">{summary}</h2>
        <p id="when-created">{created}</p>
        <p id="when-event">{dateTime}</p>
        <p id="event-location">{location}</p>
        <button id="show-hide-btn"onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Details" : "Show Details"}
        </button>
        {showDetails && <p id="event-description" data-testid="event-description">{description}</p>}
        </li>
    );
}

export default Event;