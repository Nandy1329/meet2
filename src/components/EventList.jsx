import React from "react";
import PropTypes from "prop-types";
import Event from "./Event";

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <ul id="event-list">
      {events.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </ul>
  );
};

EventList.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventList;
