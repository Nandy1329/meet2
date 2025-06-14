import React from 'react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import App from '../App';
import { extractLocations } from '../api';
jest.mock('../api');
import { getEvents } from '../api';
import { render, within, waitFor } from '@testing-library/react';

describe('<CitySearch /> component', () => {

  let CitySearchComponent;

  beforeEach(() => {
    CitySearchComponent = render(<CitySearch
      allLocations={[]}
      setCurrentCity={() => { }}
      setInfoAlert={() => { }}
    />);
  });

  test('renders text input', () => {
    const cityTextBox = CitySearchComponent.queryByRole('textbox');
    expect(cityTextBox).toBeInTheDocument();
    expect(cityTextBox).toHaveClass('city');
  });


  test('suggestions list is hidden by default', () => {
    const suggestionList = CitySearchComponent.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city textbox gains focus', async () => {
    const user = userEvent.setup(); //user interaction
    const cityTextBox = CitySearchComponent.queryByRole('textbox');
    await user.click(cityTextBox);
    const suggestionList = CitySearchComponent.queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();

    // Extract Locations of events
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);

    CitySearchComponent.rerender(
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={() => { }}
        setInfoAlert={() => { }}
      />);


    // user types "Berlin" in city textbox
    const cityTextBox = CitySearchComponent.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");


    // filter allLocations to locations matching "Berlin"
    const suggestions = allLocations ? allLocations.filter((location) => {
      return location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1;
    }) : [];


    // get all <li> elements inside the suggestion list
    const suggestionListItems = CitySearchComponent.queryAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    for (let i = 0; i < suggestions.length; i += 1) {
      expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
    }
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch
      allLocations={allLocations}
      setCurrentCity={() => { }}
      setInfoAlert={() => { }}

    />);


    const cityTextBox = CitySearchComponent.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");


    // the suggestion's textContent look like this: "Berlin, Germany"
    const BerlinGermanySuggestion = CitySearchComponent.queryAllByRole('listitem')[0];


    await user.click(BerlinGermanySuggestion);


    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });


});

describe('<CitySearch /> integration', () => {
    // Mock getEvents to return test data
        getEvents.mockResolvedValue([
          { location: "Berlin, Germany" },
          { location: "London, UK" },
        ]);
        const AppComponent = render(<App />);
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;


    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const cityTextBox = within(CitySearchDOM).queryByRole('textbox');
    await user.click(cityTextBox);


    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);


    await waitFor(() => {
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems.length).toBe(allLocations.length + 1);
    });
  });

});