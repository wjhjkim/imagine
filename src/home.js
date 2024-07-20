import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import './home.css';
import ButtonWindow from './button_window';
import PictureThrow from './picture_throw';
import PictureThrowTwoD from './picture_throw_2D';

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
  const [direction, setDirection] = useState('slide-left');

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (location.pathname === "/picture-throw") {
        setDirection('slide-left');
        navigate("/picture-throw-2d");
      }
    },
    onSwipedRight: () => {
      if (location.pathname === "/picture-throw-2d") {
        setDirection('slide-right');
        navigate("/picture-throw");
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} className="swipe-container">
      <TransitionGroup component={null}>
        <CSSTransition key={location.pathname} classNames={direction} timeout={600}>
          <div className="route-section">
            <Routes location={location}>
              <Route path="/" element={<ButtonWindow />} />
              <Route path="/picture-throw" element={<PictureThrow />} />
              <Route path="/picture-throw-2d" element={<PictureThrowTwoD />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default Home;
