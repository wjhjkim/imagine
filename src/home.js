import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './home.css';
import ButtonWindow from './button_window';
import PictureThrow from './picture_throw';
import PictureThrowTwoD from './picture_throw_2D';
import PictureThrowWaterColor from './picture_throw_watercolor';
import PictureThrowChangeColor from './picture_throw_changecolor';

function Home() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    setInProp(true);
  }, [location]);

  return (
    <div className="transition-container">
      <TransitionGroup component={null}>
        <CSSTransition key={location.pathname} classNames="mosaic" timeout={200} onEnter={() => setInProp(false)} onEntered={() => setInProp(true)}>
          <div className={`route-section ${inProp ? 'in' : ''}`}>
            <Routes location={location}>
              <Route path="/" element={<ButtonWindow />} />
              <Route path="/picture-throw" element={<PictureThrow />} />
              <Route path="/picture-throw-2d" element={<PictureThrowTwoD />} />
              <Route path="/picture-throw-watercolor" element={<PictureThrowWaterColor />} />
              <Route path="/picture-throw-changecolor" element={<PictureThrowChangeColor />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default Home;
