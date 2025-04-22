import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  test('An event element is collapsed by default', ({ given, when, then }) => {
    let AppComponent
    given('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    when('the list of events is displayed', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });

    then('each event element should be collapsed by default', () => {
      expect(screen.queryByText(/About event:/i)).toBeNull();
    });
  });

  test('User can expand an event to see details', ({ given, when, then }) => {
    let AppComponent;
    
    given('the list of events is displayed', async () => {
      // Render the App and wait for the events to load
      AppComponent = render(<App />);
      await waitFor(() => {
        const eventItems = within(AppComponent.container).queryAllByRole('listitem');
        expect(eventItems.length).toBeGreaterThan(0); // Ensure events are loaded
      });
    });
  
    when('the user clicks on an event', async () => {
      const user = userEvent.setup();

      // Find the "Show Details" button inside the event item
      const toggleButton = AppComponent.container.querySelector('.details-btn')
  
      // Simulate clicking the "Show Details" button
      await user.click(toggleButton);
    });
  
    then('the event details should be displayed', async () => {
      // Wait for and check if the event details are shown
      await waitFor(() => {
        const eventDetails = within(AppComponent.container).queryByText(/About event:/i);
        expect(eventDetails).toBeInTheDocument();
      });
    });
  });

  test('User can collapse an event to hide details', ({ given, when, then }) => {
    let AppComponent;
  
    given('an event is expanded', async () => {
      const user = userEvent.setup();
      AppComponent = render(<App />);
      const toggleButton = screen.queryByText(/Show Details/i);
      await user.click(toggleButton);
    });
  
    when('the user clicks on the event again', async () => {
      const user = userEvent.setup();
      const toggleButton = screen.queryByText(/Hide Details/i);
      await user.click(toggleButton);
    });
  
    then('the event details should be hidden', () => {
      expect(screen.queryByText(/About event:/i)).toBeNull();
    });
  });
});
