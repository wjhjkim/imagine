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


const PictureThrowLine = () => {
  const [images, setImages] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const mainCanvasRef = useRef(null);
  const imageCanvasesRef = useRef([]);
  const particlesRef = useRef([]);
  const finalParticlesImageRef = useRef(null);
  const finishedParticlesRef = useRef([]);
  const history = useNavigate();
  const location = useLocation();
  const { photoPath } = location.state || { photoPath: null };

  const imagePaths = Image_list;

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
    const particleCount = 2000;
    const canvasWidth = mainCanvasRef.current.width;
    const canvasHeight = mainCanvasRef.current.height;

    for (let i = 0; i < particleCount; i++) {
        const randomX = Math.floor(Math.random() * img.width);
        const randomY = Math.floor(Math.random() * img.height);
        var randomK = -1;
        if (randomX / randomY >= img.width / img.height) {
          randomK = 1;
        }
        const randomXX = Math.floor(img.width / particleCount * i) / img.width * canvasWidth + canvasWidth / 2 * randomK;
        const randomYY = Math.floor(img.height / particleCount * i) / img.height * canvasHeight - canvasHeight / 2 * randomK;
  
        particles.push({
          x: randomXX,
          y: randomYY,
          dx: (randomX / img.width * canvasWidth - randomXX) / 200,
          dy: (randomY / img.height * canvasHeight - randomYY) / 200,
          size: 10,
          life: 210,
          img: img,
          imgX: randomX,
          imgY: randomY,
        });
      }

    setIsFadingOut(true);

    particlesRef.current.push(...particles);
  };

  const updateParticles = () => {
    if (!mainCanvasRef.current) return; // 추가된 null 체크
    const mainCtx = mainCanvasRef.current.getContext('2d');
    mainCtx.fillStyle = '#14141B';
    mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

    if (finalParticlesImageRef.current) {
      mainCtx.drawImage(finalParticlesImageRef.current, 0, 0);
    }

    particlesRef.current.forEach((p) => {
      if (p.life > 1) {
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 1;

        mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
      } else {
        finishedParticlesRef.current.push(p);
        p.life -= 1;
      }
    });

    // 생명이 남은 파티클을 필터링합니다.
    const aliveParticles = particlesRef.current.filter(p => p.life > 0);

    // 최종 파티클 상태를 유지합니다.
    finalParticlesImageRef.current = captureFinalParticles(mainCtx);

    particlesRef.current = aliveParticles;

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(updateParticles);
    } else {
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

    for (let i = 0; i < particleCount; i++) {
        const randomX = Math.floor(Math.random() * canvasWidth);
        const randomY = Math.floor(Math.random() * canvasHeight);
        var randomK = -1;
        if (randomX * canvasHeight >= randomY * canvasWidth) {
          randomK = 1;
        }
        const randomXX = (randomY - canvasWidth/canvasHeight * randomX) / (canvasHeight/canvasWidth - canvasWidth/canvasHeight) + randomK * canvasWidth/2;
        const randomYY = (randomY - canvasWidth/canvasHeight * randomX) / (canvasHeight/canvasWidth - canvasWidth/canvasHeight) * canvasHeight/canvasWidth - randomK * canvasHeight/2;

      particles.push({
        x: randomXX,
        y: randomYY,
        dx: (randomX-randomXX)/150,
        dy: (randomY-randomYY)/150,
        size: Math.random() * 15,
        life: 200,
        color: '#14141B'
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
      setIsFadingOut(false);
      mainCtx.fillStyle = '#14141B';
      mainCtx.fillRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

      var path = "";
      switch(Math.floor(Math.random() * 7)) {
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
            path = "/waterfalling";
            break;
        case 4 :
            path = "/picture-throw-goodline";
            break;
        case 5 :
            path = "/waterripple";
            break;
        case 6 :
            path = "/picture-throw";
            break;
        default :
            path = "/picture-throw";
      }


      setTimeout(() => {
        history(path);
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

      mainCtx.drawImage(img, startX, startY, canvasWidth, canvasHeight);

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

export default PictureThrowLine;
