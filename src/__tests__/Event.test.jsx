import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Event from "../components/Event"; // Adjust the path as needed

describe("<Event /> component", () => {
  let EventComponent;
  const mockEvent = {
    summary: "Test Event",
    start: { dateTime: "2025-04-23T10:00:00Z" },
    location: "Test Location",
    description: "This is a test event description."
  };

  beforeEach(() => {
    EventComponent = render(<Event event={mockEvent} />);
  });

  test("An event element is collapsed by default", () => {
    expect(screen.getByText(mockEvent.summary)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(screen.queryByText(/About event:/i)).not.toBeInTheDocument();
  });

  test("renders event details button with the title (show details)", () => {
    const button = screen.getByRole("button", { name: /show details/i });
    expect(button).toBeInTheDocument();
  });

  test("User can expand an event to see details", async () => {
    const user = userEvent.setup();
    const toggleButton = screen.getByRole("button", { name: /show details/i });
    await user.click(toggleButton);
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
  });

  test("User can collapse an event to hide details", async () => {
    const user = userEvent.setup();
    const toggleButton = screen.getByRole("button", { name: /show details/i });
    await user.click(toggleButton);
    await user.click(toggleButton);
    expect(screen.queryByText(mockEvent.description)).not.toBeInTheDocument();
  });
});