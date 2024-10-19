import axios from "axios";
// ----------- styles ------------
export const APP_COLOR = '#eac8e4';

// ----------- functions ------------

export const getCountriesList = async () => {

    try {
        const res = await axios.get('/worldBankMap.geojson');
        const list = res.data.features;
        return list;
    } catch (e) {
        console.error('error fetching from geojson: ' + e.error);
    }

}

// ----- SERVER URL -----
// export const url = 'https://gis-project-pop-g-backend.onrender.com/'
export const URL = 'http://localhost:8000/'
