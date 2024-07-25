import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 추가
import EXIF from 'exif-js';
import { Image_list } from './login';
import { setLocation } from './Mapbox';

var lat = 36.37416931298615;
var lon = 127.36565860037672;

const convertDMSToDD = (DMS, ref) => {
  if (!DMS || DMS.length < 3 || !ref) return NaN;
  const degrees = DMS[0] + DMS[1] / 60 + DMS[2] / 3600;
  return ref === 'S' || ref === 'W' ? -degrees : degrees;
};

const PictureThrowWaterColor = () => {
  const [images, setImages] = useState([]);
  const mainCanvasRef = useRef(null);
  const imageCanvasesRef = useRef([]);
  const particlesRef = useRef([]);
  const finalParticlesImageRef = useRef(null);
  const backgroundImageRef = useRef(new Image());
  const history = useNavigate();
  const location = useLocation();
  const photoPath = location.state.value1;
  const imgs = location.state.value2;


  const imagePaths = imgs === null? Image_list : imgs;

  useEffect(() => {
    const loadImageData = async () => {
        var src = "";
        if (photoPath != null) {
          src = photoPath;
        } else {
          const randomIndex = Math.floor(Math.random() * imagePaths.length);
          src = imagePaths[randomIndex];
        }
        const img = new Image();
        img.onload = () => {
            const rect = mainCanvasRef.current.getBoundingClientRect();
            console.log(`Image loaded: ${src}`);
            setImages([{ src, x: rect.width / 2, y: rect.height / 2 }]);
            
            // Extract EXIF data
      EXIF.getData(img, function() {
        const latitude = EXIF.getTag(this, 'GPSLatitude');
        const longitude = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
        const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');

        if (latitude && longitude && latRef && lonRef) {
          const parsedLat = parseFloat(convertDMSToDD(latitude, latRef));
          const parsedLon = parseFloat(convertDMSToDD(longitude, lonRef));
          if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
            lat = parsedLat;
            lon = parsedLon;
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            setLocation(lat, lon);
            // Optionally set the coordinates to state
            // setCoordinates({ lat, lon });
          } else {
            console.error('Invalid coordinates:', { lat: parsedLat, lon: parsedLon });
          }
        } else {
          console.log('No longitude, latitude found in EXIF data');
        }
      });
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
        img.src = src;
    };

    loadImageData();
}, []);

  const createExplosion = (img, imgCanvas, x, y, imgSize) => {
    const particles = [];
    const canvasWidth = mainCanvasRef.current.width;
    const canvasHeight = mainCanvasRef.current.height;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    for (let i = 0; i < 60; i++) {
      for (let j = 0; j < 60; j++) {
        const randomX = Math.floor(i * img.width / 60 + Math.random() * 10);
        const randomY = Math.floor(j * img.height / 60 + Math.random() * 10);

        particles.push({
          x: 0,
          y: 0,
          targetX: randomX / img.width * canvasWidth,
          targetY: randomY / img.height * canvasHeight,
          dx: 0.38,
          dy: 0.38,
          size: Math.random() * 10 + 10,
          life: Math.random() * 10 + 12,
          img: img,
          imgX: randomX,
          imgY: randomY,
          initialMovement: true,
        });
      }
    }

    particlesRef.current.push(...particles);
  };

  const updateParticles = () => {
    if (!mainCanvasRef.current) return; // 추가된 null 체크
    const mainCtx = mainCanvasRef.current.getContext('2d');
    const backgroundImage = backgroundImageRef.current;

    // 배경 이미지 그리기
    mainCtx.fillStyle = 'black';
    mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
    // mainCtx.filter = 'blur(10px)';  // 블러 필터 적용
    // mainCtx.drawImage(backgroundImage, 0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
    // mainCtx.filter = 'none';  // 블러 필터 제거

    if (finalParticlesImageRef.current) {
      mainCtx.drawImage(finalParticlesImageRef.current, 0, 0);
    }

    particlesRef.current.forEach((p) => {
      if (p.life > 0) {
        if (p.initialMovement) {
          const moveSpeed = 0.05;
          p.x += (p.targetX - p.x) * moveSpeed;
          p.y += (p.targetY - p.y) * moveSpeed;

          if (Math.abs(p.targetX - p.x) < 1 && Math.abs(p.targetY - p.y) < 1) {
            p.initialMovement = false;
          }
        } else { 
          p.x += p.dx;
          p.y += p.dy;
          p.dx *= 0.99;
          p.dy *= 0.99;
          p.life -= 1;
          p.size *= 1 + (Math.random() - 0.2) * 0.02;
        }

        mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
      }
    });

    const aliveParticles = particlesRef.current.filter(p => p.life > 0);
    finalParticlesImageRef.current = captureFinalParticles(mainCtx);
    particlesRef.current = aliveParticles;

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(updateParticles);
    } else {
      // 모든 파티클 동작이 끝나면 3초 뒤에 검은색 파티클을 생성
      setTimeout(() => {
        createBlackParticles();
      }, 3000);
    }
  };

  const createBlackParticles = () => {
    const particles = [];
    const particleCount = 2000;
    const canvasWidth = mainCanvasRef.current.width;
    const canvasHeight = mainCanvasRef.current.height;

    for (let i = 0; i < particleCount / 2; i++) {
      const randomval = Math.random();

      particles.push({
        x: -canvasHeight / 1000 * i,
        y: canvasHeight / 1000 * i,
        dx: 1 + (4 + 0.005 * (particleCount / 2 - i)) * randomval,
        dy: 1 + (4 + 0.005 * (particleCount / 2 - i)) * randomval,
        size: Math.random() * 15 + 5,
        life: 200,
        color: 'black'
      });
    }

    for (let i = particleCount / 2; i < particleCount; i++) {
      const randomval = Math.random();

      particles.push({
        x: canvasWidth / 1000 * (i - particleCount / 2),
        y: -canvasWidth / 1000 * (i - particleCount / 2),
        dx: 1 + (4 + 0.005 * (particleCount - i)) * randomval,
        dy: 1 + (4 + 0.005 * (particleCount - i)) * randomval,
        size: Math.random() * 15 + 5,
        life: 200,
        color: 'black'
      });
    }

    particlesRef.current.push(...particles);
    requestAnimationFrame(updateBlackParticles);
  };

  const updateBlackParticles = () => {
    if (!mainCanvasRef.current) return; // 추가된 null 체크
    const mainCtx = mainCanvasRef.current.getContext('2d');
    // mainCtx.clearRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

    particlesRef.current.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 1;

      mainCtx.fillStyle = p.color;
      mainCtx.beginPath();
      mainCtx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
      mainCtx.fill();
    });

    // 생명이 남은 파티클을 필터링합니다.
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(updateBlackParticles);
    } else {
      mainCtx.fillStyle = 'black';
      mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

      // 1초 뒤에 PictureThrow 화면으로 전환
      var path = "";
      switch(Math.floor(Math.random() * 7)) {
        case 0 :
            path = "/picture-throw-greatline";
            break;
        case 1 :
            path = "/waterfalling";
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
        default :
            path = "/picture-throw";
      }


      setTimeout(() => {
        history(path, { state: { value1: null, value2: imgs } });
      }, 1000);
    }
  };

  const captureFinalParticles = (mainCtx) => {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = mainCtx.canvas.width;
    finalCanvas.height = mainCtx.canvas.height;
    const finalCtx = finalCanvas.getContext('2d');

    if (finalParticlesImageRef.current) {
      finalCtx.drawImage(finalParticlesImageRef.current, 0, 0);
    }

    particlesRef.current.forEach((p) => {
      finalCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
    });

    return finalCanvas;
  };

  const handleImageLoad = (imgObj, index) => {
    const imgCanvas = document.createElement('canvas');
    imgCanvas.width = mainCanvasRef.current.width;
    imgCanvas.height = mainCanvasRef.current.height;
    imageCanvasesRef.current[index] = imgCanvas;
    const ctx = imgCanvas.getContext('2d');
    const img = new Image();
    img.src = imgObj.src;

    img.onload = () => {
      const canvasWidth = mainCanvasRef.current.width;
      const canvasHeight = mainCanvasRef.current.height;
      
      const initialSizeX = canvasWidth * 0.4;
      const initialSizeY = canvasHeight * 0.4;
      const startX = imgObj.x - initialSizeX / 2;
      const startY = imgObj.y - initialSizeY / 2;
      const mainCtx = mainCanvasRef.current.getContext('2d');
    
      // 이미지를 캔버스에 바로 그리기
      mainCtx.drawImage(img, startX, startY, canvasWidth, canvasHeight);

      // 폭발 효과 생성
      createExplosion(img, ctx.canvas, canvasWidth / 2, canvasHeight / 2, canvasWidth);
      updateParticles();
    };
  };

  const resizeCanvas = () => {
    if (mainCanvasRef.current) {
      const canvas = mainCanvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const newImages = images.slice(imageCanvasesRef.current.length);
    newImages.forEach((imgObj, index) => {
      handleImageLoad(imgObj, imageCanvasesRef.current.length + index);
    });
  }, [images]);

  return (
    <div className="picture-throw">
      <button className="back-button" onClick={() => history('/random-photo')}></button>
      <canvas ref={mainCanvasRef} />
    </div>
  );
};

export default PictureThrowWaterColor;
