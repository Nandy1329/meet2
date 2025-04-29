import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event'; // Adjust path accordingly
import { getEvents } from '../api';

describe('<Event /> component', () => {
  let EventComponent;
  const mockEvent = {
    summary: "Test Event",
    start: { dateTime: "2025-04-23T10:00:00Z" },
    location: "Test Location",
    description: "This is a test event description.",
  };

  beforeEach(() => {
    EventComponent = render(<Event event={mockEvent} />);
  });

  test('An event element is collapsed by default', () => {
    const eventSummary = EventComponent.queryByText(mockEvent.summary);
    const eventLocation = EventComponent.queryByText(mockEvent.location);
    const eventDetails = EventComponent.queryByText(/About event:/i);

    expect(eventSummary).toBeInTheDocument();
    expect(eventLocation).toBeInTheDocument();
    expect(eventDetails).toBeNull(); // Details should be hidden by default
  });

  test('renders event details button with the title (show details)', () => {
    const button = EventComponent.getByRole("button", { name: /show details/i });
    expect(button).toBeInTheDocument();
  });

  test('User can expand an event to see details', async () => {
    const user = userEvent.setup();
    const toggleButton = EventComponent.getByRole("button", { name: /show details/i });

    await user.click(toggleButton); // Expand details
    const eventDetails = EventComponent.getByText(mockEvent.description);
    expect(eventDetails).toBeInTheDocument();
  });

  test('User can collapse an event to hide details', async () => {
    const user = userEvent.setup();
    const toggleButton = EventComponent.getByRole("button", { name: /show details/i });

    await user.click(toggleButton); // Expand details
    await user.click(toggleButton); // Collapse details

    const eventDetails = EventComponent.queryByText(mockEvent.description);
    expect(eventDetails).not.toBeInTheDocument();
  });
});