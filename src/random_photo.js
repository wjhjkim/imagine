import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Image_list } from './login';
import { useNavigate } from 'react-router-dom';

// Image_list1은 빈 배열로 초기화
let photos = [];
let length1 = 0;

function Imageinsert(Image_list1) {
  let Image = [];
  if (Image_list1.length > 0) {
    Image.length = 0;
    Image = Image_list1;
    console.log('Using Image_list1:', Image);
  } else {
    Image.length = 0;
    Image = Image_list;
    console.log('Using Image_list:', Image);
    console.log('Image_list1:', Image_list1);
  }
  return shuffle(Image);
}

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
  border-radius: 15%;
  width: ${({ radius }) => `${getRandomValue(1 * radius / 6, 1.5 * radius / 6)}px`};
  ${({ angle, radius, isClicked, offsetX, offsetY }) => css`
    animation: ${isClicked ? moveToCenter(angle, radius, offsetX, offsetY) : moveFromCenter(angle, radius, offsetX, offsetY)} 1.5s forwards;
  `}
  transform-origin: center center;
`;

const radii = [30, 70, 130, 200, 300, 500];

// 로딩 화면 스타일링
const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const LoadingText = styled.div`
  font-size: 24px;
  color: #333;
`;

const RandomPhoto = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [imageList1, setImageList1] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/login/photo');
        const data = await response.json();
        imageList1.length = 0; 
        setImageList1(data); // 상태를 업데이트합니다.
        setIsLoading(false); // 데이터 로딩 완료 시 로딩 상태를 false로 설정
      } catch (error) {
        console.error('Error fetching photos:', error);
        setIsLoading(false); // 에러 발생 시에도 로딩 상태를 false로 설정
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    setPhotos(Imageinsert(imageList1));
  }, [imageList1]);

  const paths = [
    "/picture-throw-greatline",
    "/picture-throw-watercolor",
    "/picture-throw-changecolor",
    "/picture-throw-line",
    "/picture-throw-goodline",
    "/waterripple",
    "/waterfalling",
    "/picture-throw"
  ];

  const handleClick = (photoPath, photos) => {
    const null1 = null;
    setIsClicked(true);
    console.log("photos:", photos)
    setTimeout(() => {
      navigate("/waterfalling", { state: { value1: photoPath, value2: photos } });
    }, 1500);
  };
//paths[Math.floor(Math.random() * paths.length)]

  const fori = Math.floor(photos.length / radii.length);

  if (isLoading) {
    // 로딩 중일 때 로딩 화면을 렌더링
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

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
              onClick={() => handleClick(photo, photos)}
            />
          );
        })
      )}
    </CircleContainer>
  );
};
export {photos};
export default RandomPhoto;




