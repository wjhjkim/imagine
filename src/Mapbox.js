import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

let setLocationExternal;

const Mapbox = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState({ lat: 36.37416931298615, lon: 127.36565860037672 });
  const [useNewCoordinates, setUseNewCoordinates] = useState(true);
  const [markers, setMarkers] = useState([]); // Array to store markers

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

    // Remove existing markers
    markers.forEach(marker => marker.remove());

    // Add new marker
    const newMarker = new mapboxgl.Marker().setLngLat(geocode.center).addTo(mapRef.current);
    setMarkers([newMarker]); // Update marker state
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (useNewCoordinates) {
        if (coordinates.lat !== 0 || coordinates.lon !== 0) {
          setCoordinates({ lat: coordinates.lat, lon: coordinates.lon });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [coordinates, useNewCoordinates]);

  useEffect(() => {
    setLocationExternal = setCoordinates;
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <div ref={mapContainerRef} className="mapbox-container" />
      <button onClick={() => setUseNewCoordinates(!useNewCoordinates)}>
        Toggle Coordinates Source
      </button>
    </div>
  );
};

// External function to set the location
const setLocation = (lat, lon) => {
  if (setLocationExternal) {
    setLocationExternal({ lat, lon });
  }
};

export default Mapbox;
export { setLocation };
