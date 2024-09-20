import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { Box } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import axios from 'axios';

const SearchContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',  // Ensure positioning is relative to this container
});

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha('#fff', 0.7),
    '&:hover': {
        backgroundColor: alpha("#fff", 1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '300px',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '300px',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

function renderRow({ index, style, data }) {
    const { filteredCountries, handleSearchSelection } = data;
    const countryName = filteredCountries[index];

    return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton
                onClick={() => {
                    handleSearchSelection(countryName)
                }}
            >
                <ListItemText primary={countryName} />
            </ListItemButton>
        </ListItem>
    );
}

const SearchBar = ({ setSelectedCountry, handleSearchSelection }) => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [showList, setShowList] = useState(false);

    const handleSearch = (event) => {
        setValue(event.target.value);
        setShowList(event.target.value.length > 0);
    };

    const getCountriesList = async () => {
        try {
            const res = await axios.get('/worldBankMap.geojson');
            const countriesList = res.data.features.map((country => country.properties.NAME_EN));
            setData(countriesList.sort());
        } catch (error) {
            console.error('Error fetching countries list: ' + error.message);
        }
    };

    useEffect(() => {
        getCountriesList();
    }, []);

    useEffect(() => {
        if (data) {
            setFilteredCountries(
                data.filter((countryName) =>
                    countryName.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    }, [data, value]);

    return (
        <SearchContainer>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search a Country…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={value}
                    onChange={handleSearch}
                />
            </Search>
            {showList && value && (
                <Box
                    sx={{
                        width: '100%',  // Match the width of the search bar
                        height: 200,
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                        position: 'absolute',
                        top: 'calc(100% + 8px)', // Position it below the search bar
                        left: 0, // Align it with the left edge of the search bar
                        zIndex: 1,
                        borderRadius: 1, // Optional: add border-radius for styling
                        boxShadow: 3, // Optional: add a shadow for better visibility
                    }}
                >
                    <FixedSizeList
                        height={200}
                        width={360}
                        itemSize={46}
                        itemCount={filteredCountries.length}
                        overscanCount={5}
                        itemData={{ filteredCountries, handleSearchSelection }}
                    >
                        {renderRow}
                    </FixedSizeList>
                </Box>
            )}
        </SearchContainer>
    );
};

export default SearchBar;
