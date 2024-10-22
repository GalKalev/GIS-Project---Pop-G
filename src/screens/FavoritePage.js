import React, { useState } from 'react';
import { DeleteIcon } from '../global/icons'; // Import the DeleteIcon
import '../styles/FavoritePage.css'; // CSS for layout

const FavoritePage = () => {
  const [localCountries, setLocalCountries] = useState([
    { name: 'Israel', code: 'IL', minYear: 1948, maxYear: 2024 },
    { name: 'Jordan', code: 'JO', minYear: 1946, maxYear: 2024 },
    { name: 'Lebanon', code: 'LB', minYear: 1943, maxYear: 2024 },
    { name: 'Egypt', code: 'EG', minYear: 1922, maxYear: 2024 },
    { name: 'Turkey', code: 'TR', minYear: 1923, maxYear: 2024 },
    { name: 'Cyprus', code: 'CY', minYear: 1960, maxYear: 2024 },
    { name: 'Syria', code: 'SY', minYear: 1946, maxYear: 2024 },
    { name: 'Greece', code: 'GR', minYear: 1821, maxYear: 2024 },
    { name: 'Saudi Arabia', code: 'SA', minYear: 1932, maxYear: 2024 },
  ]);

  const [showDetails, setShowDetails] = useState(false);

  const removeCountry = (countryName) => {
    setLocalCountries(localCountries.filter(country => country.name !== countryName));
  };

  return (
    <div className="favorite-page">
      <h1>Favorite Countries</h1>
      <button className="basic-button" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Basic' : 'Show Basic'} {showDetails ? '▲' : '▼'}
      </button>
      {showDetails && (
        <div className="countries-container">
          {localCountries.map((country, index) => (
            <div className="country-card" key={index}>
              <div className="country-details">
                <h3>{country.name}</h3>
                <p>{country.minYear} - {country.maxYear}</p>
              </div>
              <div className="country-Graph">
                <p>graph</p>
              </div>
              <button className="remove-btn" onClick={() => removeCountry(country.name)}>
                <DeleteIcon fontSize="small" title="Remove Country" style={{ cursor: 'pointer' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
