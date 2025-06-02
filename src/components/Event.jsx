import React, { useState } from 'react';

const Event = ({event}) => {

  const [showDetails, setShowDetails] = useState(false);
  const eventCreated = event?.created
  const eventName = event?.summary
  const eventLocation = event?.location
  const eventDescription = event?.description
  const handleEventClicked = () => {
    setShowDetails((prev) => !prev); // Toggle visibility

  }
  return (
    <li className='event'>
      <div className='eventTitle'>{eventName}</div>
      <div className='eventCreated'>{eventCreated}</div>
      <div className='eventLocation'>{eventLocation}</div>
      <button
      className='details-btn' 
      onClick={handleEventClicked}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="detailsInformation">
          <div>About event:</div>
          <div href="#">See details on Google Calendar</div>
          <div className="eventDescription">{eventDescription}</div>
        </div>
      )}
    </li>
  )
}

export default Event;