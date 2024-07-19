import React, { useState, useRef, useEffect, useCallback } from 'react';
import './picture_throw.css';

const PictureThrow = () => {
    const [images, setImages] = useState([]);
    const mainCanvasRef = useRef(null);
    const imageCanvasesRef = useRef([]);
    const particlesRef = useRef([]);
    const finalParticlesRef = useRef([]);
  
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
  
    const createExplosion = (img, x, y, imgSize) => {
      const particles = [];
      const particleCount = 200; // Adjust this number to change the effect intensity
  
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: x,
          y: y,
          dx: (Math.random() - 0.5) * 10,
          dy: (Math.random() - 0.5) * 10,
          size: Math.random() * (imgSize / 10),
          life: Math.random() * 30 + 30,
          img: img, // 이미지 객체를 추가합니다.
          imgX: Math.random() * img.width,
          imgY: Math.random() * img.height,
        });
      }
  
      particlesRef.current.push(...particles);
    };
  
    const updateParticles = () => {
      const mainCtx = mainCanvasRef.current.getContext('2d');
      mainCtx.clearRect(0, 0, mainCtx.canvas.width, mainCtx.canvas.height);
  
      // 메인 캔버스에 기존 이미지들을 다시 그립니다.
      imageCanvasesRef.current.forEach((canvas) => {
        if (canvas) {
          mainCtx.drawImage(canvas, 0, 0);
        }
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
        }
      });
  
      // 생명이 남은 파티클을 필터링합니다.
      const aliveParticles = particlesRef.current.filter(p => p.life > 0);
      
      // 최종 파티클 상태를 유지합니다.
      finalParticlesRef.current.push(...particlesRef.current.filter(p => p.life <= 0));
      particlesRef.current = aliveParticles;
  
      // 최종 파티클 상태를 메인 캔버스에 그립니다.
      finalParticlesRef.current.forEach((p) => {
        mainCtx.drawImage(p.img, p.imgX, p.imgY, 1, 1, p.x, p.y, p.size, p.size);
      });
  
      if (particlesRef.current.length > 0) {
        requestAnimationFrame(updateParticles);
      }
    };
  
    const animateImage = (ctx, img, startX, startY, targetSize, initialSize, mainCtx, index) => {
      const duration = 2000; // Animation duration in ms
      const startTime = performance.now();
  
      const animate = (time) => {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
  
        const currentSize = initialSize * (1 - progress); // 이미지 크기를 줄입니다.
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
  
        if (currentSize > targetSize) {
          requestAnimationFrame(animate);
        } else {
          // 이미지 애니메이션이 끝난 후 이미지 캔버스에서 이미지를 지웁니다.
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          imageCanvasesRef.current[index] = null; // 이미지 제거
          // 파티클 애니메이션을 시작합니다.
          createExplosion(img, startX + initialSize / 2, startY + initialSize / 2, initialSize);
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
        const initialSize = img.width / 2; // 처음 크기를 줄입니다.
        const startX = imgObj.x - initialSize / 2;
        const startY = imgObj.y - initialSize / 2;
        const targetSize = initialSize / 5; // 터질 크기 설정
        const mainCtx = mainCanvasRef.current.getContext('2d');
  
        animateImage(ctx, img, startX, startY, targetSize, initialSize, mainCtx, index);
      };
    };
  
    useEffect(() => {
      const newImages = images.slice(imageCanvasesRef.current.length);
      newImages.forEach((imgObj, index) => {
        handleImageLoad(imgObj, imageCanvasesRef.current.length + index);
      });
    }, [images]);
  
    return (
      <div 
        className="drop-zone" 
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <canvas ref={mainCanvasRef} width={800} height={600} />
        <p>Drag & Drop images here</p>
      </div>
    );
};

export default PictureThrow;
