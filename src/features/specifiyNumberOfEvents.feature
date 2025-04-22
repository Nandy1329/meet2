Feature: Specify Number of Events
  Scenario: When user has not specified a number, 32 events are shown by default
    Given the user has not set a number of events
    When the list of events is displayed
    Then 32 events should be shown by default
  Scenario: User can change the number of events displayed
    Given the user wants to change the number of events displayed
    When the user sets the number of events to a specific value
    Then the app should display that number of events