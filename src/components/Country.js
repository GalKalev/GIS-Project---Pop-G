import React, { useEffect, useState } from 'react'
import Map from './Map';
import CountryInfo from './CountryInfo';
import YearSlider from './YearSlider';
import { Box, Fade, IconButton, Tooltip } from '@mui/material';
import { FavoriteIcon } from '../global/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBasic, addBasicFavorite, deleteBasic, deleteBasicFavorite } from '../features/favorites/favoritesSlice';
import { APP_COLOR } from '../global/consts';
import { openModal, setMessage, unsuccessful } from '../features/modal/modalSlice';

const Country = () => {
    const [selectedCountry, setSelectedCountry] = useState({
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
    const [maxYear, setMaxYear] = useState(yearToday.getFullYear());

    const [isFavored, setIsFavored] = useState(false)

    const { basic } = useSelector((store) => store.favorites)
    const {id} = useSelector((store) => store.user)
    const navigate = useNavigate()
    const dispatch = useDispatch();


    useEffect(() => {
        checkFavorite()
    }, [selectedCountry, minYear, maxYear, basic])

    const checkFavorite = () => {
        let isCurrentFavored = false
        basic?.map((b) => {
            if (b.country === selectedCountry.name && b.minYear === minYear && b.maxYear === maxYear) {
                console.log('belong to favorites');
                isCurrentFavored = true;
                return;
            }
        })
        setIsFavored(isCurrentFavored);
        return isCurrentFavored;
    }

    const handleFavorite = async () => {

        if (id) {

            const country = selectedCountry.name;
            const currBasic = { id, country, minYear, maxYear}
            if (!isFavored) {
                try {
                    const res = await dispatch(addBasicFavorite(currBasic));

                    if (res.type === "/favorites/addBasic/fulfilled") {
                        dispatch(addBasic({ maxYear,  minYear, country }));
                    } else {
                        throw Error()
                    }

                } catch (error) {
                    dispatch(openModal())
                    dispatch(unsuccessful())
                    dispatch(setMessage('Error occurred while adding to Favorites, please try again later '))
                    console.error('error adding to basic favorites: ' + error.message)
                }
            } else {
                try {
                    const res = await dispatch(deleteBasicFavorite(currBasic))

                    if (res.type === "/favorites/deleteBasic/fulfilled") {
                        dispatch(deleteBasic({ maxYear: maxYear, minYear: minYear, country: country }));
                    } else {
                        throw Error()
                    }

                } catch (error) {
                    dispatch(openModal())
                    dispatch(unsuccessful())
                    dispatch(setMessage('Error occurred while removing from Favorites, please try again later '))
                    console.error('error deleting a basic favorite: ' + error.message)
                }
            }


        } else {
            navigate('/login')
        }

    }

    return (


        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '80vh', maxHeight: '200vh' }}>
            <div style={{ flex: 2, margin: '0px 20px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Map
                    setSelectedCountry={setSelectedCountry}
                    selectedCountry={selectedCountry}
                    minYear={minYear}
                    maxYear={maxYear}
                />
            </div>
            <Box sx={{
                flex: 1,
                alignItems: 'center',
                display: 'flex',          
                flexDirection: 'column', 
                alignContent: 'center'
            }}>
                <YearSlider
                    setMaxYear={setMaxYear}
                    setMinYear={setMinYear}
                    maxYear={maxYear}
                    minYear={minYear}
                />
                <CountryInfo
                    selectedCountry={selectedCountry}
                    maxYear={maxYear}
                    minYear={minYear}
                    setSelectedCountry={setSelectedCountry}

                />
                {selectedCountry.flag ? (
                    <Tooltip

                        title={isFavored ? 'Remove from favorites' : 'Add to Favorite'}
                        arrow
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        PopperProps={{
                            sx: {
                                '& .MuiTooltip-tooltip': {
                                    fontSize: '12px',
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
                                    margin: 'auto', 
                                    display: 'block',
                                },
                            }}
                        >
                            <FavoriteIcon style={{
                                color: 'black',           
                                backgroundColor: isFavored ? APP_COLOR : null,
                                borderWidth: 2,          
                                borderColor: 'black',     
                                borderStyle: 'solid',     
                                borderRadius: 20,          
                                padding: 1,
                                marginRight: 4,
                                alignItems: 'center'
                            }}
                                title={'Favorite'}
                                fontSize='small'
                            />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <></>
                )

                }

            </Box>
        </div>

    )
}

export default Country