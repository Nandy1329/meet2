// src/__tests__/App.test.jsx
import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api'; // Make sure to import getEvents

describe('<App /> component', () => {
  let AppDOM;

  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', () => {
    expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
  });

  test('renders CitySearch', async () => {
    const { findByTestId } = render(<App />);
    const citySearchElement = await findByTestId('city-search');
    expect(citySearchElement).toBeInTheDocument();
  });

  test('renders NumberOfEvents', async () => {
    const { findByTestId } = render(<App />);
    const numberOfEventsElement = await findByTestId('number-of-events');
    expect(numberOfEventsElement).toBeInTheDocument();
  });

  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    const { findByTestId } = render(<App />);
    const CitySearchDOM = await findByTestId('city-search'); // define CitySearchDOM

    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');
    expect(CitySearchInput).not.toBeNull();

    await user.type(CitySearchInput, 'Berlin');

    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = AppDOM.querySelector('#event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');
    expect(allRenderedEventItems.length).toBe(berlinEvents.length);

    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });

  test('updates the number of events displayed when the user changes the number of events input', async () => {
    const user = userEvent.setup();
    const { findByTestId } = render(<App />);
    const NumberOfEventsDOM = await findByTestId('number-of-events');
    const NumberOfEventsInput = within(NumberOfEventsDOM).queryByTestId('numberOfEventsInput');

    await user.clear(NumberOfEventsInput);
    await user.type(NumberOfEventsInput, '10');

    const EventListDOM = AppDOM.querySelector('#event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
    expect(allRenderedEventItems.length).toBe(10);
  });
}); // End of describe block
