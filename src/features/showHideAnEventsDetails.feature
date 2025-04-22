Feature: Show/Hide Event Details
  Scenario: An event element is collapsed by default
    Given the user opens the app
    When the list of events is displayed
    Then each event element should be collapsed by default

  Scenario: User can expand an event to see details
    Given the list of events is displayed
    When the user clicks on an event
    Then the event details should be displayed

  Scenario: User can collapse an event to hide details
    Given an event is expanded
    When the user clicks on the event again
    Then the event details should be hidden