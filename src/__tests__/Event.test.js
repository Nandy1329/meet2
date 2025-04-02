import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Event from "../components/Event";
// import mockData from "../mock-data";
import { getEvents } from "../api";

describe("<Event /> component", () => {
    let EventDOM;

    beforeEach(async () => {
  
        const getAllEvents = await getEvents();
        const singleEvent = getAllEvents[0];
        EventDOM = render(<Event event={singleEvent} />);
    });

    test('render event location', () => {
        const locationElement = screen.getByText("London, UK");
        expect(locationElement).toBeInTheDocument();
    });

    test('render event summary', () => {
        const summaryElement = screen.getByText("Learn JavaScript");
        expect(summaryElement).toBeInTheDocument();
    });

    test('render when event was created', () => {
        const createdElement = screen.getByText("2020-05-19T19:17:46.000Z");
        expect(createdElement).toBeInTheDocument();
    });

    test('render show details button', () => {
        const buttonElement = screen.getByText("Show Details");
        expect(buttonElement).toBeInTheDocument();
    });

    test('hide event description by default', () => {
        expect(EventDOM.queryByText(location)).toBeNull();
    });

    test("show event details button is present", async () => {
        expect(EventDOM.queryByText("Show Details")).toBeInTheDocument();
    });

    test('shows event details when "Show Details" button is clicked', async () => {
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
        await user.click(buttonElement); // Show details
        await user.click(buttonElement); // Hide details
        
    
        const descriptionElement = EventDOM.queryByTestId("event-description");
        expect(descriptionElement).not.toBeInTheDocument();
        expect(buttonElement.textContent).toBe("Show Details");
    });

});