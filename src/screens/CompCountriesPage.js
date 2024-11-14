import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import CompMap from '../components/CompMap'
import YearSlider from '../components/YearSlider';
import { FavoriteIcon } from '../global/icons';
import { Box, Fade, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { APP_COLOR } from '../global/consts';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, setMessage, unsuccessful } from '../features/modal/modalSlice';
import CompCountryInfo from '../components/CompCountriesInfo';
import { addCompareFavorite, deleteCompareFavorite, setComp } from '../features/favorites/favoritesSlice';


const CompCountriesPage = () => {
    const [selectedCountry1, setSelectedCountry1] = useState({
        name: '',
        continent: '',
        wbID: '',
        name_es: '',
        name_ja: '',
        name_tr: '',
        flag: '',
        capital: [],
        languages: []

    });
    const [selectedCountry2, setSelectedCountry2] = useState({
        name: '',
        continent: '',
        wbID: '',
        name_es: '',
        name_ja: '',
        name_tr: '',
        flag: '',
        capital: [],
        languages: []

    });

    const yearToday = new Date();
    const [minYear, setMinYear] = useState(1960);
    const [maxYear, setMaxYear] = useState(yearToday.getFullYear() - 1);

    const [isFavored, setIsFavored] = useState(false)
    const [favoredCountriesId, setFavoredCountriesId] = useState(null)

    const { comp, isLoading } = useSelector((store) => store.favorites)
    const { id } = useSelector((store) => store.user)

    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        checkFavorite()
    }, [selectedCountry1, selectedCountry2, minYear, maxYear, comp])

    const checkFavorite = () => {
        let isCurrentFavored = false
        let countriesId = null;
        comp?.map((c) => {
            if (c.country1 === selectedCountry1.name && c.country2 === selectedCountry2.name && c.minYear === minYear && c.maxYear === maxYear) {
                console.log('belong to favorites');
                isCurrentFavored = true;
                countriesId = c.id;
                return;
            }
        })
        setIsFavored(isCurrentFavored);
        setFavoredCountriesId(countriesId)
        return isCurrentFavored;
    }

    const handleFavorite = async () => {


        const country1 = selectedCountry1.name;
        const WBId1 = selectedCountry1.wbID;
        const country2 = selectedCountry2.name;
        const WBId2 = selectedCountry2.wbID;
        const currCompare = { id, country1, country2, minYear, maxYear, WBId1, WBId2 }
        if (!isFavored) {
            try {
                const res = await dispatch(addCompareFavorite(currCompare));

                if (res.type === "/favorites/addCompare/fulfilled") {
                    dispatch(setComp(res.payload));
                } else {
                    throw Error()
                }

            } catch (error) {
                dispatch(openModal())
                dispatch(unsuccessful())
                dispatch(setMessage('Error occurred while adding to Favorites, please try again later '))
                console.error('error adding to compare favorites: ' + error.message)
            }
        } else {
            try {
                const res = await dispatch(deleteCompareFavorite({ userId: id, id: favoredCountriesId }))

                if (res.type === "/favorites/deleteCompare/fulfilled") {
                    dispatch(setComp(res.payload))
                } else {
                    throw Error()
                }

            } catch (error) {
                dispatch(openModal())
                dispatch(unsuccessful())
                dispatch(setMessage('Error occurred while removing from Favorites, please try again later '))
                console.error('error deleting a compare favorite: ' + error.message)
            }
        }



    }





    return (
        <main style={{ marginTop: -25, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Header
                title={'Compare Countries'}
                text={
                    <>
                        Select two countries to compare between their GDP and population in a chosen year range.<br />
                        You can deselect by pressing the countries you chose again.
                    </>
                } />

            <h1>{selectedCountry1.name ? selectedCountry1.name : 'Select the first country'} VS. {selectedCountry2.name ? selectedCountry2.name : 'Select the second country'}</h1>

            <YearSlider
                setMaxYear={setMaxYear}
                setMinYear={setMinYear}
                maxYear={maxYear}
                minYear={minYear}
            />

            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
                width: '100%',
                // backgroundColor:'pink'
            }}>
                <CompCountryInfo selectedCountry1={selectedCountry1} selectedCountry2={selectedCountry2} setSelectedCountry1={setSelectedCountry1} setSelectedCountry2={setSelectedCountry2} maxYear={maxYear} minYear={minYear} />


                {selectedCountry1.flag && selectedCountry2.flag && !isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tooltip

                            title={isFavored ? 'Remove from favorites' : 'Add to Favorite'}
                            arrow
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            PopperProps={{
                                sx: {
                                    '& .MuiTooltip-tooltip': {
                                        fontSize: '12px', // Adjust font size here
                                        padding: '15px',
                                        borderRadius: 2

                                    },
                                },
                            }}
                        >
                            <IconButton
                                onClick={handleFavorite}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 20,
                                    textAlign: 'center',
                                    padding: 2,
                                    '& svg': {
                                        margin: 'auto', // Ensure icon takes up available space
                                        display: 'block', // Make sure SVG is displayed as a block-level element
                                    },
                                }}
                            >
                                <FavoriteIcon style={{
                                    color: 'black',           // Icon color
                                    backgroundColor: isFavored ? APP_COLOR : null,
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
                        </Tooltip>
                    </Box>

                ) : (
                    <></>
                )

                }

            </Box>


            {/* Render Map component by default */}
            <div style={{ marginTop: '15px', width: '90%', height: '400px' }}>
                <CompMap
                    setSelectedCountry1={setSelectedCountry1}
                    setSelectedCountry2={setSelectedCountry2}
                    selectedCountry1={selectedCountry1}
                    selectedCountry2={selectedCountry2}
                    minYear={minYear}
                    maxYear={maxYear}
                />
            </div>

        </main>
    );
};

export default CompCountriesPage;