import React from 'react';
import { Link } from 'react-router-dom';
import './buttonWindow.css';

function ButtonWindow() {
    return (
        <div className="home">
          <div className="button-container">
            <Link to="/picture-throw" className="nav-button">Page 1</Link>
            <Link to="/picture-throw-2D" className="nav-button">Page 2</Link>
            <button className="nav-button" onClick={() => alert('Navigating to Page 3')}>Page 3</button>
            <button className="nav-button" onClick={() => alert('Navigating to Page 4')}>Page 4</button>
          </div>
        </div>
      );
}

export default ButtonWindow;