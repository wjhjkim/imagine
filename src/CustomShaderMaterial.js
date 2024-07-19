import * as THREE from 'three';

class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor(options) {
    super({
      ...options,
      uniforms: {
        ...options.uniforms,
        opacity: { value: options.opacity || 1.0 },
      },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
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
      `,
    });
  }
}

export default CustomShaderMaterial;