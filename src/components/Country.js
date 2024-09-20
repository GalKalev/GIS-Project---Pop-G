import React, { useRef, useState } from 'react'
import Map from './Map';
import CountryInfo from './CountryInfo';
import YearSlider from './YearSlider';

const Country = () => {
    const [selectedCountry, setSelectedCountry] = useState({
        name: '',
        continent: '',
        wbID: '',
        name_es: '',
        name_ja: '',
        name_tr: '',
        flag:'',
        capital:[],
        languages:[]

    });

    const yearToday = new Date();
    const [minYear, setMinYear] = useState(1960);
    const [maxYear, setMaxYear] = useState(yearToday.getFullYear());

    const id = useRef('id');

    const handleId = (newId) => {
        id.current = newId;
        console.log('new id: ' + newId);
    }

    return (


        <div style={{ display: 'flex', flexDirection: 'row', minHeight:'80vh', maxHeight:'200vh' }}>
            <div style={{ flex: 1, margin: '0px 20px', border: '1px solid black',display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:"red" }}>
                <Map
                    setSelectedCountry={setSelectedCountry}
                    selectedCountry={selectedCountry}
                    handleId={handleId}
                />
            </div>
            <div style={{ width: '30%', flex:1 }}>
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

            </div>
        </div>

    )
}

export default Country