// src/components/CitySearch.jsx
import React, { useState, useEffect } from 'react';

const CitySearch = ({ allLocations, setCurrentCity, setInfoAlert }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChanged = (event) => {
    const value = event.target.value;
    setQuery(value);

    // When the user clears the textbox, empty out suggestions and clear alerts
    if (value === "") {
      setSuggestions([]);
      setInfoAlert("");
      return;
    }

    // Filter locations based on query
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
    setInfoAlert(""); // Clear any previous alert
  };

  // Reset suggestions when the list of allLocations changes
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
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, index) => (
            <li key={`${s}-${index}`} onClick={handleItemClicked}>
              {s}
            </li>
          ))}
          <li key="see-all-cities" onClick={handleItemClicked}>
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};