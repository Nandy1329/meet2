// src/components/CitySearch.jsx
import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);

    // When the user clears the textbox, empty out suggestions
    if (value === "") {
      setSuggestions([]);
      setInfoAlert("");
      return;
    }

    // Otherwise, filter
    const filtered = allLocations.filter(location =>
      location.toUpperCase().includes(value.toUpperCase())
    );
    setSuggestions(filtered);

    // Show an alert if no matches
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
    setInfoAlert("");
  };

  // Whenever the list of locations changes, reset suggestions
  useEffect(() => {
    setSuggestions(allLocations);
  }, [allLocations]);

  return (
    <div id="city-search">
      <input
        type="text"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions && (
        <ul className="suggestions">
          {suggestions.map(s => (
            <li key={s} onClick={handleItemClicked}>
              {s}
            </li>
          ))}
          {/* “See all cities” also clickable */}
          <li key="See all cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
