/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value === "") {
      setSuggestions([]);
      setInfoAlert("");
      return;
    }

    const filtered = allLocations.filter(location =>
      location.toUpperCase().includes(value.toUpperCase())
    );
    setSuggestions(filtered);

    if (filtered.length === 0) {
      setInfoAlert("No locations found.");
    } else {
      setInfoAlert("");
    }
  };
  const handleItemClicked = (event) => {
    const value = event.target.textContent;
    setQuery(value);
    setShowSuggestions(false);
    setCurrentCity(value);
    setInfoAlert("")
  };

  useEffect(() => {
    setSuggestions(allLocations);
  }, [allLocations]);

  return (
    <div id="city-search" data-testid="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
        role="textbox" // Add role for testing
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map(s => (
            <li key={s} onClick={handleItemClicked}>
              {s}
            </li>
          ))}
          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

CitySearch.propTypes = {
  allLocations: PropTypes.array.isRequired,
  setCurrentCity: PropTypes.func.isRequired,
  setInfoAlert: PropTypes.func.isRequired,
};

export default CitySearch;