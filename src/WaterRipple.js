import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 추가
import { Image_list } from './login';
import EXIF from 'exif-js';
import './picture_throw.css';

const totallength = 19;
var lat = 36.37416931298615;
var lon = 127.36565860037672;

const WaterRipple = ({ xlength = totallength, ylength = totallength }) => {
  const numCircles = (xlength + 1) * (ylength + 1);

  const location = useLocation();
  const { photoPath } = location.state || { photoPath: null };
  const imagePaths = Image_list;
  var rootImageUrl = "";
  if (photoPath != null) {
    rootImageUrl = photoPath;
  } else {
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    rootImageUrl = imagePaths[randomIndex];
  }

  // Generate corner positions using useMemo to avoid recalculating on every render
  const corners = useMemo(() => {
    const tempCorners = [];
    for (let a = 0; a <= ylength; a++) {
      for (let i = 0; i <= xlength; i++) {
        tempCorners.push({
          x: (i / xlength) * window.innerWidth,
          y: (a / ylength) * window.innerHeight,
        });
      }
    }
    return tempCorners;
  }, [xlength, ylength]);

  // Initial positions set to the center of the screen
  const getInitialPositions = useCallback((x, y) => {
    return Array.from({ length: numCircles }, () => ({
      x: x !== undefined ? x : window.innerWidth / 2,
      y: y !== undefined ? y : window.innerHeight / 2,
    }));
  }, [numCircles]);

  // Generate an array of random colors and stroke widths
  const initialColorsAndWidths = useMemo(() => {
    return Array.from({ length: numCircles }, () => ({
      color: `rgba(255,255,255, 0.5)`,
      strokeWidth: Math.random() * 10 + 1,
    }));
  }, [numCircles]);

  const [circlePositions, setCirclePositions] = useState(getInitialPositions());
  const [isAnimating, setIsAnimating] = useState(false);
  const [colorsAndWidths, setColorsAndWidths] = useState(initialColorsAndWidths);
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageFalling, setImageFalling] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState(false);
  const hiddenCanvasRef = useRef(null);
  const hiddenCanvasCtxRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [allCirclesReached, setAllCirclesReached] = useState(false);
  const [circleRadii, setCircleRadii] = useState(Array(numCircles).fill(4 * (Math.random() * 2 + 1)));
  const [resetCircles, setResetCircles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hiddenCanvasRef.current) {
      hiddenCanvasCtxRef.current = hiddenCanvasRef.current.getContext('2d');
    }

    const img = new Image();
    img.onload = () => {
      const ctx = hiddenCanvasCtxRef.current;
      if (ctx) {
        hiddenCanvasRef.current.width = img.width;
        hiddenCanvasRef.current.height = img.height;
        ctx.drawImage(img, 0, 0);
        setImage(img);
        setImageSize({ width: img.width, height: img.height });
        setImageFalling(true);

        // Extract colors and stroke widths from the image
        const newColorsAndWidths = corners.map(({ x, y }) => {
          const imgX = Math.floor((x / window.innerWidth) * img.width);
          const imgY = Math.floor((y / window.innerHeight) * img.height);
          const pixel = ctx.getImageData(imgX, imgY, 1, 1).data;
          return {
            color: `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`,
            strokeWidth: Math.random() * 10 + 1,
          };
        });
        setColorsAndWidths(newColorsAndWidths);
      }

      // Extract EXIF data
      EXIF.getData(img, function () {
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
    img.src = rootImageUrl; // Load the root image
  }, [corners]);

  const convertDMSToDD = (DMS, ref) => {
    if (!DMS || DMS.length < 3 || !ref) return NaN;
    const degrees = DMS[0] + DMS[1] / 60 + DMS[2] / 3600;
    return ref === 'S' || ref === 'W' ? -degrees : degrees;
  };

  const moveCircles = useCallback(() => {
    setCirclePositions((prevPositions) => {
      let allCirclesReached = true;
      const newPositions = prevPositions.map((position, index) => {
        const targetPosition = corners[index];
        const dx = targetPosition.x - position.x;
        const dy = targetPosition.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1) {
          return position;
        } else {
          const angle = Math.atan2(dy, dx);
          const speed = 0.03 * distance;
          allCirclesReached = false;
          return {
            x: position.x + speed * Math.cos(angle),
            y: position.y + speed * Math.sin(angle),
          };
        }
      });

      if (allCirclesReached) {
        setIsAnimating(false);
        setAllCirclesReached(true);
      }
      return newPositions;
    });

    setColorsAndWidths((prevColorsAndWidths) =>
      prevColorsAndWidths.map((colorAndWidth) => ({
        ...colorAndWidth,
        strokeWidth: Math.random() * 10 + 1,
      }))
    );

    setCircleRadii((prevRadii) =>
      prevRadii.map(() => 4 * (Math.random() * 2 + 1))
    );
  }, [corners]);

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        moveCircles();
        animationFrameIdRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isAnimating, moveCircles]);

  const handleCanvasClick = () => {
    setIsAnimating(true);
  };

  useEffect(() => {
    if (imageFalling) {
      const animateImageShrink = () => {
        setImageSize((prevSize) => {
          const newWidth = prevSize.width * 0;
          const newHeight = prevSize.height * 0;

          if (newWidth <= 25 || newHeight <= 25) {
            setImageFalling(false);
            setIsAnimating(true);
            setCirclesVisible(true);
            return { width: 0, height: 0 };
          } else {
            setCirclesVisible(false);
            return { width: newWidth, height: newHeight };
          }
        });
        animationFrameIdRef.current = requestAnimationFrame(animateImageShrink);
      };
      animateImageShrink();
    }

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [imageFalling]);

  useEffect(() => {
    if (allCirclesReached) {
      const duration = 2000; // 5 seconds
      const interval = 50; // Update every 50ms
      const steps = duration / interval;
      setTimeout(() => {
        clearInterval();
        setResetCircles(true);
      }, duration);
    }
  }, [allCirclesReached, circleRadii]);

  useEffect(() => {
    if (resetCircles) {
      const duration = 5000; // 10 seconds to move back to the center
      const interval = 50; // Update every 50ms
      const steps = duration / interval;
      const decrement = circleRadii.map(r => r / steps);

      const moveBackToCenter = () => {
        setCirclePositions((prevPositions) => {
          const newPositions = prevPositions.map((position) => {
            const dx = window.innerWidth / 2 - position.x;
            const dy = window.innerHeight / 2 - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 1) {
              return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            } else {
              const angle = Math.atan2(dy, dx);
              const speed = distance * 500 / duration;
              return {
                x: position.x + speed * Math.cos(angle),
                y: position.y + speed * Math.sin(angle),
              };
            }
          });
          return newPositions;
        });
      };

      const intervalId = setInterval(moveBackToCenter, interval);
      const intervalId1 = setInterval(() => {
        setCircleRadii(prevRadii =>
          prevRadii.map((r, i) => Math.max(r - decrement[i], 0))
        );
      }, interval);

      setTimeout(() => {
        clearInterval(intervalId, intervalId1);
        setAllCirclesReached(false);
        setResetCircles(false);
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
              path = "/picture-throw-line";
              break;
          case 4 :
              path = "/picture-throw-goodline";
              break;
          case 5 :
              path = "/waterfalling";
              break;
          case 6 :
              path = "/picture-throw";
              break;
          default :
              path = "/picture-throw-greatline";
        }
  
  
        setTimeout(() => {
          navigate(path);
        }, 1000);
      }, duration);
    }
  }, [resetCircles, numCircles]);

  return (
    <div className="water-ripple">
      <button className="back-button" onClick={() => navigate('/random-photo')}></button>
      <canvas
        onClick={handleCanvasClick}
        width={window.innerWidth}
        height={window.innerHeight}
        className="main-canvas"
      />
      {image && imageSize.width > 0 && imageSize.height > 0 && (
        <img
          src={image.src}
          alt="Root"
          className="root-image"
          style={{
            left: (window.innerWidth - imageSize.width) / 2,
            top: (window.innerHeight - imageSize.height) / 2,
            width: imageSize.width,
            height: imageSize.height,
          }}
        />
      )}
      {circlesVisible && (
        <svg
          width={window.innerWidth}
          height={window.innerHeight}
          className="circle-svg"
        >
          {circlePositions.map((position, index) => (
            <circle
              key={index}
              cx={position.x}
              cy={position.y}
              r={circleRadii[index]}
              stroke={colorsAndWidths[index].color}
              strokeWidth={colorsAndWidths[index].strokeWidth}
              fill="none"
            />
          ))}
        </svg>
      )}
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WaterRipple;
export { lat, lon };
