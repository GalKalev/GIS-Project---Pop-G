import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const IOSSwitch = styled(({ checked, ...props }) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    checked={checked}
    {...props}
  />
))(({ theme, checked }) => ({
  width: 145, // Set width to 100px
  height: 34, // Adjust height
  padding: 0,
  position: 'relative',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 4,
    transitionDuration: '500ms',
    '&.Mui-checked': {
      transform: 'translateX(111px)', // Move thumb to the right end
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 25, // Thumb size
    height: 25,
    opacity: 0.7, // Set thumb opacity
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: '#6595c4',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    position: 'relative',
    '&:before': {
      content: checked ? '"Horizontal"' : '"Vertical"', // Set dynamic text based on `checked`
      position: 'absolute',
      width: '100%',
      textAlign: 'center', // Center the text horizontally
      top: '50%',
      transform: 'translateY(-50%)', // Center the text vertically
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#000', // Text color for better visibility
      zIndex: 1, // Ensure text stays on top of thumb
    },
  },
}));


export default function GraphComp(props) {
  const [countryGDP, setCountryGDP] = useState(null)
  const [countryPop, setCountryPop] = useState(null)


  const [rangeFrom, setRangeFrom] = useState(null)
  const [rangeTo, setRangeTo] = useState(null)

  /

  fetch('https://api.worldbank.org/v2/country/br/indicator/NY.GDP.MKTP.CD?date=2006&format=json')
    .then((response) => response.json())
    .then((data) => {

      setCountryGDP(data[1][0].value)

    })
    .catch((error) => console.error('Error loading GeoJSON:', error));

  fetch('https://api.worldbank.org/v2/country/br/indicator/SP.POP.TOTL?date=2006&format=json')
    .then((response) => response.json())
    .then((data) => {

      setCountryPop(data[1][0].value)

    })
    .catch((error) => console.error('Error loading GeoJSON:', error));

  // const [checked, setChecked] = React.useState(true);

  // const handleChange = (event) => {
  //   setChecked(event.target.checked);
  // };

  // const [state, setState] = React.useState({
  //   checkedA: true
  // });

  // const handleChange = (event) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };


  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="80vh" // Adjust the height as necessary
      >
        <FormGroup sx={{
          padding: 0,
          marginTop: 2,
        }}>
          {/* <FormControlLabel control={<Checkbox
            checked={checked}
            onChange={handleChange}
          />} label="Horizontal" /> */}
          {/* <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} 
            defaultChecked
            onChange={handleChange} />}
            label="iOS style"
          /> */}
          <IOSSwitch checked={checked} onChange={handleChange} />
        </FormGroup>
        <BarChart sx={{
          marginTop: 0,
        }}
          xAxis={checked ? null : [{ scaleType: 'band', data: ['group A'] }]}
          yAxis={checked ? [{ scaleType: 'band', data: ['group A'] }] : null}
          series={[{ data: [countryPop / 1000000] }, { data: [countryGDP / 1000000000] }]}
          layout={checked ? "horizontal" : "vertical"}
          width={600}
          height={600}
        />
      </Box>
    </>
  );
}
