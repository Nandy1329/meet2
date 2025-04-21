import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // ✅ Correct import
import Event from "../components/Event";
import { getEvents } from "../api";

describe("<Event /> component", () => {
  let EventDOM;

  beforeEach(async () => {
    const getAllEvents = await getEvents();
    const singleEvent = getAllEvents[0];
    EventDOM = render(<Event event={singleEvent} />);
  });

  test("render event location", () => {
    const locationElement = screen.getByText("London, UK");
    expect(locationElement).toBeInTheDocument();
  });

  test("render event summary", () => {
    const summaryElement = screen.getByText("Learn JavaScript");
    expect(summaryElement).toBeInTheDocument();
  });

  test("renders event creation date correctly", async () => {
    const getAllEvents = await getEvents();
    const singleEvent = getAllEvents[0];
    const createdElement = screen.getByText(
      new Date(singleEvent.created).toLocaleString()
    );
    expect(createdElement).toBeInTheDocument();
  });

  test("render show details button", () => {
    const buttonElement = screen.getByText("Show Details");
    expect(buttonElement).toBeInTheDocument();
  });

  test("hides event description by default", () => {
    const descriptionElement = EventDOM.queryByTestId("event-description");
    expect(descriptionElement).not.toBeInTheDocument();
  });

  test("show event details button is present", () => {
    expect(EventDOM.queryByText("Show Details")).toBeInTheDocument();
  });

  test('shows event details when "Show Details" button is clicked', async () => {
    const user = userEvent.setup();
    const buttonElement = EventDOM.getByText("Show Details");
    await user.click(buttonElement);

    const descriptionElement = EventDOM.queryByText("See on Google Calendar");
    expect(descriptionElement).toBeInTheDocument();
    expect(buttonElement.textContent).toBe("Hide Details");
  });
    const user = userEvent.setup();
    const buttonElement = EventDOM.getByText("Show Details");
    await user.click(buttonElement);

    const descriptionElement = EventDOM.queryByTestId("event-description");
    expect(descriptionElement).toBeInTheDocument();
    expect(buttonElement.textContent).toBe("Hide Details");
  });

  test('hides event details when "Hide Details" button is clicked', async () => {
    const user = userEvent.setup();
    const buttonElement = EventDOM.getByText("Show Details");
    await user.click(buttonElement); // Show
    await user.click(buttonElement); // Hide

    const descriptionElement = EventDOM.queryByTestId("event-description");
    expect(descriptionElement).not.toBeInTheDocument();
    expect(buttonElement.textContent).toBe("Show Details");
  });
});
