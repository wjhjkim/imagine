import React, { useState } from 'react';

const PictureStack = () => {
    const [processedImages, setProcessedImages] = useState([]);

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
  
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
  
            // 각 픽셀의 알파 값을 무작위로 설정
            for (let i = 3; i < data.length; i += 4) {
              data[i] = Math.random() * 255;
            }
  
            ctx.putImageData(imageData, 0, 0);
            const newImg = canvas.toDataURL();
            setProcessedImages(prev => [...prev, newImg]);
          };
        };
      });
    };
  
    return (
      <div>
        <input type="file" multiple onChange={handleImageUpload} />
        <div style={{ position: 'relative', width: '500px', height: '500px' }}>
          {processedImages.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`processed ${index}`} 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%' 
              }} 
            />
          ))}
        </div>
      </div>
    );
};

export default PictureStack;
