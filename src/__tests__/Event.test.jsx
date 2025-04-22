import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event'; // Adjust path accordingly
import { getEvents } from '../api';

describe('<Event /> component', () => {

  let EventComponent;
  beforeEach(() => {

    EventComponent = render(<Event />);
  });

  test('An event element is collapsed by default', async () => {
    const allEvents = await getEvents();
    const events = allEvents
    const event = events[0]
    EventComponent.rerender(<Event event={event} />);

    const eventSummary = EventComponent.queryByText(allEvents[0].summary);
    const eventCreated = EventComponent.queryByText(allEvents[0].created);
    const eventLocation = EventComponent.queryByText(allEvents[0].location);
    const eventHide = EventComponent.queryByText(/About event:/i);

    expect(eventSummary).toBeInTheDocument();
    expect(eventCreated).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventHide).toBeNull();


  });

  test('renders event details button with the tile (show details)', () => {
    const button = EventComponent.getByRole("button", { name: /show details/i });;
    expect(button).toBeInTheDocument();
  });

  test('User can expand an event to see details', async () => {
    const user = userEvent.setup();
    const toggleButton = EventComponent.getByRole("button", { name: /show details/i });

    const allEvents = await getEvents(); // Wait for events to be fetched

    const events = allEvents
    const event = events[0]

    EventComponent.rerender(<Event event={event} />);
    //user click "show details for"

    await user.click(toggleButton);
    const eventDetails = EventComponent.getByText(/Have you wondered how you can ask Google/i);
    expect(eventDetails).toBeInTheDocument();

  });

  test('User can collapse an event to hide details', async () => {
    const user = userEvent.setup();
    const toggleButton = EventComponent.getByRole('button', { name: /show details/i });

    const allEvents = await getEvents(); // Wait for events to be fetched
    const events = allEvents
    const event = events[0]
    EventComponent.rerender(<Event event={event} />);

    await user.click(toggleButton); // Expand details
    await user.click(toggleButton); // Collapse details

    const eventDetails = EventComponent.queryByText(event.description);
    expect(eventDetails).not.toBeInTheDocument();
  });
});