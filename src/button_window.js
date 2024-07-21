import React from 'react';
import { Link } from 'react-router-dom';
import './buttonWindow.css';

function ButtonWindow() {
    return (
        <div className="home">
          <div className="button-container">
            <Link to="/picture-throw" className="nav-button">Page 1</Link>
            <Link to="/picture-throw-2D" className="nav-button">Page 2</Link>
            <Link to="/picture-throw-watercolor" className="nav-button">Page 3</Link>
            <Link to="/picture-throw-changecolor" className="nav-button">Page 4</Link>
          </div>
        </div>
      );
}

export default ButtonWindow;