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
