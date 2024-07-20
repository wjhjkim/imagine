import React, { useState, useRef, useEffect } from 'react';
import './picture_throw.css';

const PictureThrow = () => {
  const [images, setImages] = useState([]);
  const mainCanvasRef = useRef(null);
  const imageCanvasesRef = useRef([]);
  const particlesRef = useRef([]);
  const finalParticlesImageRef = useRef(null);

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
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const createExplosion = (img, imgCanvas, x, y, imgSize) => {
    const particles = [];
    const particleCount = 2000;

    for (let i = 0; i < particleCount; i++) {
      const randomX = Math.floor(Math.random() * img.width);
      const randomY = Math.floor(Math.random() * img.height);

      particles.push({
        x: x,
        y: y,
        dx: (randomX - img.width/2) / img.width * 35,
        dy: (randomY - img.height/2) / img.height * 20,
        size: Math.random() * 15, //(imgSize / 30),
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

    if (finalParticlesImageRef.current) {
      mainCtx.drawImage(finalParticlesImageRef.current, 0, 0);
    }

    particlesRef.current.forEach((p) => {
      if (p.life > 0) {
        p.x += p.dx;
        p.y += p.dy;
        p.dx *= 0.98;
        p.dy *= 0.98;
        p.life -= 1;

        mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
      }
    });

    // 생명이 남은 파티클을 필터링합니다.
    const aliveParticles = particlesRef.current.filter(p => p.life > 0);
    
    // 최종 파티클 상태를 유지합니다.
    finalParticlesImageRef.current = captureFinalParticles(mainCtx);

    particlesRef.current = aliveParticles;

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(updateParticles);
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

  const animateImage = (ctx, img, startX, startY, targetSize, initialSize, mainCtx, index) => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsedTime = time - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const currentSize = initialSize * (1 - progress) * 0.4;
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

      if (finalParticlesImageRef.current) {
        mainCtx.drawImage(finalParticlesImageRef.current, 0, 0);
      }

      mainCtx.drawImage(img, startX + offsetX, startY + offsetY, currentSize, currentSize);

      if (currentSize > targetSize) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        imageCanvasesRef.current[index] = null;
        createExplosion(img, ctx.canvas, startX + initialSize / 2, startY + initialSize / 2, initialSize);
        updateParticles();
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
      
      // 이미지를 화면 크기로 맞추기 위해 조정
      const initialSize = Math.min(canvasWidth, canvasHeight);
      const startX = imgObj.x - initialSize / 2;
      const startY = imgObj.y - initialSize / 2;
      const targetSize = initialSize / 4;
      const mainCtx = mainCanvasRef.current.getContext('2d');
    
      animateImage(ctx, img, startX, startY, targetSize, initialSize, mainCtx, index);
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
    <div
      className="picture-throw"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <canvas ref={mainCanvasRef} />
    </div>
  );
};

export default PictureThrow;
