import React, { useEffect, useState } from 'react'
import Map from './Map';
import CountryInfo from './CountryInfo';
import YearSlider from './YearSlider';
import { Box, Fade, IconButton, Tooltip } from '@mui/material';
import { FavoriteIcon } from '../global/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBasicFavorite, deleteBasicFavorite, setBasic } from '../features/favorites/favoritesSlice';
import { APP_COLOR } from '../global/consts';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
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
    const [maxYear, setMaxYear] = useState(yearToday.getFullYear() - 1);

    const [isFavored, setIsFavored] = useState(false)
    const [favoredCountryId, setFavoredCountryId] = useState(null)

    const [isMapShrunken, setIsMapShrunken] = useState(false)

    const { basic, isLoading } = useSelector((store) => store.favorites)
    const { id } = useSelector((store) => store.user)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const mapSizeBtnStyle = {
        color: 'black',           // Icon color
        borderWidth: 3,           // Border width
        borderColor: 'black',     // Border color
        borderStyle: 'solid',     // Border style (required to show the border)
        borderRadius: 20,          // Optional: rounded corners
        padding: 1,
        marginRight: 4,
    }


    


    useEffect(() => {
        checkFavorite()
    }, [selectedCountry, minYear, maxYear, basic])

    const checkFavorite = () => {
        let isCurrentFavored = false;
        let countryId = null;
        basic?.map((b) => {
            if (b.country === selectedCountry.name && b.minYear === minYear && b.maxYear === maxYear) {
                console.log('belong to favorites');
                console.log(b.id);
                countryId = b.id;
                isCurrentFavored = true;
                
                return;
            }
        })
        setIsFavored(isCurrentFavored);
        setFavoredCountryId(countryId)
        return isCurrentFavored;
    }

    const handleFavorite = async () => {

        if (id) {

            const country = selectedCountry.name;
            const WBId = selectedCountry.wbID;
            const currBasic = { id, country, WBId, minYear, maxYear }
            if (!isFavored) {
                try {
                    const res = await dispatch(addBasicFavorite(currBasic));

                    if (res.type === "/favorites/addBasic/fulfilled") {
                        console.log(res.payload)
                        dispatch(setBasic(res.payload));
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
                    const res = await dispatch(deleteBasicFavorite({userId: id, id:favoredCountryId}))

                    if (res.type === "/favorites/deleteBasic/fulfilled") {
                        dispatch(setBasic(res.payload));
                        console.log(res.payload)
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

   
    const handleMapShrink = () => {
        setIsMapShrunken(!isMapShrunken);
    }

    return (


        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    sx={{
                        display: 'flex',
                        // position:'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 20,
                        textAlign: 'center',
                        padding: 2,
                        '& svg': {
                            margin: 'auto',
                            display: 'block',
                        },
                        zIndex: 10000,

                    }}
                    onClick={handleMapShrink}>
                    {isMapShrunken ? (
                        <ZoomOutMapIcon sx={mapSizeBtnStyle} />
                    ) : (
                        <ZoomInMapIcon sx={mapSizeBtnStyle} />
                    )}
                </IconButton>

            </div>

            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '80vh', maxHeight: '200vh' }}>
                <div

                     style={{
                        flex: 2,
                        margin: '0px 20px',
                        border: '1px solid black',
                        display: isMapShrunken ? 'none' : 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}
                >
                    <Map
                        setSelectedCountry={setSelectedCountry}
                        selectedCountry={selectedCountry}
                        minYear={minYear}
                        maxYear={maxYear}
                        isMapShrunken={isMapShrunken}
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
                        isMapShrunken={isMapShrunken}

                    />
                    {selectedCountry.flag && !isLoading ? (
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

        </div>

    )
}

export default Country