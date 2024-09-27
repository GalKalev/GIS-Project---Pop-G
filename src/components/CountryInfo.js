import { Button, Icon, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import '../styles/CountryInfo.css'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import InfoIcon from '@mui/icons-material/Info';
import CountryAttributes from './CountryAttributes'

const CountryInfo = ({ selectedCountry, minYear, maxYear, setSelectedCountry }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(true)
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

    const GDPvalues = []
    const POPvalues = []
    const yearList = []

    const iconsSX = {
        width: '50px',
        height: '50px',
        objectFit: 'contain',
        position: 'absolute',
        left: -25,
        border: '1px solid black',
        borderRadius: 10,
        backgroundColor: 'white'
    }
    const infoContainerSX = {
        border: '1px solid black',
        padding: '10px 30px',
        borderRadius: 10,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginTop: 2,
        justifyContent: 'center',
        marginTop: 3
    }

    useEffect(() => {
        setShowMoreInfo(false);
    }, [selectedCountry])


    const handleSubmit = async () => {
        try {

            setIsLoading(true)
            GDPvalues.length = 0
            POPvalues.length = 0
            yearList.length = 0

            const GDPres = await axios.get(`https://api.worldbank.org/v2/country/${wbID}/indicator/NY.GDP.MKTP.CD?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const POPres = await axios.get(`https://api.worldbank.org/v2/country/${wbID}/indicator/SP.POP.TOTL?date=${minYear}:${maxYear}&per_page=300&format=json`)
            const country = await axios.get(`https://restcountries.com/v3.1/name/${name}?fields=languages,capital,flags`)

            console.log(country.data[0].languages)
            const langs = Object.values(country.data[0].languages)

            GDPres.data[1].map(year => {
                GDPvalues.push(year.value)
            })
            POPres.data[1].map(year => {
                POPvalues.push(year.value)
            })

            setSelectedCountry({ ...selectedCountry, flag: country.data[0].flags.png, capital: country.data[0].capital, languages: langs });




        } catch (error) {
            console.error('error fetching country data: ' + error.message);
        } finally {
            setIsLoading(false)
        }
    }

    const handleMoreInfo = () => {
        setShowMoreInfo(!showMoreInfo);
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
                    height: '20%',
                    visibility: flag ? 'visible' : 'hidden',
                    display: 'flex', flexDirection: 'column',
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






                <Button
                    variant="text"
                    onClick={handleSubmit}
                >
                    SUBMIT
                </Button>

            </div>
        )
    }



}

export default CountryInfo