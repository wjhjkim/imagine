import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { LAT as newLat, LON as newLon} from './LocationContext';  // Assuming these values are updated dynamically
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Mapbox = () => {
  console.log(newLat, newLon);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ lat: newLat, lon: newLon });
  const [useNewCoordinates, setUseNewCoordinates] = useState(true); // Add a state to switch between coordinate sets

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3dhbmtpbSIsImEiOiJjbHl1MWl2cmcwNTViMnFwdnFhODVyMzdhIn0.KVOQyW0jDTM26vGIM_nIrQ';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [127.36565860037672, 36.37416931298615],
      zoom: 0.1
    });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      addCoordinates(coordinates.lat, coordinates.lon);
    }
  }, [coordinates]);

  const addCoordinates = (lat, lon) => {
    const coordinateFeature = (lng, lat) => ({
      center: [lng, lat],
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      place_name: 'Lat: ' + lat + ' Lng: ' + lng,
      place_type: ['coordinate'],
      properties: {},
      type: 'Feature'
    });

    const geocode = coordinateFeature(lon, lat);
    mapRef.current.flyTo({
      center: geocode.center,
      zoom: 0.3
    });

    new mapboxgl.Marker().setLngLat(geocode.center).addTo(mapRef.current);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (useNewCoordinates) {
        if (newLat !== coordinates.lat || newLon !== coordinates.lon) {
          setCoordinates({ lat: newLat, lon: newLon });
        }
      }
    }, 1000); // Check for updates every second

    return () => clearInterval(interval);
  }, [coordinates, useNewCoordinates]);

  return (
    <div style={{ height: '100%' }}>
      <div ref={mapContainerRef} className="mapbox-container" />
      <button onClick={() => setUseNewCoordinates(!useNewCoordinates)}>
        Toggle Coordinates Source
      </button>
    </div>
  );
};

export default Mapbox;
