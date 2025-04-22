import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
    test('When user has not specified a number, 32 events are shown by default', ({ given, when, then }) => {

        given('the user has not set a number of events', () => {
            // The default number of events is assumed to be 32, so no setup is needed here.
        });

        let AppComponent
        when('the list of events is displayed', () => {
            // Render the App component to simulate the user viewing the event list
            AppComponent = render(<App />);
        });

        then('32 events should be shown by default', async () => {
            // Assert that the number of events displayed matches the default (32)
            const inputBox = AppComponent.container.querySelector('.events-num');
            expect(inputBox).toHaveValue(32);
        });
    });

    test('User can change the number of events displayed', ({ given, when, then }) => {
        given('the user wants to change the number of events displayed', () => {
            // This step doesn't require any setup, as it's just the user's intent
        });
        let AppComponent
        when('the user sets the number of events to a specific value', async () => {
            const user = userEvent.setup();
            AppComponent = render(<App />);
            // Locate the input box for setting the number of events
            const numEventsInput = AppComponent.container.querySelector('.events-num');

            // Simulate user entering a new number for the events to be displayed
            await user.clear(numEventsInput);
            await user.type(numEventsInput, '10');  // For example, user wants 10 events
        });

        then('the app should display that number of events', async () => {
            // After setting the number of events, check that the correct number of events is displayed
            const AppDOM = AppComponent.container.firstChild;
            const EventListDOM = AppDOM.querySelector('#event-list');
            const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');
            // Verify that the correct number of events is displayed (e.g., 10)
            expect(allRenderedEventItems.length).toBe(10);
        });
    });
});