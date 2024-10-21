import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCountriesList, URL } from '../global/consts'; // Ensure this path is correct
import '../styles/StatsPage.css';

const StatsPage = () => {
  const [mostFavoredCountry, setMostFavoredCountry] = useState({ name: '', flag: '' })
  const [comparedCountry1, setCompareCountry1] = useState({ name: '', flag: '' })
  const [comparedCountry2, setCompareCountry2] = useState({ name: '', flag: '' })
  const [randomCountry, setRandomCountry] = useState('');
  const [randomCountryGDPData, setRandomCountryGDPData] = useState([]);
  const [countryList, setCountryList] = useState([]);

  // Fetch the country list from the GeoJSON file
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getCountriesList();
        const formattedCountries = countries.map(country => ({
          name:country.properties.NAME_EN,
          code:country.properties.WB_A3
        }));
        setCountryList(formattedCountries);

        const topCountryName = await axios.get(`${URL}stats/topCountries`)

        const topCountryFlagRes = await axios.get(`https://restcountries.com/v3.1/name/${topCountryName.data}?fields=flags`)
        const topCountryFlag = topCountryFlagRes.data[0].flags.png ? topCountryFlagRes.data[0].flags.png : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s'


        setMostFavoredCountry({ name: topCountryName.data, flag: topCountryFlag })

        //TODO: set compare countries



      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Function to pick a random country from the list
  const getRandomCountry = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * countryList.length);
    return countryList[randomIndex];
  }, [countryList]);

  // Fetch GDP data for a random country
  useEffect(() => {
    const fetchRandomCountryGDP = async (countryCode) => {
      try {
        const GDPres = await axios.get(
          `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?date=2015:2020&format=json`
        );

        const gdpArray = GDPres.data[1]
          .map(item => ({
            year: item.date,
            gdp: item.value ? (item.value / 1e9).toFixed(2) : null, // Divide by 1 billion and format to 2 decimal places
          }))
          .filter(item => item.gdp !== null)
          .reverse(); // Reverse the array to have years from smallest to largest

        setRandomCountryGDPData(gdpArray);
      } catch (error) {
        console.error('Error fetching GDP data:', error);
      }
    };

    if (countryList.length > 0) {
      const randomCountryData = getRandomCountry();
      setRandomCountry(randomCountryData.name); // Set random country name
      fetchRandomCountryGDP(randomCountryData.code); // Fetch GDP data for the random country
    }
  }, [countryList, getRandomCountry]);

  return (
    <div className="stats-container">
      <h1 className="page-title">Statistics Overview</h1>
      <p className="intro-text">
        Statistics help us understand and analyze data, revealing patterns and insights that guide decision-making. This section provides an overview of key metrics and trends to give you a clearer picture of the underlying data.
      </p>

      {/* Most preserved country */}
      <div className="stat-card">
        <h2 className="card-title">The Most Favorite Country</h2>
        <div className="country-info">
          <img src={mostFavoredCountry.flag} alt={mostFavoredCountry.name} className="flag-large" />
          <div className="country-details">
            <h3>{mostFavoredCountry.name}</h3>
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
            <img src={comparedCountry2.flag} alt={comparedCountry2.name} className="flag-large" />
            <h3>{comparedCountry2.name}</h3>
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
