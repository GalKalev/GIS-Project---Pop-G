import React, { useState } from 'react'; 
import Header from '../components/Header';
import Country from '../components/Country';

const CompCountriesPage = () => {
const [selectedCountries, setSelectedCountries] = useState([]);

const countries = ['Country1', 'Country2', 'Country3', 'Country4'];

const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
    setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else if (selectedCountries.length < 4) {
    setSelectedCountries([...selectedCountries, country]);
    }
};

const countryStyle = {
    border: '2px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '600px',  
    minHeight: '600px', 
    display: 'flex',
    justifyContent: 'space-between',  
    alignItems: 'center',     
    backgroundColor: '#f9f9f9',
};

const buttonStyle = {
    fontSize: '2rem',
    width: '100%',  
    height: '100%', 
    display: 'flex',
    justifyContent: 'center',  
    alignItems: 'center',     
    backgroundColor: '#f9f9f9', 
    border: 'none',
    cursor: 'pointer',
};

return (
    <main style={{ marginTop: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Header text="compare countries" />

        {/* Introduction */}
        <p style={{ textAlign: 'center', marginTop: '10px', maxWidth: '600px', fontSize: '1.2rem', lineHeight: '1.5' }}>
            The Compare Countries page allows you to visually explore and compare key statistics between different nations. 
            Select at least two countries to begin comparing.
        </p>


        {/* First two countries always displayed */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            {countries.slice(0, 2).map((country, index) => (
                <div key={index}>
                    <div style={countryStyle}>
                        <Country name={country} />
                    </div>
                </div>
            ))}
        </div>

        {/* Last two countries are selectable with a '+' button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {countries.slice(2).map((country, index) => (
                <div key={index}>
                    <div style={countryStyle}>
                        {selectedCountries.includes(country) ? (
                            <Country name={country} />
                        ) : (
                            <button onClick={() => toggleCountry(country)} style={buttonStyle}>+</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </main>
);
};

export default CompCountriesPage;


