import React, { useEffect } from 'react';
import * as THREE from 'three';

const ParticleFlag = () => {
  useEffect(() => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Define start time to track the animation start
    const startTime = Date.now();

    // Particle settings
    const particleCount = 30000;
    const flagWidth = 50;
    const flagHeight = 30;
    const layers = 10;
    const starSize = 0.4;

    // Geometry and material for particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount); // Only use Y velocity for falling
    const colors = new Float32Array(particleCount * 3);
    const delays = new Float32Array(particleCount); // Delay for each particle's fall

    const neonRed = new THREE.Color(1.0, 0.03, 0.23);
    const neonWhite = new THREE.Color(2.0, 2.0, 2.0);
    const neonBlue = new THREE.Color(0.25, 0.41, 0.88);

    const gravity = 0.05; // Fall speed
    const globalDelay = 2; // 2-second global delay

    let index = 0;
    for (let i = 0; i < flagHeight; i++) {
      for (let j = 0; j < flagWidth; j++) {
        for (let k = 0; k < layers; k++) {
          const x = j - flagWidth / 2;
          const y = -(i - flagHeight / 2);
          const z = (k - layers / 2) * 0.5;

          positions[index * 3] = x;
          positions[index * 3 + 1] = y;
          positions[index * 3 + 2] = z;

          // Set velocity only for the Y-axis (falling speed varies randomly)
          velocities[index] = Math.random() * gravity * 2 + 0.1; // Random fall speed for each particle

          // Set random delay between 0 and 2 seconds for each particle
          delays[index] = Math.random() * 2; // Delay each particle individually

          // Apply neon colors: blue section with white stars and red/white stripes
          if (i < 10 && j < 15) {
            if ((i + j) % 2 === 0) {
              colors[index * 3] = neonWhite.r;
              colors[index * 3 + 1] = neonWhite.g;
              colors[index * 3 + 2] = neonWhite.b;
            } else {
              colors[index * 3] = neonBlue.r;
              colors[index * 3 + 1] = neonBlue.g;
              colors[index * 3 + 2] = neonBlue.b;
            }
          } else if (i % 2 === 0) {
            colors[index * 3] = neonRed.r;
            colors[index * 3 + 1] = neonRed.g;
            colors[index * 3 + 2] = neonRed.b;
          } else {
            colors[index * 3] = neonWhite.r;
            colors[index * 3 + 1] = neonWhite.g;
            colors[index * 3 + 2] = neonWhite.b;
          }

          index++;
        }
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: starSize,
      vertexColors: true,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 50;

    // Animation loop with 2-second delay before falling starts
    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = (Date.now() - startTime) / 1000; // Time in seconds since the animation started
      const positionAttribute = points.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const particleDelay = globalDelay + delays[i]; // Delay for each particle

        if (elapsedTime > particleDelay) { // Start falling after the delay
          const index = i * 3;

          // Apply falling effect by adding velocity to Y-position
          positionAttribute[index + 1] -= velocities[i]; // Move down based on individual velocity
        }
      }

      points.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="canvas" style={{ display: 'block' }} />;
};

export default ParticleFlag;