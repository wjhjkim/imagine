import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Water } from 'three-stdlib';
import { useSpring, animated } from '@react-spring/three';
import './wave.css';

const CustomWaterMaterial = shaderMaterial(
  {
    waterNormals: null,
    time: 0,
    sunDirection: new THREE.Vector3(0.70707, 0.70707, 0),
    sunColor: new THREE.Color(0xffffff),
    waterColor: new THREE.Color(0x000000),
    distortionScale: 3.7,
    alpha: 0.5,
    opacity: 0.5,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform sampler2D waterNormals;
    uniform float time;
    uniform vec3 sunDirection;
    uniform vec3 sunColor;
    uniform vec3 waterColor;
    uniform float distortionScale;
    uniform float alpha;
    uniform float opacity;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      vec4 noise = texture2D(waterNormals, uv * 2.0 + time * 0.05);
      uv += noise.xy * 0.1 * distortionScale;
      vec4 water = texture2D(waterNormals, uv * 2.0 - time * 0.05);
      float fresnel = dot(normalize(sunDirection), vec3(0.0, 1.0, 0.0));
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      vec3 reflection = sunColor * fresnel;
      vec3 refraction = waterColor * (1.0 - fresnel);
      vec3 color = mix(reflection, refraction, water.a);
      gl_FragColor = vec4(color, alpha * opacity);
    }
  `
);

extend({ CustomWaterMaterial });

const WaterSurface = ({ alpha }) => {
  const waterRef = useRef();
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  useFrame((state, delta) => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value += delta;
    }
  });

  return (
    <mesh ref={waterRef} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[10000, 10000]} />
      <customWaterMaterial
        attach="material"
        uniforms-waterNormals-value={waterNormals}
        uniforms-alpha-value={alpha}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const DroppedImage = ({ src, position, onRemove }) => {
  const texture = useLoader(THREE.TextureLoader, src);
  const { y } = useSpring({
    from: { y: position[1] + 100 }, // 물 표면 위 30cm에서 시작
    to: { y: position[1] - 1000 },
    config: { duration: 30000 },
  });

  useEffect(() => {
    const timer = setTimeout(onRemove, 30000); // 10초 후에 이미지 제거
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <animated.mesh position-x={position[0]} position-y={y} position-z={position[2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial attach="material" map={texture} transparent /> {/* 이미지 투명도 설정 */}
    </animated.mesh>
  );
};

const CanvasWrapper = ({ images, alpha, removeImage}) => {
  return (
    <>
      <WaterSurface alpha={alpha} />
      {images.map((image, index) => (
        <DroppedImage key={index} src={image.src} position={image.position} onRemove={() => removeImage(index)} />
      ))}
      <OrbitControls enableZoom={true} enablePan={true} />
    </>
  );
};

function Wave() {
  const [images, setImages] = useState([]);
  const [alpha, setAlpha] = useState(0.5);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const z = ((e.clientY - rect.top) / rect.height) * 2 + 1;
        setImages((images) => [...images, { src: event.target.result, position: [x * 50, 0, z * 50] }]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback((index) => {
    setImages((images) => images.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="App" onDragOver={handleDragOver} onDrop={handleDrop}>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={alpha}
        onChange={(e) => setAlpha(parseFloat(e.target.value))}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
      />
      <Canvas camera={{ position: [0, 50, 100], fov: 50 }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7.5]} intensity={1} />
        <CanvasWrapper images={images} alpha={alpha} removeImage={removeImage} />
      </Canvas>
    </div>
  );
}

export default Wave;
