import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/StatsPage.css';

const StatsPage = () => {
  const [mostPreservedCountry] = useState({
    name: 'United States',
    flag: 'https://via.placeholder.com/50',
  });
  const [comparedCountry1] = useState({
    name: 'China',
    flag: 'https://via.placeholder.com/50',
  });
  const [randomCountry, setRandomCountry] = useState('');
  const [randomCountryGDPData, setRandomCountryGDPData] = useState([]);

  const countryList = [
    { name: 'Germany', code: 'DEU' },
    { name: 'Brazil', code: 'BRA' },
    { name: 'France', code: 'FRA' },
    { name: 'India', code: 'IND' },
    { name: 'Japan', code: 'JPN' },
    { name: 'Australia', code: 'AUS' },
    { name: 'Canada', code: 'CAN' },
    { name: 'Russia', code: 'RUS' },
    { name: 'Italy', code: 'ITA' },
    { name: 'Mexico', code: 'MEX' },
    { name: 'South Korea', code: 'KOR' },
    { name: 'South Africa', code: 'ZAF' },
    { name: 'Saudi Arabia', code: 'SAU' }
  ];

  // Function to pick a random country from the list
  const getRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countryList.length);
    return countryList[randomIndex];
  };

  useEffect(() => {
    const fetchRandomCountryGDP = async (countryCode) => {
      try {
        const GDPres = await axios.get(
          `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?date=2015:2020&format=json`
        );

        const gdpArray = GDPres.data[1]
          .map(item => ({
            year: item.date,
            gdp: item.value ? (item.value / 1e9).toFixed(2) : null // Divide by 1 billion and format to 2 decimal places
          }))
          .filter(item => item.gdp !== null)
          .reverse(); // Reverse the array to have years from smallest to largest

        setRandomCountryGDPData(gdpArray);
      } catch (error) {
        console.error('Error fetching GDP data:', error);
      }
    };

    const randomCountryData = getRandomCountry();
    setRandomCountry(randomCountryData.name); // Set random country name
    fetchRandomCountryGDP(randomCountryData.code); // Fetch GDP data for the random country
  }, []);

  return (
    <div className="stats-container">
      <h1 className="page-title">Statistics Overview</h1>
      <p className="intro-text">
        Statistics help us understand and analyze data, revealing patterns and insights that guide decision-making. This section provides an overview of key metrics and trends to give you a clearer picture of the underlying data.
      </p>

      {/* Most preserved country */}
      <div className="stat-card">
        <h2 className="card-title">The Most Preserved Country</h2>
        <div className="country-info">
          <img src={mostPreservedCountry.flag} alt={mostPreservedCountry.name} className="flag-large" />
          <div className="country-details">
            <h3>{mostPreservedCountry.name}</h3>
          </div>
        </div>
      </div>

      {/* Comparison between countries */}
      <div className="stat-card comparison-card">
        <h2 className="card-title">Comparison Between Countries</h2>
        <p className="comparison-text">The two countries most frequently compared by users are China and the United States.</p>
        <div className="comparison-info">
          <div className="country">
            <img src={comparedCountry1.flag} alt={comparedCountry1.name} className="flag-large" />
            <h3>{comparedCountry1.name}</h3>
          </div>
          <span className="vs">vs</span>
          <div className="country">
            <img src={mostPreservedCountry.flag} alt={mostPreservedCountry.name} className="flag-large" />
            <h3>{mostPreservedCountry.name}</h3>
          </div>
        </div>
      </div>

      {/* GDP Graph for Random Country */}
      <div className="stat-card">
        <h2 className="card-title">GDP of {randomCountry} Over Time (in Billions)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={randomCountryGDPData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value} B`} />
            <Legend />
            <Bar dataKey="gdp" fill="rgb(207, 159, 207)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default StatsPage;

