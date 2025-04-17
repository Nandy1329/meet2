// src/__tests__/EventList.test.js
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getEvents } from '../api';
import EventList from '../components/EventList';
import App from '../App';

jest.mock('../api', () => ({
  getEvents: jest.fn(),
}));

describe('<EventList /> component', () => {
  let EventListComponent;

  beforeEach(() => {
    getEvents.mockResolvedValue([
      { id: 1, summary: 'Event 1', location: 'Loc1', start: { dateTime: '2025-04-17T10:00:00Z' } },
      { id: 2, summary: 'Event 2', location: 'Loc2', start: { dateTime: '2025-04-17T11:00:00Z' } },
    ]);
    EventListComponent = render(<EventList events={[]} />);
  });

  test('has an element with "list" role', () => {
    expect(EventListComponent.queryByRole('list')).toBeInTheDocument();
  });

  test('renders correct number of events', async () => {
    // Initially empty
    expect(EventListComponent.queryAllByRole('listitem')).toHaveLength(0);

    // Render with 2 events
    const twoEvents = await getEvents();
    EventListComponent.rerender(<EventList events={twoEvents} />);
    expect(EventListComponent.getAllByRole('listitem')).toHaveLength(2);

    // Render with 32 events
    const thirtyTwo = new Array(32).fill(null).map((_, i) => ({
      id: i + 1,
      summary: `Event ${i + 1}`,
      location: `Location ${i + 1}`,
      start: { dateTime: '2025-04-17T10:00:00Z' },
    }));
    EventListComponent.rerender(<EventList events={thirtyTwo} />);
    expect(EventListComponent.getAllByRole('listitem')).toHaveLength(32);
  });
});

describe('<App /> integration', () => {
  test('renders a list of 32 events when the app is mounted and rendered', async () => {
    getEvents.mockResolvedValue(
      new Array(32).fill(null).map((_, i) => ({
        id: i + 1,
        summary: `Event ${i + 1}`,
        location: `Location ${i + 1}`,
        start: { dateTime: '2025-04-17T10:00:00Z' },
      }))
    );

    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    const EventListDOM = AppDOM.querySelector('#event-list');

    await waitFor(() => {
      const items = within(EventListDOM).getAllByRole('listitem');
      expect(items).toHaveLength(32);
    });
  });
});
