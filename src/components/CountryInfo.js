import { Button, Icon, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import '../styles/CountryInfo.css'
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import InfoIcon from '@mui/icons-material/Info';

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
                    // justifyContent: 'center',
                }}>

                    <Box>
                        <div>
                            <Collapse in={showMoreInfo}
                                sx={{ backgroundColor: '#efefef', padding: '0px 50px', borderRadius: 5, paddingBottom: 3 }}
                            >{
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                            <Box
                                                sx={infoContainerSX}
                                            >
                                                <EmojiFlagsIcon
                                                    sx={iconsSX}
                                                />
                                                <img
                                                    src={flag}
                                                    alt="Flag"
                                                    style={{ width: '150px', height: '150px', objectFit: 'contain' }} // Change values as needed
                                                />

                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexDirection: 'column' }}>

                                                <Box sx={infoContainerSX}>
                                                    <Icon sx={iconsSX}>
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/128/82/82269.png"
                                                            alt="Custom Icon"
                                                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                                        />
                                                    </Icon>
                                                    <div>{continent}</div>
                                                </Box>
                                                <Box sx={infoContainerSX}>
                                                    <Icon sx={iconsSX}>
                                                        <img
                                                            src="https://cdn-icons-png.flaticon.com/512/3008/3008506.png"
                                                            alt="Custom Icon"
                                                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                                        />
                                                    </Icon>
                                                    <div>{capital?.join(', ')}</div>
                                                </Box>


                                            </Box>
                                        </Box>

                                        <Box sx={infoContainerSX}>
                                            <Icon sx={iconsSX}>
                                                <img
                                                    src="https://t3.ftcdn.net/jpg/02/07/54/36/240_F_207543651_92R9UPXVDKqi08NklMcJRbWFqYBn2Bw2.jpg"
                                                    alt="Custom Icon"
                                                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                />
                                            </Icon>
                                            <div>{languages?.join(', ')}</div>
                                        </Box>



                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                                            <Box sx={infoContainerSX}>
                                                <Icon sx={iconsSX}>
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/128/10601/10601048.png"
                                                        alt="Custom Icon"
                                                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                    />
                                                </Icon>
                                                <div>{name_es}</div>
                                            </Box>
                                            <Box sx={infoContainerSX}>
                                                <Icon sx={iconsSX}>
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/128/4628/4628673.png"
                                                        alt="Custom Icon"
                                                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                    />
                                                </Icon>
                                                <div>{name_tr}</div>
                                            </Box>
                                            <Box sx={infoContainerSX}>
                                                <Icon sx={iconsSX}>
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/128/4628/4628642.png"
                                                        alt="Custom Icon"
                                                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                    />
                                                </Icon>
                                                <div>{name_ja}</div>
                                            </Box>



                                        </Box>

                                    </Box>
                                }</Collapse>

                        </div>

                    </Box>

                    <FormControlLabel
                        control={
                            <IconButton
                                size="small"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                color="black"
                                onClick={handleMoreInfo}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                MORE INFO
                                <InfoIcon />

                            </IconButton>}

                    />
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