// PictureDrop.js
import React, { useState, useMemo, useCallback, createContext } from 'react';
import EXIF from 'exif-js';
import WaterRipple from './WaterRipple';
var lat = 36.37416931298615;
var lon = 127.36565860037672;
const totallength = 89;
export const DropContext = createContext();

const PictureDrop = () => {
  const [dropPosition, setDropPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [image, setImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [corners, setCorners] = useState([]);
  const [lat, setLat] = useState(36.37416931298615);
  const [lon, setLon] = useState(127.36565860037672);

  const xlength = totallength;
  const ylength = totallength;

  const getCorners = useMemo(() => {
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

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const dropX = event.clientX;
    const dropY = event.clientY;
    setDropPosition({ x: dropX, y: dropY });

    if (file && file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageSize({ width: img.width, height: img.height });
        setCorners(getCorners);

        const hiddenCanvas = document.createElement('canvas');
        const ctx = hiddenCanvas.getContext('2d');
        hiddenCanvas.width = img.width;
        hiddenCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const newColorsAndWidths = getCorners.map(({ x, y }) => {
          const imgX = Math.floor((x / window.innerWidth) * img.width);
          const imgY = Math.floor((y / window.innerHeight) * img.height);
          const pixel = ctx.getImageData(imgX, imgY, 1, 1).data;
          return {
            color: `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`,
            strokeWidth: Math.random() * 10 + 1,
          };
        });

        EXIF.getData(img, function () {
          const latitude = EXIF.getTag(this, 'GPSLatitude');
          const longitude = EXIF.getTag(this, 'GPSLongitude');
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');

          if (latitude && longitude && latRef && lonRef) {
            const parsedLat = parseFloat(convertDMSToDD(latitude, latRef));
            const parsedLon = parseFloat(convertDMSToDD(longitude, lonRef));
            if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
              setLat(parsedLat);
              setLon(parsedLon);
              console.log(`Latitude: ${parsedLat}, Longitude: ${parsedLon}`);
            } else {
              console.error('Invalid coordinates:', { lat: parsedLat, lon: parsedLon });
            }
          } else {
            console.log('No longitude, latitude found in EXIF data');
          }
        });
      };
      img.src = URL.createObjectURL(file);
    }
  }, [getCorners]);

  const convertDMSToDD = (DMS, ref) => {
    if (!DMS || DMS.length < 3 || !ref) return NaN;
    const degrees = DMS[0] + DMS[1] / 60 + DMS[2] / 3600;
    return ref === 'S' || ref === 'W' ? -degrees : degrees;
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <DropContext.Provider value={{ dropPosition, setDropPosition, image, imageSize, corners, lat, lon }}>
      <div className="picture-drop" onDrop={handleDrop} onDragOver={handleDragOver}>
        <WaterRipple />
      </div>
    </DropContext.Provider>
  );
};
export {lat,lon};
export default PictureDrop;

