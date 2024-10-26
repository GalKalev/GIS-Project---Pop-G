import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import L from 'leaflet';
import axios from 'axios';
import SearchBar from './SearchBar';



const CountryMap = ({ geoData, setSelectedCountry1, selectedCountry1, setSelectedCountry2, selectedCountry2, position, minYear, maxYear }) => {


  const map = useMapEvent('click', () => {
    map.setView(position.current, map.getZoom());
  });

  const previousLayer1 = useRef(null);
  const previousLayer2 = useRef(null);
  const selectedLayerRef1 = useRef(null);
  const selectedLayerRef2 = useRef(null);
  const countryLayers = useRef([]);

  useEffect(() => {
    // When selected country changes, maintain the style for the selected country
    if (selectedLayerRef1.current) {
      selectedLayerRef1.current.setStyle({
        color: '#941792',
        fillColor: '#941792',
        fillOpacity: 0.1,
      });
    }

    if (selectedLayerRef2.current) {
      selectedLayerRef2.current.setStyle({
        color: '#ea2c85',
        fillColor: '#ea2c85',
        fillOpacity: 0.1,
      });
    }
  }, [selectedCountry1, selectedCountry2,minYear, maxYear]);

  useEffect(() => {
    // When selected country changes, maintain the style for the selected country
    if (selectedCountry1.name === selectedCountry2.name) {
      setSelectedCountry2({
        name: '',
        continent: '',
        wbID: '',
        name_es: '',
        name_ja: '',
        name_tr: '',
        flag: '',
        capital: [],
        languages: [],
      })
    }
  }, [selectedCountry1]);



  const handleClickCountry = useCallback((event) => {
    const clickedLayer = event.target;
    const clickedCountry = clickedLayer.feature.properties.NAME_EN;

    // Prevent selecting the same country for both slots
    if (selectedCountry1.name === clickedCountry || selectedCountry2.name === clickedCountry) {
      return;
    }

    // Set the map view to the centroid of the clicked country
    const centroid = turf.centroid(clickedLayer.feature.geometry);
    const centroidCoordinates = centroid.geometry.coordinates;
    position.current = [centroidCoordinates[1], centroidCoordinates[0]];
    map.setView(position.current, map.getZoom());

    // Handle country 1 selection
    if (!previousLayer1.current && !selectedLayerRef1.current) {
      selectedLayerRef1.current = clickedLayer;
      previousLayer1.current = clickedLayer;
      clickedLayer.setStyle({
        color: '#f338d1',
        fillColor: '#f338d1',
        fillOpacity: 0.1,
      });
      const { NAME_EN, CONTINENT, WB_A3, NAME_JA, NAME_ES, NAME_TR } = clickedLayer.feature.properties;
      setSelectedCountry1({ name: NAME_EN, continent: CONTINENT, wbID: WB_A3, name_ja: NAME_JA, name_es: NAME_ES, name_tr: NAME_TR });
      return;
    }

    // Handle country 2 selection
    if (!previousLayer2.current && !selectedLayerRef2.current && clickedLayer !== selectedLayerRef1.current) {
      selectedLayerRef2.current = clickedLayer;
      previousLayer2.current = clickedLayer;
      clickedLayer.setStyle({
        color: '#2cf111',
        fillColor: '#2cf111',
        fillOpacity: 0.1,
      });
      const { NAME_EN, CONTINENT, WB_A3, NAME_JA, NAME_ES, NAME_TR } = clickedLayer.feature.properties;
      setSelectedCountry2({ name: NAME_EN, continent: CONTINENT, wbID: WB_A3, name_ja: NAME_JA, name_es: NAME_ES, name_tr: NAME_TR });
      return;
    }

    // Deselect country 1
    if (selectedLayerRef1.current === clickedLayer) {
      clickedLayer.setStyle({
        fillColor: '#f338d1',
        weight: 1,
        color: 'black',
        fillOpacity: 0.0,
      });
      previousLayer1.current = null;
      selectedLayerRef1.current = null;
      setSelectedCountry1({
        name: '',
        continent: '',
        wbID: '',
        name_es: '',
        name_ja: '',
        name_tr: '',
        flag: '',
        capital: [],
        languages: [],
      });
      return;
    }

    // Deselect country 2
    if (selectedLayerRef2.current === clickedLayer) {
      clickedLayer.setStyle({
        fillColor: '#f338d1',
        weight: 1,
        color: 'black',
        fillOpacity: 0.0,
      });
      previousLayer2.current = null;
      selectedLayerRef2.current = null;
      setSelectedCountry2({
        name: '',
        continent: '',
        wbID: '',
        name_es: '',
        name_ja: '',
        name_tr: '',
        flag: '',
        capital: [],
        languages: [],
      });
      return;
    }



  }, [selectedCountry1, selectedCountry2]);

  const handleSearchSelection = useCallback((selectedCountry) => {

    const foundLayer = countryLayers.current.find(layer => layer.feature.properties.NAME_EN === selectedCountry);

    if (foundLayer) {
      const centroid = turf.centroid(foundLayer.feature.geometry);
      const centroidCoordinates = centroid.geometry.coordinates;
      position.current = [centroidCoordinates[1], centroidCoordinates[0]];

      const popup = L.popup()
        .setLatLng(position.current)
        .setContent(foundLayer.feature.properties.NAME_EN)
        .openOn(map);

      map.setView(position.current, map.getZoom());


    }
  }, [handleClickCountry, map, position]);


  return (
    <>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '40%',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
        }}>
          <SearchBar
            setSelectedCountry={setSelectedCountry1}
            handleSearchSelection={handleSearchSelection}
          />
        </div>

      </div>

      {geoData && (
        <GeoJSON
          data={geoData}
          style={{
            fillColor: '#f338d1', // Default color for unclicked countries
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.0, // Default to transparent
          }}

          onEachFeature={(feature, layer) => {
            countryLayers.current.push(layer);

            layer.on({
              click: handleClickCountry,

              mouseover: (e) => {
                const hoveredLayer = e.target;
                const mouseOverName = hoveredLayer.feature.properties.NAME_EN;

                // If the hovered country is NOT country1 or country2, show the hover effect
                if (
                  selectedLayerRef1.current?.feature.properties.NAME_EN !== mouseOverName &&
                  selectedLayerRef2.current?.feature.properties.NAME_EN !== mouseOverName
                ) {


                  hoveredLayer.setStyle({
                    color: '#f338d1',
                    fillColor: '#f338d1',
                  });
                }
                const popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(feature.properties.NAME_EN)
                  .openOn(map);
              },

              mouseout: (e) => {
                const hoveredLayer = e.target;
                const mouseOutName = hoveredLayer.feature.properties.NAME_EN;

                // If the mouse-out country is NOT country1 or country2, reset the style
                if (
                  selectedLayerRef1.current?.feature.properties.NAME_EN !== mouseOutName &&
                  selectedLayerRef2.current?.feature.properties.NAME_EN !== mouseOutName
                ) {
                  hoveredLayer.setStyle({
                    fillColor: '#f338d1',
                    weight: 1,
                    color: 'black',
                    fillOpacity: 0.0,
                  });
                }

                // Close the popup
                map.closePopup();
              },
            });
          }}
        />
      )}
    </>
  );
};

const Map = ({ setSelectedCountry1, setSelectedCountry2, selectedCountry1, selectedCountry2,minYear, maxYear }) => {
  const [geoData, setGeoData] = useState(null);
  const position = useRef([51.505, -0.09])

  const fetchData = async () => {
    try {
      const res = await axios.get('/worldBankMap.geojson');
      setGeoData(res.data);
    } catch (error) {
      console.error('Error fetching GeoJSON:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MapContainer
      style={{ height: '100%', width: '100%' }}
      center={position.current}
      zoom={2}
      scrollWheelZoom={false}
      continuousWorld={true}
      maxBounds={[[-85, -Infinity], [85, Infinity]]}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      {geoData && (
        <CountryMap
          geoData={geoData}
          setSelectedCountry1={setSelectedCountry1}
          selectedCountry1={selectedCountry1}
          setSelectedCountry2={setSelectedCountry2}
          selectedCountry2={selectedCountry2}
          position={position}
          minYear={minYear}
          maxYear={maxYear}
        />
      )}
    </MapContainer>
  );
};

export default Map;
