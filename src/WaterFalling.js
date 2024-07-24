import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 추가
import { Image_list } from './imagefile';
import EXIF from 'exif-js';

const totallength = 89;
var lat = 36.37416931298615;
var lon = 127.36565860037672;

const WaterFalling = ({ xlength = totallength, ylength = totallength }) => {
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
  const getInitialPositions = useCallback(() => {
    return corners.map((corner) => ({
      x: corner.x,
      y: corner.y,
    }));
  }, [corners]);

  // Generate an array of random colors and stroke widths
  const initialColorsAndWidths = useMemo(() => {
    return Array.from({ length: numCircles }, () => ({
      color: `rgba(255,255,255, 0.5)`,
      strokeWidth: Math.random() * 10 + 1,
    }));
  }, [numCircles]);

  const [circlePositions] = useState(getInitialPositions());
  const [colorsAndWidths, setColorsAndWidths] = useState(initialColorsAndWidths);
  const [circleRadii, setCircleRadii] = useState(Array(numCircles).fill(0));
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const hiddenCanvasRef = useRef(null);
  const hiddenCanvasCtxRef = useRef(null);
  const animationFrameIdRef = useRef(null);
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

  const decreaseRadius = useCallback((index) => {
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const decrement = 15 / steps; // Decrement for each step

    let currentStep = 0;

    const stepDecrease = () => {
      setCircleRadii((prevRadii) => {
        const newRadii = [...prevRadii];
        newRadii[index] = Math.max(newRadii[index] - decrement, 0);
        return newRadii;
      });

      currentStep++;

      if (currentStep < steps) {
        animationFrameIdRef.current = requestAnimationFrame(stepDecrease);
      } else {
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
            path = "/waterripple";
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
      }
    };

    stepDecrease();
  }, []);

  const increaseRadius = useCallback(() => {
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 15 / steps; // Increment for each step

    // Generate random delays for each circle
    const delays = Array.from({ length: numCircles }, () => Math.random() * 500);

    const animateIncrease = (index) => {
      let currentStep = 0;

      const stepIncrease = () => {
        setCircleRadii((prevRadii) => {
          const newRadii = [...prevRadii];
          newRadii[index] = Math.min(newRadii[index] + increment, 10*(Math.random()+1));
          return newRadii;
        });

        currentStep++;

        if (currentStep < steps) {
          animationFrameIdRef.current = requestAnimationFrame(stepIncrease);
        } else {
          setTimeout(() => decreaseRadius(index), 5000); // Start decreasing after 5 seconds
        }
      };

      setTimeout(stepIncrease, delays[index]); // Start with a delay
    };

    for (let i = 0; i < numCircles; i++) {
      animateIncrease(i);
    }
  }, [numCircles, decreaseRadius]);

  useEffect(() => {
    increaseRadius();

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [increaseRadius]);

  return (
    <div className="water-ripple">
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        className="main-canvas"
      />
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
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WaterFalling;
export { lat, lon };



// import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// import EXIF from 'exif-js';

// const totallength = 89;
// var lat = 36.37416931298615;
// var lon = 127.36565860037672;

// const rootImageUrl = '/IMG_5300.JPG'; // Replace with the path to your root image

// const WaterFalling = ({ xlength = totallength, ylength = totallength }) => {
//   const numCircles = (xlength + 1) * (ylength + 1);

//   // Generate corner positions using useMemo to avoid recalculating on every render
//   const corners = useMemo(() => {
//     const tempCorners = [];
//     for (let a = 0; a <= ylength; a++) {
//       for (let i = 0; i <= xlength; i++) {
//         tempCorners.push({
//           x: (i / xlength) * window.innerWidth,
//           y: (a / ylength) * window.innerHeight,
//         });
//       }
//     }
//     return tempCorners;
//   }, [xlength, ylength]);

//   // Initial positions set to the center of the screen
//   const getInitialPositions = useCallback(() => {
//     return corners.map((corner) => ({
//       x: corner.x,
//       y: corner.y,
//     }));
//   }, [corners]);

//   // Generate an array of random colors and stroke widths
//   const initialColorsAndWidths = useMemo(() => {
//     return Array.from({ length: numCircles }, () => ({
//       color: `rgba(255,255,255, 0.5)`,
//       strokeWidth: Math.random() * 10 + 1,
//     }));
//   }, [numCircles]);

//   const [circlePositions] = useState(getInitialPositions());
//   const [colorsAndWidths, setColorsAndWidths] = useState(initialColorsAndWidths);
//   const [circleRadii, setCircleRadii] = useState(Array(numCircles).fill(0));
//   const [image, setImage] = useState(null);
//   const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
//   const hiddenCanvasRef = useRef(null);
//   const hiddenCanvasCtxRef = useRef(null);
//   const animationFrameIdRef = useRef(null);

//   useEffect(() => {
//     if (hiddenCanvasRef.current) {
//       hiddenCanvasCtxRef.current = hiddenCanvasRef.current.getContext('2d');
//     }

//     const img = new Image();
//     img.onload = () => {
//       const ctx = hiddenCanvasCtxRef.current;
//       if (ctx) {
//         hiddenCanvasRef.current.width = img.width;
//         hiddenCanvasRef.current.height = img.height;
//         ctx.drawImage(img, 0, 0);
//         setImage(img);
//         setImageSize({ width: img.width, height: img.height });

//         // Extract colors and stroke widths from the image
//         const newColorsAndWidths = corners.map(({ x, y }) => {
//           const imgX = Math.floor((x / window.innerWidth) * img.width);
//           const imgY = Math.floor((y / window.innerHeight) * img.height);
//           const pixel = ctx.getImageData(imgX, imgY, 1, 1).data;
//           return {
//             color: `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`,
//             strokeWidth: Math.random() * 10 + 1,
//           };
//         });
//         setColorsAndWidths(newColorsAndWidths);
//       }

//       // Extract EXIF data
//       EXIF.getData(img, function() {
//         const latitude = EXIF.getTag(this, 'GPSLatitude');
//         const longitude = EXIF.getTag(this, 'GPSLongitude');
//         const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
//         const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');

//         if (latitude && longitude && latRef && lonRef) {
//           const parsedLat = parseFloat(convertDMSToDD(latitude, latRef));
//           const parsedLon = parseFloat(convertDMSToDD(longitude, lonRef));
//           if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
//             lat = parsedLat;
//             lon = parsedLon;
//             console.log(`Latitude: ${lat}, Longitude: ${lon}`);

//             // Optionally set the coordinates to state
//             // setCoordinates({ lat, lon });
//           } else {
//             console.error('Invalid coordinates:', { lat: parsedLat, lon: parsedLon });
//           }
//         } else {
//           console.log('No longitude, latitude found in EXIF data');
//         }
//       });
//     };
//     img.src = rootImageUrl; // Load the root image
//   }, [corners]);

//   const convertDMSToDD = (DMS, ref) => {
//     if (!DMS || DMS.length < 3 || !ref) return NaN;
//     const degrees = DMS[0] + DMS[1] / 60 + DMS[2] / 3600;
//     return ref === 'S' || ref === 'W' ? -degrees : degrees;
//   };

//   const increaseRadius = useCallback(() => {
//     const duration = 5000; // 5 seconds
//     const interval = 50; // Update every 50ms
//     const steps = duration / interval;
//     const increment = 10 / steps; // Increment for each step

//     let currentStep = 0;

//     const animateIncrease = () => {
//       setCircleRadii((prevRadii) =>
//         prevRadii.map((r) => Math.min(r + increment, 10))
//       );

//       currentStep++;

//       if (currentStep < steps) {
//         animationFrameIdRef.current = requestAnimationFrame(animateIncrease);
//       } else {
//         setTimeout(decreaseRadius, 5000); // Start decreasing after 5 seconds
//       }
//     };

//     animateIncrease();
//   }, []);

//   const decreaseRadius = useCallback(() => {
//     const duration = 5000; // 5 seconds
//     const interval = 50; // Update every 50ms
//     const steps = duration / interval;
//     const decrement = 10 / steps; // Decrement for each step

//     let currentStep = 0;

//     const animateDecrease = () => {
//       setCircleRadii((prevRadii) =>
//         prevRadii.map((r) => Math.max(r - decrement, 0))
//       );

//       currentStep++;

//       if (currentStep < steps) {
//         animationFrameIdRef.current = requestAnimationFrame(animateDecrease);
//       }
//     };

//     animateDecrease();
//   }, []);

//   useEffect(() => {
//     increaseRadius();

//     return () => {
//       cancelAnimationFrame(animationFrameIdRef.current);
//     };
//   }, [increaseRadius]);

//   return (
//     <div className="water-ripple">
//       <canvas
//         width={window.innerWidth}
//         height={window.innerHeight}
//         className="main-canvas"
//       />
//       <svg
//         width={window.innerWidth}
//         height={window.innerHeight}
//         className="circle-svg"
//       >
//         {circlePositions.map((position, index) => (
//           <circle
//             key={index}
//             cx={position.x}
//             cy={position.y}
//             r={circleRadii[index]}
//             stroke={colorsAndWidths[index].color}
//             strokeWidth={colorsAndWidths[index].strokeWidth}
//             fill="none"
//           />
//         ))}
//       </svg>
//       <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// };

// export default WaterFalling;
// export { lat, lon };

