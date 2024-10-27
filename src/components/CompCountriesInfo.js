import { Button } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import Box from '@mui/material/Box';
import '../styles/CountryInfo.css'
import CountryAttributes from './CountryAttributes'
import { openModal, setMessage, unsuccessful } from '../features/modal/modalSlice';
import { URL } from '../global/consts';
import { useDispatch, useSelector } from 'react-redux';
import CompGraph from './CompGraph';
import { setIsLoading } from '../features/favorites/favoritesSlice';
import LoadingScreen from '../screens/LoadingScreen'

const CompCountryInfo = ({ selectedCountry1, selectedCountry2, minYear, maxYear, setSelectedCountry1, setSelectedCountry2 }) => {
    const [GDP1values, setGDP1values] = useState([])
    const [POP1values, setPOP1values] = useState([])
    const [GDP2values, setGDP2values] = useState([])
    const [POP2values, setPOP2values] = useState([])
    const [yearList, setYearList] = useState([])
    const {
        name: name1,
        continent: continent1,
        wbID: wbID1,
        name_es: name_es1,
        name_ja: name_ja1,
        name_tr: name_tr1,
        flag: flag1,
        capital: capital1,
        languages: languages1
    } = selectedCountry1;

    const {
        name: name2,
        continent: continent2,
        wbID: wbID2,
        name_es: name_es2,
        name_ja: name_ja2,
        name_tr: name_tr2,
        flag: flag2,
        capital: capital2,
        languages: languages2
    } = selectedCountry2;

    const {isLoading} = useSelector((store) => store.favorites)

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        dispatch(setIsLoading(true))
        try {

            const blockedCountries = await axios.get(`${URL}admin/countries`);
            if (blockedCountries.data.length > 0) {
                const blockedCountriesName = blockedCountries.data.map(country => country.country);

                if (blockedCountriesName.includes(selectedCountry1.name) || blockedCountriesName.includes(selectedCountry2.name)) {
                    dispatch(unsuccessful())
                    dispatch(setMessage('Country is blocked by admin, please select a different country'))
                    dispatch(openModal())
                    return;
                }
            }

            setIsLoading(true)
            const GDP1res = await axios.get(`https://api.worldbank.org/v2/country/${wbID1}/indicator/NY.GDP.MKTP.CD?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const POP1res = await axios.get(`https://api.worldbank.org/v2/country/${wbID1}/indicator/SP.POP.TOTL?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const GDP2res = await axios.get(`https://api.worldbank.org/v2/country/${wbID2}/indicator/NY.GDP.MKTP.CD?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const POP2res = await axios.get(`https://api.worldbank.org/v2/country/${wbID2}/indicator/SP.POP.TOTL?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const country1 = await axios.get(`https://restcountries.com/v3.1/name/${name1}?fields=languages,capital,flags`);
            const country2 = await axios.get(`https://restcountries.com/v3.1/name/${name2}?fields=languages,capital,flags`);

            const langs1 = Object.values(country1?.data[0].languages)
            const langs2 = Object.values(country2?.data[0].languages)
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
            for (let i = minYear; i <= maxYear; i++) {
                years.push(i)
            }
            setGDP1values(GDP1List);
            setPOP1values(POP1List);
            setGDP2values(GDP2List);
            setPOP2values(POP2List);
            setYearList(years);

            setSelectedCountry1({ ...selectedCountry1, flag: country1.data[0].flags.png, capital: country1.data[0].capital, languages: langs1 });
            setSelectedCountry2({ ...selectedCountry2, flag: country2.data[0].flags.png, capital: country2.data[0].capital, languages: langs2 });


        } catch (error) {

            // Check if the error is from the response
            if (error.response) {
                // Differentiate between errors based on the API that failed
                console.log(error.response.config.url)
                if (error.response.config.url.includes('restcountries')) {
                    if (error.response.config.url.includes(name1))
                        setSelectedCountry1({ ...selectedCountry1, capital: ['NO DATA'], languages: ['NO DATA'], flag: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s' })
                    else {
                        setSelectedCountry2({ ...selectedCountry2, capital: ['NO DATA'], languages: ['NO DATA'], flag: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTtukk7nN95mhQJNpUX7ctV8-St1eJ_J0wdw&s' })
                    }
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
            dispatch(setIsLoading(false))
        }
    }


    if (isLoading) {
        return (
            <div style={{marginTop:30}}>
                <LoadingScreen/>
            </div>
        )
    }

    if (name1 !== '' && name2 !== '') {
        return (
            <div className='infoContainer selected'>

                <Box sx={{
                    display: 'grid',
                    gridTemplateRows: '1fr auto', // Automatically size the graph and button
                    gap: '16px',
                    // width: '100%'
                }}>

                    <Button
                        variant="text"
                        onClick={handleSubmit}

                    >
                        SUBMIT
                    </Button>
                    <Box sx={{
                        height: '20%',
                        display: flag1 && flag2 ? 'flex' : 'none',
                        flexDirection: 'column',
                        marginTop: 3

                    }}>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems:'center' }}>
                            <div style={{ textAlign: 'center', margin: '0 20px', justifyContent:'center', alignItems:'center' }}>
                                <h3 style={{ margin: 0 , fontSize:30}}>{name1}</h3>

                                <CountryAttributes
                                    name={name1}
                                    continent={continent1}
                                    name_es={name_es1}
                                    name_ja={name_ja1}
                                    name_tr={name_tr1}
                                    flag={flag1}
                                    capital={capital1}
                                    languages={languages1}
                                />

                            </div>

                            <p style={{ fontWeight: 'bold', color: 'red', fontSize: 30, textAlign: 'center' }}>
                                VS.
                            </p>

                            <div style={{ textAlign: 'center', margin: '0 20px' }}>
                                <h3 style={{ margin: 0, fontSize:30 }}>{name2}</h3> {/* Remove default margin */}
                                <div>
                                    <CountryAttributes
                                        name={name2}
                                        continent={continent2}
                                        name_es={name_es2}
                                        name_ja={name_ja2}
                                        name_tr={name_tr2}
                                        flag={flag2}
                                        capital={capital2}
                                        languages={languages2}
                                    />
                                </div>
                            </div>
                        </div>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 13 }}>
                            <CompGraph years={yearList} pop1={POP1values} gdp1={GDP1values} pop2={POP2values} gdp2={GDP2values} name1={name1} name2={name2} />

                        </Box>


                    </Box>



                </Box>






            </div>
        )
    }



}

export default CompCountryInfo