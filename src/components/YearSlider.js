import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

const minDistance = 1;

function valuetext(value) {
    return `${value}`;
}

export default function YearSlider({ setMaxYear, setMinYear, minYear, maxYear }) {
    // Initialize the slider value based on props
    const [value, setValue] = React.useState([minYear, maxYear]);

    // Handle slider changes with minimum distance constraint
    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            // Ensure the minimum distance is maintained
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
        }

        // Update parent component with new min and max year
        setMinYear(value[0]);
        setMaxYear(value[1]);
    };

    // Sync slider values with props
    React.useEffect(() => {
        setValue([minYear, maxYear]);
    }, [minYear, maxYear]);

    return (
        <Box sx={{ width: '90%', display:'flex', alignItems:'center', flexDirection:'column' }}>
            <Typography
                variant='h5'
            >
                Year Range
            </Typography>
            <Slider
                getAriaLabel={() => 'Year range'}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                disableSwap
                min={1960}  // Example min year, adjust as needed
                max={2024}  // Example max year, adjust as needed
                sx={{
                    color: 'primary.main', // Color for the slider track and thumb
                    '& .MuiSlider-thumb': {
                        borderRadius: '50%', // Example: round slider thumb
                        backgroundColor: 'pink', // Color for the slider thumb
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: '#eac8e4', // Color for the slider rail
                    },
                    '& .MuiSlider-track': {
                        backgroundColor: 'black', // Color for the slider track
                    },
                }}
            />
            <Typography
            variant='p'>
                {value[0]} - {value[1]}
            </Typography>
        </Box>
    );
}
