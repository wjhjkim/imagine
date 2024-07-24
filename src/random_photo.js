import React from 'react';
import styled from 'styled-components';
import { Image_list } from './imagefile';
import { useNavigate } from 'react-router-dom';

const photos = Image_list;

const getRandomValue = (min, max) => Math.random() * (max - min) + min;

const CircleContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Photo = styled.img`
  position: absolute;
  border-radius: 15%; /* 테두리를 둥글게 만듭니다 */
  width: ${({ radius }) => `${getRandomValue(1 * radius / 6, 1.5 * radius / 6)}px`};
  transform: ${({ angle, radius }) => `
    rotate(${angle}deg) translate(${radius + (Math.random() - 0.5) * radius / 5}px) rotate(-${angle}deg)
  `};
  transform-origin: center center;
`;

const radii = [30, 70, 130, 200, 300, 500, 700]; // 네 개의 원에 대한 반지름 배열

const RandomPhoto = () => {
  var path = "";
  switch(Math.floor(Math.random() * 8)) {
    case 0 :
        path = "/picture-throw-greatline";
        break;
    case 1 :
        path = "/picture-throw-watercolor";
        break;
    case 2 :
        path = "/picture-throw-changecolor";
        break;
    case 3 :
        path = "/picture-throw-line";
        break;
    case 4 :
        path = "/picture-throw-goodline";
        break;
    case 5 :
        path = "/waterripple";
        break;
    case 6 :
        path = "/waterfalling";
        break;
    case 7 :
        path = "/picture-throw";
        break;
      default :
          path = "/picture-throw";
    }

  const navigate = useNavigate();

  const handleClick = (photoPath) => {
    navigate(path, { state: { photoPath } });
  };

  const fori = Math.floor(photos.length/radii.length);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <CircleContainer>
      {radii.map((radius, radiusIndex) => 
        shuffle(photos.slice(fori * radiusIndex, fori * (radiusIndex + 1))).map((photo, index) => {
          const angle = (360 / fori) * index + (120 / radii.length) * radiusIndex + Math.random() * (170 / fori);
          return (
            <Photo
              key={`${radiusIndex}-${index}`}
              src={photo}
              alt={`photo-${radiusIndex}-${index}`}
              angle={angle}
              radius={radius}
              width={radius}
              onClick={() => handleClick(photo)}
            />
          );
        })
      )}
    </CircleContainer>
  );
};

export default RandomPhoto;
