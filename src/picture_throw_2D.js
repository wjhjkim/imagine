import React, { useState, useRef, useEffect } from 'react';
import './picture_throw.css';

const PictureThrowTwoD = () => {
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(5); // 카운트 상태 추가
  const mainCanvasRef = useRef(null);
  const imageCanvasesRef = useRef([]);
  const particlesRef = useRef([]);
  const finalParticlesRef = useRef([]);
  const dragRef = useRef({ x: 0, y: 0, isDragging: false });
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const newImages = await Promise.all(
      files.filter(file => file.type.startsWith('image/')).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const rect = mainCanvasRef.current.getBoundingClientRect();
            resolve({ src: reader.result, x: event.clientX - rect.left, y: event.clientY - rect.top });
          };
          reader.readAsDataURL(file);
        });
      })
    );
    setImages(prevImages => [...prevImages, ...newImages]);
    setCount(prevCount => prevCount - 1); // 카운트를 감소시킴
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const createExplosion = (img, imgCanvas, x, y, imgSize) => {
    const particles = [];
    const particleCount = 800; // Adjusted number of particles for better performance

    for (let i = 0; i < particleCount; i++) {
        const randomX = Math.floor(Math.random() * img.width);
        const randomY = Math.floor(Math.random() * img.height);
  
        particles.push({
          x: x,
          y: y,
          dx: (randomX - img.width/2) / img.width * 35,
          dy: (randomY - img.height/2) / img.height * 20,
          size: Math.random() * 25, //(imgSize / 30),
          life: Math.random() * 30 + 30,
          img: img,
          imgX: randomX,
          imgY: randomY,
        });
      }

    particlesRef.current.push(...particles);
  };

  const updateParticles = () => {
    const mainCtx = mainCanvasRef.current.getContext('2d');
    mainCtx.clearRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);

    // 최종 파티클 상태를 메인 캔버스에 그립니다.
    finalParticlesRef.current.forEach((p) => {
      mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
    });

    // 각 파티클을 그립니다.
    particlesRef.current.forEach((p) => {
      if (p.life > 0) {
        p.x += p.dx;
        p.y += p.dy;
        p.dx *= 0.98; // 감속 효과
        p.dy *= 0.98; // 감속 효과
        p.life -= 1;

        mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);

        // 파티클이 화면의 경계에 도달했을 때 깨지는 효과 추가
        if (p.x < 0 || p.x > mainCtx.canvas.width || p.y < 0 || p.y > mainCtx.canvas.height) {
          p.life = 0; // 생명을 0으로 설정하여 파티클 제거
        }
      }
    });

    // 생명이 남은 파티클을 필터링합니다.
    const aliveParticles = particlesRef.current.filter(p => p.life > 0);
    
    // 최종 파티클 상태를 유지합니다.
    finalParticlesRef.current.push(...particlesRef.current.filter(p => p.life <= 0));
    particlesRef.current = aliveParticles;

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(updateParticles);
    } else {
      // 파티클 애니메이션이 종료된 후 최종 상태를 이미지로 변환하여 배경으로 설정합니다.
      const finalImage = mainCanvasRef.current.toDataURL();
      setBackgroundImage(finalImage);
    }
  };

  const animateImage = (ctx, img, startX, startY, targetSize, initialSize, mainCtx, index) => {
    const duration = 1000; // Animation duration in ms
    const startTime = performance.now();

    const animate = (time) => {
      const elapsedTime = time - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const currentSize = initialSize * (1 - progress) * 0.4; // 이미지 크기를 줄입니다.
      const offsetX = (initialSize - currentSize) / 2;
      const offsetY = (initialSize - currentSize) / 2;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(img, startX + offsetX, startY + offsetY, currentSize, currentSize);

      mainCtx.clearRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
      imageCanvasesRef.current.forEach((canvas) => {
        if (canvas) {
          mainCtx.drawImage(canvas, 0, 0);
        }
      });

      // 최종 파티클 상태를 메인 캔버스에 그립니다.
      finalParticlesRef.current.forEach((p) => {
        mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
      });

      // 현재 애니메이션 중인 이미지 그리기
      mainCtx.drawImage(img, startX + offsetX, startY + offsetY, currentSize, currentSize);

      if (currentSize > targetSize) {
        requestAnimationFrame(animate);
      } else {
        // 이미지 애니메이션이 끝난 후 이미지 캔버스에서 이미지를 지웁니다.
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        imageCanvasesRef.current[index] = null; // 이미지 제거
        // 파티클 애니메이션을 시작합니다.
        createExplosion(img, ctx.canvas, startX + initialSize / 2, startY + initialSize / 2, initialSize);
        updateParticles(); // 파티클 애니메이션 시작
      }
    };

    requestAnimationFrame(animate);
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

        const initialSize = Math.min(canvasWidth, canvasHeight); // 처음 크기를 줄입니다.
      const startX = imgObj.x - initialSize / 2;
      const startY = imgObj.y - initialSize / 2;
      const targetSize = initialSize / 5; // 터질 크기 설정
      const mainCtx = mainCanvasRef.current.getContext('2d');

      animateImage(ctx, img, startX, startY, targetSize, initialSize, mainCtx, index);
    };
  };

  const handleMouseDown = (event) => {
    const rect = mainCanvasRef.current.getBoundingClientRect();
    dragRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top, isDragging: true };
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
  };

  const handleMouseMove = (event) => {
    if (dragRef.current.isDragging) {
      const rect = mainCanvasRef.current.getBoundingClientRect();
      const newX = event.clientX - rect.left;
      const newY = event.clientY - rect.top;
      const dx = newX - dragRef.current.x;
      const dy = newY - dragRef.current.y;

      particlesRef.current.forEach(p => {
        p.dx += dx * 0.05;
        p.dy += dy * 0.05;
      });

      dragRef.current = { x: newX, y: newY, isDragging: true };
    }
  };

  const handleReset = () => {
    setImages([]);
    setBackgroundImage(null);
    setCount(5);
    finalParticlesRef.current = [];
    particlesRef.current = [];
    imageCanvasesRef.current = [];
    const mainCtx = mainCanvasRef.current.getContext('2d');
    mainCtx.clearRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
  };

  useEffect(() => {
    const newImages = images.slice(imageCanvasesRef.current.length);
    newImages.forEach((imgObj, index) => {
      handleImageLoad(imgObj, imageCanvasesRef.current.length + index);
    });
  }, [images]);

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
    let timer;
    if (count <= 0) {
      // Count가 0이 되면 3초 후에 화면 클릭 시 초기화 대기
      timer = setTimeout(() => {
        document.addEventListener('click', handleReset);
      }, 5000);
    } else {
      document.removeEventListener('click', handleReset);
    }

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleReset);
    };
  }, [count]);

  return (
    <div 
      className="picture-throw-2d" 
      onDrop={handleDrop} 
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <canvas ref={mainCanvasRef} />
      <div className="count-display" style={{ position: 'absolute', top: 10, left: 10, fontSize: '24px', color: 'white' }}>
        Count: {count}
      </div>
      {/* <p>Drag & Drop images here</p> */}
    </div>
  );
};

export default PictureThrowTwoD;
