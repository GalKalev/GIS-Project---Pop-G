import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCountriesList, URL } from '../global/consts'; // Ensure this path is correct
import '../styles/StatsPage.css';
import { useDispatch } from 'react-redux';
import { openModal, setMessage, unsuccessful } from '../features/modal/modalSlice';
import Graph from '../components/Graph';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, IconButton } from '@mui/material';
import Header from '../components/Header';

const StatsPage = () => {
  const [mostFavoredCountry, setMostFavoredCountry] = useState({ name: '', flag: '' })
  const [comparedCountry1, setCompareCountry1] = useState({ name: '', flag: '' })
  const [comparedCountry2, setCompareCountry2] = useState({ name: '', flag: '' })
  const [randomCountry, setRandomCountry] = useState('');
  const [randomCountryGDPData, setRandomCountryGDPData] = useState([]);
  const [randomCountryPOPData, setRandomCountryPOPData] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const dispatch = useDispatch()

  // Fetch the country list from the GeoJSON file
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getCountriesList();
        const blockedCountriesResponse = await axios.get(`${URL}admin/countries`);
        const blockedCountries = blockedCountriesResponse.data.map(item => item.country);

        // Format the countries
        const formattedCountries = countries.map(country => ({
          name: country.properties.NAME_EN,
          code: country.properties.WB_A3,
        }));

        // Filter the formatted countries to exclude blocked countries
        const filteredCountries = formattedCountries.filter(country => !blockedCountries.includes(country.name));

        setCountryList(filteredCountries);

        const topCountryName = await axios.get(`${URL}stats/topCountry`)
        if (topCountryName.status === 200) {
          const topCountryFlagRes = await axios.get(`https://restcountries.com/v3.1/name/${topCountryName.data}?fields=flags`)
          const topCountryFlag = topCountryFlagRes.data[0].flags.png ? topCountryFlagRes.data[0].flags.png : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s'
          setMostFavoredCountry({ name: topCountryName.data, flag: topCountryFlag })
        } else {
          console.error('error fetching stats basic')
          throw Error('Cannot fetch stats, please try again later.')
        }

        const topCompareCountriesName = await axios.get(`${URL}stats/topCompareCountries`)
        if (topCompareCountriesName.data.country1) {
          const topCompareCountry1FlagRes = await axios.get(`https://restcountries.com/v3.1/name/${topCompareCountriesName.data.country1}?fields=flags`)
          const topCompareCountry2FlagRes = await axios.get(`https://restcountries.com/v3.1/name/${topCompareCountriesName.data.country2}?fields=flags`)
          const topCompareCountry1Flag = topCompareCountry1FlagRes.data[0].flags.png ? topCompareCountry1FlagRes.data[0].flags.png : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s'
          const topCompareCountry2Flag = topCompareCountry2FlagRes.data[0].flags.png ? topCompareCountry2FlagRes.data[0].flags.png : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s'

          setCompareCountry1({ name: topCompareCountriesName.data.country1, flag: topCompareCountry1Flag })
          setCompareCountry2({ name: topCompareCountriesName.data.country2, flag: topCompareCountry2Flag })
        } else {
          console.error('error fetching stats compare')
          throw Error('Cannot fetch stats, please try again later.')
        }

      } catch (error) {
        console.error('Error fetching stats:', error);
        dispatch(unsuccessful())
        dispatch(setMessage('Cannot fetch stats, please try again later.'))
        dispatch(openModal())
        return;
      }
    };
    fetchCountries();
  }, []);


  // Function to pick a random country from the list
  const getRandomCountry = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * countryList.length);
    return countryList[randomIndex];
  }, [countryList]);

  const fetchRandomCountryGDPandPOP = async (countryCode) => {
    try {
      // Fetch GDP data
      const GDPres = await axios.get(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?date=2015:2020&per_page=300&format=json`
      );

      // Fetch Population data
      const POPres = await axios.get(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.POP.TOTL?date=2015:2020&per_page=300&format=json`
      );


      // Making sure data successfully fetches
      if (!GDPres.data[1] && !POPres.data[1]) {
        return;
      }

      const GDPList = [];
      const POPList = [];

      // Safely process GDP and Population data if available
      if (GDPres.data[1]) {
        GDPres.data[1].forEach((yearData) => {
          if (yearData.value !== null) {
            GDPList.push(yearData.value);
          }
        });
      }
      if (POPres.data[1]) {
        POPres.data[1].forEach((yearData) => {
          if (yearData.value !== null) {
            POPList.push(yearData.value);
          }
        });
      }

      setRandomCountryGDPData(GDPList);
      setRandomCountryPOPData(POPList);
    } catch (error) {
      console.error("Error fetching GDP/POP data:", error);
    }
  };

  const setRandomValues = useCallback(() => {

    const randomCountryData = getRandomCountry();
    setRandomCountry(randomCountryData.name); // Set random country name
    fetchRandomCountryGDPandPOP(randomCountryData.code); // Fetch GDP data and Population data for the random country

  }, [countryList, getRandomCountry]);


  // Fetch GDP data for a random country
  useEffect(() => {

    if (countryList.length > 0) {
      setRandomValues();
    }

  }, [countryList, setRandomValues]);

  return (
    <div className="stats-container">
      <Header
        title={'Statistics Overview'}
        text={' Statistics help us understand and analyze data, revealing patterns and insights that guide decision-making. This section provides an overview of key metrics and trends to give you a clearer picture of the underlying data.'}
      />

      {/* Most preserved country */}
      <div className="stat-card">
        <h2 className="card-title">Most Favorite Country</h2>
        <div className="country-info" style={{
          display: 'flex',
          alignItems: 'center',  
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <img src={mostFavoredCountry.flag} alt={mostFavoredCountry.name} className="flag-large" />
          <div className="country-details">
            <h3>{mostFavoredCountry.name}</h3>
          </div>
        </div>
      </div>

      {/* Comparison between countries */}
      <div className="stat-card">
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

      {
        randomCountry && randomCountryGDPData.length > 0 && randomCountryPOPData.length > 0 ? (

          <div className="stat-card random-container">
            <h1 className="card-title">You Might Be Interested In:</h1>

            <h2 className="card-title">GDP & Population of {randomCountry} Over Time</h2>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
              <Graph years={[2015, 2016, 2017, 2018, 2019, 2020]} pop={randomCountryPOPData} gdp={randomCountryGDPData} />

            </Box>

          </div>
        ) : (
          <div className='random-container'>

            <h2>Could not retrieve data</h2>
            <IconButton
              onClick={() => {
                if (countryList.length > 0) {
                  setRandomValues();
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 20,
                border: '1px solid black',
                borderRadius: 5,
                textAlign: 'center',
                padding: 2,
                '& svg': {
                  margin: 'auto', // Ensure icon takes up available space
                  display: 'block', // Make sure SVG is displayed as a block-level element
                },
              }}
            >
              REFRESH
              <RefreshIcon style={{
                color: 'black',           // Icon color
                borderWidth: 2,           // Border width
                borderColor: 'black',     // Border color
                borderStyle: 'solid',     // Border style (required to show the border)
                borderRadius: 20,          // Optional: rounded corners
                padding: 1,
                marginRight: 4,
                alignItems: 'center'
              }}
                title={'Favorite'}
                fontSize='small'
              />
            </IconButton>
          </div>
        )}

    </div>
  );
};

export default StatsPage;
