import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { lat as newLat1, lon as newLon1 } from './WaterRipple';  // Assuming these values are updated dynamically
import { lat as newLat2, lon as newLon2 } from './WaterFalling';  // Assuming these values are updated dynamically

var LAT = 0;
var LON = 0;
function setLocation (lat, lon) {
  LAT = lat;
  LON = lon;
}
// if (Lat !== newLat1 || Lon !== newLon1) {
//   Lat = newLat1;
//   Lon = newLon1;
//   LAT = Lat;
//   LON = Lon;
//   console.log("newLat turn to be Lat, Lon:",LAT, LON);
// } else if (Lat1 !== newLat2 || Lon1 !== newLon2) {
//   Lat1 = newLat2;
//   Lon1 = newLon2;
//   LAT = Lat1;
//   LON = Lon1;
//   console.log("newLat turn to be Lat1, Lon1:",LAT, LON);
// }
export {setLocation, LAT, LON};