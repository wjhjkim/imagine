import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Image_list } from './login';
import { useNavigate } from 'react-router-dom';

const photos = shuffle(Image_list);

const getRandomValue = (min, max) => Math.random() * (max - min) + min;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const CircleContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const moveFromCenter = (angle, radius, offsetX, offsetY) => keyframes`
  from {
    transform: translate(0, 0) scale(0.1);
    opacity: 1;
  }
  to {
    transform: rotate(${angle}deg) translate(${radius + offsetX}px, ${offsetY}px) rotate(-${angle}deg) scale(1);
    opacity: 1;
  }
`;

const moveToCenter = (angle, radius, offsetX, offsetY) => keyframes`
  from {
    transform: rotate(${angle}deg) translate(${radius + offsetX}px, ${offsetY}px) rotate(-${angle}deg) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(0, 0) scale(0.1);
    opacity: 1;
  }
`;

const Photo = styled.img`
  position: absolute;
  border-radius: 15%; /* 테두리를 둥글게 만듭니다 */
  width: ${({ radius }) => `${getRandomValue(1 * radius / 6, 1.5 * radius / 6)}px`};
  ${({ angle, radius, isClicked, offsetX, offsetY }) => css`
    animation: ${isClicked ? moveToCenter(angle, radius, offsetX, offsetY) : moveFromCenter(angle, radius, offsetX, offsetY)} 1.5s forwards;
  `}
  transform-origin: center center;
`;

const radii = [30, 70, 130, 200, 300, 500]; // 여러 개의 원에 대한 반지름 배열

const RandomPhoto = () => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

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

  const handleClick = (photoPath) => {
    setIsClicked(true);
    setTimeout(() => {
      navigate(path, { state: { photoPath } });
    }, 1500); // 애니메이션이 완료된 후 페이지 이동
  };

  const fori = Math.floor(photos.length / radii.length);

  

  return (
    <CircleContainer>
      {radii.map((radius, radiusIndex) =>
        photos.slice(fori * radiusIndex, fori * (radiusIndex + 1)).map((photo, index) => {
          const angle = (360 / fori) * index + (120 / radii.length) * radiusIndex + Math.random() * (170 / fori);
          const offsetX = (Math.random() - 0.5) * radius / 5;
          const offsetY = (Math.random() - 0.5) * radius / 5;
          return (
            <Photo
              key={`${radiusIndex}-${index}`}
              src={photo}
              alt={`photo-${radiusIndex}-${index}`}
              angle={angle}
              radius={radius}
              isClicked={isClicked}
              offsetX={offsetX}
              offsetY={offsetY}
              onClick={() => handleClick(photo)}
            />
          );
        })
      )}
    </CircleContainer>
  );
};

export default RandomPhoto;
