import React from 'react';
import { render, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { test, expect, describe, beforeEach } from '@jest/globals';
import userEvent from '@testing-library/user-event';
import * as api from '../api';
import { getEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {
  let AppDOM;

  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
    const numberOfEventsElement = AppDOM.querySelector('#number-of-events');
    expect(numberOfEventsElement).toBeInTheDocument();
    jest.restoreAllMocks();
  });

  test('renders list of events', () => {
    expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
  });

  test('render CitySearch', () => {
    expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
  });

  test('renders a list of events matching the city selected by the user', async () => {
    jest.spyOn(api, 'getEvents').mockResolvedValue([
      { id: 1, location: 'Berlin, Germany', name: 'Event 1' },
      { id: 2, location: 'Berlin, Germany', name: 'Event 2' },
      { id: 3, location: 'Munich, Germany', name: 'Event 3' },
    ]);

    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM2 = AppComponent.container.firstChild;

    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    await user.type(CitySearchInput, 'Berlin');
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = AppDOM.querySelector('#event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      (event) => event.location === 'Berlin, Germany'
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    allRenderedEventItems.forEach((event) => {
      expect(event.textContent).toContain('Berlin, Germany');
    });
  });
    jest.spyOn(api, 'getEvents').mockResolvedValue([
      { id: 1, location: 'Berlin, Germany', name: 'Event 1' },
      { id: 2, location: 'Berlin, Germany', name: 'Event 2' },
      { id: 3, location: 'Munich, Germany', name: 'Event 3' },
    ]);

    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM2 = AppComponent.container.firstChild;

    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    await user.type(CitySearchInput, 'Berlin');
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = AppDOM.querySelector('#event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      (event) => event.location === 'Berlin, Germany'
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    allRenderedEventItems.forEach((event) => {
      expect(event.textContent).toContain('Berlin, Germany');
    });
  });
});