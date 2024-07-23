import React from 'react';
import styled from 'styled-components';
import { Image_list } from './imagefile';
import { useNavigate } from 'react-router-dom';

const photos = Image_list;

const getRandomValue = (min, max) => Math.random() * (max - min) + min;

const Photo = styled.img`
  position: absolute;
  top: ${() => `${getRandomValue(0, 90)}%`};
  left: ${() => `${getRandomValue(0, 90)}%`};
  width: ${() => `${getRandomValue(100, 300)}px`};
  transform: ${() => `rotate(${getRandomValue(-30, 30)}deg)`};
`;

const RandomPhoto = () => {
    var path = "";
      switch(Math.floor(Math.random() * 5)) {
        case 0 :
            path = "/picture-throw";
            break;
        case 1 :
            path = "/picture-throw-watercolor";
            break;
        case 2 :
            path = "/picture-throw-greatline";
            break;
        case 3 :
            path = "/picture-throw-line";
            break;
        case 4 :
            path = "/picture-throw-goodline";
            break;
        default :
            path = "/picture-throw";
      }

  const navigate = useNavigate();

  const handleClick = (photoPath) => {
    navigate(path, { state: { photoPath } });
  };

  return (
    <div>
      {photos.map((photo, index) => (
        <Photo key={index} src={photo} alt={`photo-${index}`} onClick={() => handleClick(photo)} />
      ))}
    </div>
  );
};

export default RandomPhoto;