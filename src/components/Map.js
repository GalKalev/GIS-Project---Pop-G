import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import L from 'leaflet';
import axios from 'axios';
import SearchBar from './SearchBar';



const CountryMap = ({ geoData, setSelectedCountry, selectedCountry, position, handleId }) => {


  const map = useMapEvent('click', () => {
    map.setView(position.current, map.getZoom());
  });

  const previousLayer = useRef(null);
  const selectedLayerRef = useRef(null);
  const countryLayers = useRef([]);

  useEffect(() => {
    // When selected country changes, maintain the style for the selected country
    if (selectedLayerRef.current) {
      selectedLayerRef.current.setStyle({
        color: '#f338d1',
        fillColor: '#f338d1',
        fillOpacity: 0.1,
      });
    }
  }, [selectedCountry]);

  const handleClickCountry = useCallback((event) => {
    event.target.setStyle({
      color: '#f338d1',
      fillColor: '#f338d1',
      fillOpacity: 0.1,
    })

    if (previousLayer.current && previousLayer.current !== event.target) {
      previousLayer.current.setStyle({
        fillColor: '#f338d1',
        weight: 1,
        color: 'black',
        fillOpacity: 0.0,
      });
    }

    previousLayer.current = event.target;
    selectedLayerRef.current = event.target;

    const name = event.target.feature.properties.NAME_EN;
    const continent = event.target.feature.properties.CONTINENT;
    const wbID = event.target.feature.properties.WB_A3;
    const name_ja = event.target.feature.properties.NAME_JA;
    const name_es = event.target.feature.properties.NAME_ES;
    const name_tr = event.target.feature.properties.NAME_TR;

    setSelectedCountry({ name, continent, wbID, name_ja, name_es, name_tr })

    const centroid = turf.centroid(event.target.feature.geometry);
    const centroidCoordinates = centroid.geometry.coordinates;
    position.current = [centroidCoordinates[1], centroidCoordinates[0]]

    map.setView(position.current, map.getZoom());


  })

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
      <div style={{ position: 'relative'}}>
        <div style={{
          position: 'absolute',
          left: '40%',
          zIndex: 1000,  
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
        }}>
          <SearchBar
            setSelectedCountry={setSelectedCountry}
            handleSearchSelection={handleSearchSelection}
          />
        </div>

      </div>

      {geoData && (
        <GeoJSON
          data={geoData}
          style={{
            fillColor: '#f338d1', // Default color for unclicked countries
            // weight: 1,
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
                const popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(feature.properties.NAME_EN)
                  .openOn(map);

                hoveredLayer.setStyle({
                  color: '#f338d1',
                  fillColor: '#f338d1',
                });
              },
              mouseout: (e) => {
                const hoveredLayer = e.target;
                map.closePopup();
                if (hoveredLayer !== previousLayer.current) {
                  hoveredLayer.setStyle({
                    fillColor: '#f338d1',
                    weight: 1,
                    color: 'black',
                    fillOpacity: 0.0,
                  });
                }
              },
            });
          }}
        />
      )}
    </>
  );
};

const Map = ({ setSelectedCountry, selectedCountry, handleId }) => {
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
          setSelectedCountry={setSelectedCountry}
          selectedCountry={selectedCountry}
          position={position}
          handleId={handleId}
        />
      )}
    </MapContainer>
  );
};

export default Map;
