import React, { useEffect, useState } from 'react';
import { DeleteIcon } from '../global/icons'; // Import the DeleteIcon
import '../styles/FavoritePage.css'; // CSS for layout
import { useDispatch, useSelector } from 'react-redux';
import Graph from '../components/Graph';
import List from '@mui/material/List';
import { openModal, setMessage, unsuccessful } from '../features/modal/modalSlice';
import axios from 'axios';
import Header from '../components/Header';
import { Collapse, ListItemButton, ListItemText, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import CompGraph from '../components/CompGraph';
import { deleteBasicFavorite, deleteCompareFavorite, setBasic, setComp, setIsLoading } from '../features/favorites/favoritesSlice';
import { APP_COLOR } from '../global/consts';

const FavoritePage = () => {
  const { basic, comp, isLoading } = useSelector((store) => store.favorites);
  const { id: userId } = useSelector((store) => store.user)
  const [showBasicDetails, setShowBasicDetails] = useState(false);
  const [showCompDetails, setShowCompDetails] = useState(false);
  const [basicList, setBasicList] = useState([]);
  const [compList, setCompList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBasicCompCountryData = async () => {
      const newBasicList = []; // Create a new array to hold the new countries
      for (const b of basic) {
        // Check for duplicates
        if (!newBasicList.some(bl => bl.id === b.id)) {
          const countryData = await getBasicCountryGDPandPOP(b);
          if (countryData) {
            newBasicList.push(countryData);
          }
        }
      }
      setBasicList(newBasicList); // Set the state only once

      const newCompList = []; // Create a new array to hold the new countries
      for (const c of comp) {
        // Check for duplicates
        if (!newCompList.some(cl => cl.id === c.id)) {
          const countryData = await getCompCountryGDPandPOP(c);
          if (countryData) {
            newCompList.push(countryData);
          }
        }
      }
      setCompList(newCompList); // Set the state only once
    };

    fetchBasicCompCountryData();
  }, [basic, comp]); // Add basic as a dependency

  const getBasicCountryGDPandPOP = async (b) => {
    try {
      const GDPres = await axios.get(`https://api.worldbank.org/v2/country/${b.WBId}/indicator/NY.GDP.MKTP.CD?date=${b.minYear}:${b.maxYear}&per_page=300&format=json`);
      const POPres = await axios.get(`https://api.worldbank.org/v2/country/${b.WBId}/indicator/SP.POP.TOTL?date=${b.minYear}:${b.maxYear}&per_page=300&format=json`);

      const GDPList = GDPres.data[1].map(year => year.value);
      const POPList = POPres.data[1].map(year => year.value);
      const years = [];

      for (let i = b.minYear; i <= b.maxYear; i++) {
        years.push(i);
      }

      return {
        id: b.id,
        country: b.country,
        WBId: b.WBId,
        minYear: b.minYear,
        maxYear: b.maxYear,
        gdp: GDPList,
        pop: POPList,
        years: years,
      };
    } catch (error) {
      dispatch(openModal())
      dispatch(unsuccessful())
      dispatch(setMessage('Could not retrieve data'));
      console.error('Error Message:', error.message);
      return null;
    }
  };

  const getCompCountryGDPandPOP = async (c) => {
    try {
      const GDP1res = await axios.get(`https://api.worldbank.org/v2/country/${c.WBId1}/indicator/NY.GDP.MKTP.CD?date=${c.minYear}:${c.maxYear}&per_page=300&format=json`)
      const POP1res = await axios.get(`https://api.worldbank.org/v2/country/${c.WBId1}/indicator/SP.POP.TOTL?date=${c.minYear}:${c.maxYear}&per_page=300&format=json`)
      const GDP2res = await axios.get(`https://api.worldbank.org/v2/country/${c.WBId2}/indicator/NY.GDP.MKTP.CD?date=${c.minYear}:${c.maxYear}&per_page=300&format=json`)
      const POP2res = await axios.get(`https://api.worldbank.org/v2/country/${c.WBId2}/indicator/SP.POP.TOTL?date=${c.minYear}:${c.maxYear}&per_page=300&format=json`)

      const GDP1List = []
      const POP1List = []
      const GDP2List = []
      const POP2List = []

      GDP1res.data[1].map(year => {
        GDP1List.push(year.value)
      });
      POP1res.data[1].map(year => {
        POP1List.push(year.value)
      });
      GDP2res.data[1].map(year => {
        GDP2List.push(year.value)
      });
      POP2res.data[1].map(year => {
        POP2List.push(year.value)
      });

      const years = []
      for (let i = c.minYear; i <= c.maxYear; i++) {
        years.push(i)
      }

      return {
        id: c.id,
        country1: c.country1,
        WBId1: c.WBId1,
        country2: c.country2,
        WBId2: c.WBId2,
        minYear: c.minYear,
        maxYear: c.maxYear,
        gdp1: GDP1List,
        pop1: POP1List,
        gdp2: GDP2List,
        pop2: POP2List,
        years: years,
      };
    } catch (error) {
      dispatch(openModal())
      dispatch(unsuccessful())
      dispatch(setMessage('Could not retrieve data'));
      console.error('Error Message:', error.message);
      return null;
    }
  };

  const removeBasicCountry = async (basic) => {
    try {
      // console.log(basic);
      dispatch(setIsLoading(true))
      const res = await dispatch(deleteBasicFavorite({ userId, id: basic.id }))

      if (res.type === "/favorites/deleteBasic/fulfilled") {
        dispatch(setBasic(res.payload));
      } else {
        throw Error()
      }

    } catch (error) {
      dispatch(openModal())
      dispatch(unsuccessful())
      dispatch(setMessage('Error occurred while removing from Favorites, please try again later '))
      console.error('error deleting a basic favorite: ' + error.message)
    } finally {
      dispatch(setIsLoading(false))
    }
  };
  const removeCompCountry = async (comp) => {
    try {
      // console.log(basic);
      dispatch(setIsLoading(true))
      const res = await dispatch(deleteCompareFavorite({ userId, id: comp.id }))

      if (res.type === "/favorites/deleteCompare/fulfilled") {
        dispatch(setComp(res.payload));
      } else {
        throw Error()
      }

    } catch (error) {
      dispatch(openModal())
      dispatch(unsuccessful())
      dispatch(setMessage('Error occurred while removing from Favorites, please try again later '))
      console.error('error deleting a compare favorite: ' + error.message)
    } finally {
      dispatch(setIsLoading(false))
    }
  };

  return (
    <div className="favorite-page">
      <Header title={'Favorites'} text={'Here you can see all your favorites counties and their data'} />
      {!isLoading &&
        <List
          sx={{ width: '90%', bgcolor: 'background.paper', backgroundColor: '#f9f9f9' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            sx={{
              backgroundColor: 'white',
              '&:hover': {

                backgroundColor: APP_COLOR,
              }
            }} onClick={() => setShowBasicDetails(!showBasicDetails)}>
            <ListItemText
              primary={<Typography sx={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>Countries</Typography>}
            />          {showBasicDetails ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={showBasicDetails} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ display: 'flex', flexDirection: 'column' }}>
              {basicList.map((country, index) => (
                <div className="country-card" key={index}>
                  <div className="country-details">
                    <h3>{country.country}</h3>
                    <p>{country.minYear} - {country.maxYear}</p>
                  </div>
                  <div className="country-Graph">
                    <Graph pop={country.pop} gdp={country.gdp} years={country.years} isMapShrunken={true} />
                  </div>
                  <button className="remove-btn" onClick={() => removeBasicCountry(country)}>
                    <DeleteIcon fontSize="small" title="Remove Country" style={{ cursor: 'pointer' }} />
                  </button>
                </div>
              ))}
            </List>
          </Collapse>

          <ListItemButton sx={{
            marginTop: 3,
            backgroundColor: 'white',
            '&:hover': {

              backgroundColor: APP_COLOR,
            }
          }}
            onClick={() => setShowCompDetails(!showCompDetails)}>
            <ListItemText
              primary={<Typography sx={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold' }}>Compared Countries</Typography>}
            />
            {showCompDetails ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={showCompDetails} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ display: 'flex', flexDirection: 'column' }}>
              {compList.map((countries, index) => (
                <div className="country-card" key={index}>
                  <div className="country-details">
                    <h3>{countries.country1} VS {countries.country2}</h3>
                    <p>{countries.minYear} - {countries.maxYear}</p>
                  </div>
                  <div className="country-Graph">
                    <CompGraph pop1={countries.pop1} gdp1={countries.gdp1} gdp2={countries.gdp2} pop2={countries.pop2} years={countries.years} />
                  </div>
                  <button className="remove-btn" onClick={() => removeCompCountry(countries)}>
                    <DeleteIcon fontSize="small" title="Remove Country" style={{ cursor: 'pointer' }} />
                  </button>
                </div>
              ))}
            </List>
          </Collapse>
        </List>}

    </div>
  );
};

export default FavoritePage;
