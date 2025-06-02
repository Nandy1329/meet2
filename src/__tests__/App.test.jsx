import React from "react";
import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getEvents } from "../api";
import App from "../App";

describe("<App /> component", () => {
  let AppDOM;
  beforeEach(async () => {
    AppDOM = render(<App />).container.firstChild;

    test("renders NumberOfEvents component", () => {
      expect(AppDOM.querySelector("#number-of-events")).toBeInTheDocument();
    });

    test("renders list of events", () => {
      expect(AppDOM.querySelector("#event-list")).toBeInTheDocument();
    });

    test("renders CitySearch component", () => {
      expect(AppDOM.querySelector("#city-search")).toBeInTheDocument();
    });

    test("renders alerts container", () => {
      expect(AppDOM.querySelector(".alerts-container")).toBeInTheDocument();
    });

    test("renders charts container", () => {
      expect(AppDOM.querySelector(".charts-container")).toBeInTheDocument();
    });

    describe("<App /> integration", () => {
      test("renders a list of events matching the city selected by the user", async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const CitySearchDOM = AppDOM.querySelector("#city-search");
        const CitySearchInput = within(CitySearchDOM).queryByRole("textbox");

        await user.type(CitySearchInput, "Berlin");
        const berlinSuggestionItem =
          within(CitySearchDOM).queryByText("Berlin, Germany");
        await user.click(berlinSuggestionItem);

        const EventListDOM = AppDOM.querySelector("#event-list");
        const allRenderedEventItems =
          within(EventListDOM).queryAllByRole("listitem");

        const allEvents = await getEvents();
        const berlinEvents = allEvents.filter(
          (event) => event.location === "Berlin, Germany"
        );

        expect(allRenderedEventItems.length).toBe(berlinEvents.length);
        allRenderedEventItems.forEach((event) => {
          expect(event.textContent).toContain("Berlin, Germany");
        });
      });

      test("updates the number of events displayed when NumberOfEvents changes", async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const NumberOfEventsDOM = AppDOM.querySelector("#number-of-events");
        const NumberOfEventsInput =
          within(NumberOfEventsDOM).queryByRole("spinbutton");

        await user.clear(NumberOfEventsInput);
        await user.type(NumberOfEventsInput, "5");

        const EventListDOM = AppDOM.querySelector("#event-list");
        const allRenderedEventItems =
          within(EventListDOM).queryAllByRole("listitem");

        expect(allRenderedEventItems.length).toBe(5);
      });

      test("displays an error alert when fetching events fails", async () => {
        jest
          .spyOn(global, "fetch")
          .mockImplementation(() =>
            Promise.reject(new Error("Failed to fetch"))
          );

        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const ErrorAlertDOM = AppDOM.querySelector(
          ".alerts-container .error-alert"
        );
        expect(ErrorAlertDOM).toBeInTheDocument();
        expect(ErrorAlertDOM.textContent).toBe(
          "Failed to load events. Please try again later."
        );

        global.fetch.mockRestore();
      });

      test("displays a warning alert when offline", async () => {
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        // Simulate offline mode
        window.dispatchEvent(new Event("offline"));

        const WarningAlertDOM = AppDOM.querySelector(
          ".alerts-container .warning-alert"
        );
        expect(WarningAlertDOM).toBeInTheDocument();
        expect(WarningAlertDOM.textContent).toBe(
          "You are currently offline. Some features may not work."
        );

        // Simulate online mode
        window.dispatchEvent(new Event("online"));

        expect(WarningAlertDOM.textContent).toBe("");
      });

      test('renders all events when "See all cities" is selected', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const CitySearchDOM = AppDOM.querySelector("#city-search");
        const CitySearchInput = within(CitySearchDOM).queryByRole("textbox");

        await user.type(CitySearchInput, "See all cities");
        const allCitiesSuggestionItem =
          within(CitySearchDOM).queryByText("See all cities");
        await user.click(allCitiesSuggestionItem);

        const EventListDOM = AppDOM.querySelector("#event-list");
        const allRenderedEventItems =
          within(EventListDOM).queryAllByRole("listitem");

        const allEvents = await getEvents();

        expect(allRenderedEventItems.length).toBe(allEvents.length);
      });
    });
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    const CitySearchDOM = AppDOM.querySelector("#city-search");
    const CitySearchInput = within(CitySearchDOM).queryByRole("textbox");

    await user.type(CitySearchInput, "Berlin");
    const berlinSuggestionItem =
      within(CitySearchDOM).queryByText("Berlin, Germany");
    await user.click(berlinSuggestionItem);

    const EventListDOM = AppDOM.querySelector("#event-list");
    const allRenderedEventItems =
      within(EventListDOM).queryAllByRole("listitem");

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      (event) => event.location === "Berlin, Germany"
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    allRenderedEventItems.forEach((event) => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
});
