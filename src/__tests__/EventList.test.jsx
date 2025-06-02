import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';

jest.mock('../api', () => ({
  getEvents: jest.fn(() => Promise.resolve([
    { id: 1, location: 'Berlin, Germany', summary: 'Event 1' },
    { id: 2, location: 'Berlin, Germany', summary: 'Event 2' },
    // Add more mock events as needed
  ])),
}));

describe('Filter events by city', () => {
  test('When user hasn’t searched for a city, show upcoming events from all cities.', async () => {
    const AppComponent = render(<App />);
    await waitFor(() => {
      const EventListItems = within(AppComponent.container).queryAllByRole('listitem');
      expect(EventListItems.length).toBeGreaterThan(0);
    });
  });

  test('User should see a list of suggestions when they search for a city.', async () => {
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    const CitySearchDOM = AppDOM.querySelector('#city-search');

    expect(CitySearchDOM).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(CitySearchDOM).getByRole('textbox');
    await user.type(input, 'Berlin');

    await waitFor(() => {
      const suggestions = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  test('User can select a city from the suggested list.', async () => {
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    const CitySearchDOM = AppDOM.querySelector('#city-search');

    expect(CitySearchDOM).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(CitySearchDOM).getByRole('textbox');
    await user.type(input, 'Berlin');

    await waitFor(() => {
      const suggestions = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    const suggestion = within(CitySearchDOM).getByText('Berlin, Germany');
    await user.click(suggestion);

    await waitFor(() => {
      const EventListItems = within(AppComponent.container).queryAllByRole('listitem');
      expect(EventListItems.length).toBeGreaterThan(0);
    });
  });

  test('Displays "No events found" when no events are available.', async () => {
    jest.mock('../api', () => ({
      getEvents: jest.fn(() => Promise.resolve([])),
    }));

    const AppComponent = render(<App />);
    await waitFor(() => {
      const noEventsMessage = within(AppComponent.container).getByText('No events found.');
      expect(noEventsMessage).toBeInTheDocument();
    });
  });

  test('Displays all events when "See all cities" is selected.', async () => {
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    const CitySearchDOM = AppDOM.querySelector('#city-search');

    expect(CitySearchDOM).toBeInTheDocument();

    const user = userEvent.setup();
    const input = within(CitySearchDOM).getByRole('textbox');
    await user.type(input, 'See all cities');

    const allCitiesSuggestion = within(CitySearchDOM).getByText('See all cities');
    await user.click(allCitiesSuggestion);

    await waitFor(() => {
      const EventListItems = within(AppComponent.container).queryAllByRole('listitem');
      expect(EventListItems.length).toBeGreaterThan(0);
    });
  });
});