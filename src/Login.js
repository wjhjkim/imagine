import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/waterripple');
  };

  return (
    <div className="login-container">
      <div className="button-wrapper">
        <button className="explore-button" onClick={handleExploreClick}>
          Explore Swan’s & Won’s Photos
        </button>
        <button className="google-button">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8eb075904f188f378606dd3d0f74bad85e1d8b595fb67e8af9553d543e5e9832?"
            alt="Google icon"
            className="google-icon"
          />
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
  );
};

export default Login;
