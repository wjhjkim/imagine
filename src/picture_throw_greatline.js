import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import './picture_throw.css';

const PictureThrowGreatLine = () => {
  const [images, setImages] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const mainCanvasRef = useRef(null);
  const imageCanvasesRef = useRef([]);
  const particlesRef = useRef([]);
  const finalParticlesImageRef = useRef(null);
  const finishedParticlesRef = useRef([]);
  const history = useNavigate();

  const imagePaths = [
    '/glass.jpg', 
    '/picture1.jpg',
    '/picture2.jpg',
    '/picture3.jpg',
  ];

  useEffect(() => {
    const loadImageData = async () => {
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        const src = imagePaths[randomIndex];
        const img = new Image();
        img.onload = () => {
            const rect = mainCanvasRef.current.getBoundingClientRect();
            console.log(`Image loaded: ${src}`);
            setImages([{ src, x: rect.width / 2, y: rect.height / 2 }]);
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
    const particleCount = 4000;
    const canvasWidth = mainCanvasRef.current.width;
    const canvasHeight = mainCanvasRef.current.height;

    for (let i = 0; i < particleCount; i++) {
      const randomX = Math.floor(Math.random() * img.width);
      const randomX1 = randomX / img.width * canvasWidth;
      const randomY = Math.floor(Math.random() * img.height);
      const randomY1 = randomY / img.height * canvasHeight;
      var randomK = -1;
      if (randomX / randomY >= img.width / img.height) {
        randomK = 1;
      }
      const randomXX = (randomY1 + canvasWidth/canvasHeight * randomX1) / (canvasHeight/canvasWidth + canvasWidth/canvasHeight) + randomK * canvasHeight/2;
      const randomYY = (randomY1 + canvasWidth/canvasHeight * randomX1) / (canvasHeight/canvasWidth + canvasWidth/canvasHeight) * canvasHeight/canvasWidth - randomK * canvasWidth/2;

      particles.push({
        x: randomXX,
        y: randomYY,
        dx: (randomX1 - randomXX) / 200,
        dy: (randomY1 - randomYY) / 200,
        size: 10,
        life: 205,
        img: img,
        imgX: randomX,
        imgY: randomY,
      });
    }

    setIsFadingOut(true);

    particlesRef.current.push(...particles);
  };

  const updateParticles = () => {
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
    const particleX = canvasWidth / particleCount * 2;
    const particleY = canvasHeight / particleCount * 2;

    for (let i = 0; i < particleCount; i++) {
      const x = particleX * i / 2;
      const y = particleY * i / 2;

      if (i % 2 === 1) {
        particles.push({
            x: x,
            y: y,
            dx: canvasHeight / 400,
            dy: canvasWidth / -400,
            size: 8,
            life: 300,
            color: '#14141B'
          });
      }
      else {
        particles.push({
            x: x,
            y: y,
            dx: canvasWidth / -400,
            dy: canvasHeight / 400,
            size: 8,
            life: 300,
            color: '#14141B'
          });
      }
    }

    particlesRef.current.push(...particles);
    requestAnimationFrame(updateBlackParticles);
  };

  const updateBlackParticles = () => {
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

      setTimeout(() => {
        history('/picture-throw');
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
      <canvas ref={mainCanvasRef} />
    </div>
  );
};

export default PictureThrowGreatLine;
