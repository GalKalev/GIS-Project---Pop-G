import { Button } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import '../styles/CountryInfo.css'
import CountryAttributes from './CountryAttributes'
import { openModal, setMessage, unsuccessful } from '../features/modal/modalSlice';
import { useDispatch } from 'react-redux';
const CountryInfo = ({ selectedCountry, minYear, maxYear, setSelectedCountry }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(true)
    const [GDPvalues, setGDPvalues] = useState([])
    const [POPvalues, setPOPvalues] = useState([])
    const [yearList, setYearList] = useState([])
    const { name,
        continent,
        wbID,
        name_es,
        name_ja,
        name_tr,
        flag,
        capital,
        languages
    } = selectedCountry

    const dispatch = useDispatch();


    const handleSubmit = async () => {
        try {

            setIsLoading(true)
            const GDPres = await axios.get(`https://api.worldbank.org/v2/country/${wbID}/indicator/NY.GDP.MKTP.CD?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const POPres = await axios.get(`https://api.worldbank.org/v2/country/${wbID}/indicator/SP.POP.TOTL?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const country = await axios.get(`https://restcountries.com/v3.1/name/${name}?fields=languages,capital,flags`);

            const langs = Object.values(country?.data[0].languages)
            const GDPList = []
            const POPList = []

            GDPres.data[1].map(year => {
                GDPList.push(year.value)
            });
            POPres.data[1].map(year => {
                POPList.push(year.value)
            });

            const years = []
            for (let i = minYear; i <= maxYear; i++) {
                years.push(i)
            }

            setGDPvalues(GDPList);
            setPOPvalues(POPList);
            setYearList(years);

            setSelectedCountry({ ...selectedCountry, flag: country.data[0].flags.png, capital: country.data[0].capital, languages: langs });




        } catch (error) {

            // Check if the error is from the response
            if (error.response) {
                // Differentiate between errors based on the API that failed
                console.log(error.response.config.url)
                if (error.response.config.url.includes('restcountries')) {
                    setSelectedCountry({ ...selectedCountry, capital: ['NO DATA'], languages: ['NO DATA'], flag: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s' })
                }

                console.error('Error fetching country data:');
                console.error('Status Code:', error.response.status);
                console.error('Response Data:', error.response.data);
                console.error('Response Headers:', error.response.headers);
            } else if (error.request) {
                dispatch(openModal())
                dispatch(unsuccessful())
                dispatch(setMessage('No response received from the server. Please check your internet connection.'));
                console.error('Error Request:', error.request);
            } else {
                // Something happened in setting up the request
                dispatch(openModal())
                dispatch(unsuccessful())
                dispatch(setMessage('Could not retrieve data'));
                console.error('Error Message:', error.message);
            }

            // Display the error message to the user (replace this with your preferred method)
        } finally {
            setIsLoading(false)
        }
    }


    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (name === '') {
        return (
            <div className='infoContainer empty'>
                <h2>select a country from the map</h2>

            </div>
        )
    } else {
        return (
            <div className='infoContainer selected'>

                <h1 className='countryName'>{name}</h1>
                <Box sx={{
                    display: 'grid',
                    gridTemplateRows: '1fr auto', // Automatically size the graph and button
                    gap: '16px'
                }}>

                    <Button
                        variant="text"
                        onClick={handleSubmit}
                    >
                        SUBMIT
                    </Button>
                    <Box sx={{
                        height: '20%',
                        visibility: flag ? 'visible' : 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',

                    }}>


                        <Box>
                            <div>

                                <CountryAttributes name={name} continent={continent} name_es={name_es} name_ja={name_ja} name_tr={name_tr} flag={flag} capital={capital} languages={languages} />


                            </div>

                        </Box>
                        <Box>
                           GRAPH
                        </Box >

                    </Box>



                </Box>






            </div>
        )
    }



}

export default CountryInfo