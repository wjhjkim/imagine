import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import WaterRipple from './WaterRipple';
import WaterFalling from './WaterFalling';
import Mapbox from './Mapbox';
import Login from './Login';
import { LAT, LON } from './LocationContext';



const App = () => {
  const [showWaterFalling, setShowWaterFalling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWaterFalling(true);
      navigate('/waterfalling'); // Navigate to /waterfalling after 15 seconds
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    
    <div className="App">
      <Routes>
        <Route path="/mapbox" element={<Mapbox />} />
        <Route path="/waterripple" element={<WaterRipple />} />
        <Route path="/waterfalling" element={<WaterFalling />} />
        <Route path="/" element={<Login />} />
      </Routes>
      <div className="mapbox-frame">
        <Mapbox />
      </div>
    </div>
    
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
