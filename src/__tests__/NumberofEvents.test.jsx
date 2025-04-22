import { render, within, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line no-unused-vars
import React from "react";
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';
import App from '../App';

describe('<NumberOfEvents /> component', () => {

  let NumberOfEventsComponent;
  const mockSetCurrentNOE = jest.fn(); // Create a mock function

  beforeEach(() => {
    NumberOfEventsComponent = render(<NumberOfEvents
      setCurrentNOE={mockSetCurrentNOE}
      setErrorAlert={() => { }}
    />);
  });

  test('renders text input', () => {
    const NumEventsBox = screen.getByLabelText(/Number of Events:/i);
    expect(NumEventsBox).toBeInTheDocument();
    expect(NumEventsBox).toHaveClass('events-num');
  });

  test('default value of input is 32', () => {
    const inputBox = NumberOfEventsComponent.queryByRole('textbox');
    expect(inputBox).toHaveValue(32);
  });

  test('updates input value when user types', async () => {
    const user = userEvent.setup();
    const inputBox = NumberOfEventsComponent.queryByRole('textbox');
    await user.type(inputBox, '{backspace}{backspace}10');
    expect(inputBox).toHaveValue(10);
  });
});

describe("<NumberOfEvents /> integration", () => {
  test("user changes the value of number of events", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    
    // Ensure App is rendered
    expect(container).toBeInTheDocument();

    // Find the input field
    const numberOfEventsInput = screen.getByLabelText(/Number of Events:/i);
    // Change the number of events to 10
    await user.clear(numberOfEventsInput); // Clears existing value
    await user.type(numberOfEventsInput, "10"); // Types new value

    // Wait for the event list to update
    await waitFor(() => {
      const eventList = container.querySelector("#event-list");
      const allRenderedEventItems = within(eventList).queryAllByRole("listitem"); // Fix: Use "listitem"
      expect(allRenderedEventItems.length).toBe(10);
    });
  });
});