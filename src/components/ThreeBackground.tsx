import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ theme }: { theme: "dark" | "light" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle field
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const randomScales = new Float32Array(count);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }
    for (let i = 0; i < count; i++) {
      randomScales[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(randomScales, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: theme === "dark" ? '#6366f1' : '#4f46e5',
      transparent: true,
      opacity: theme === "dark" ? 0.4 : 0.2,
      blending: theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add a second layer of smaller, faster-moving stars
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 20;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: theme === "dark" ? '#ffffff' : '#000000',
      transparent: true,
      opacity: theme === "dark" ? 0.2 : 0.1,
      blending: theme === "dark" ? THREE.AdditiveBlending : THREE.NormalBlending
    });
    const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsMesh);

    camera.position.z = 3;

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const targetX = mouseRef.current.x * 0.5;
      const targetY = mouseRef.current.y * 0.5;
      
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      
      starsMesh.rotation.y -= 0.0005;
      
      // Smooth movement based on mouse
      particlesMesh.position.x += (targetX - particlesMesh.position.x) * 0.05;
      particlesMesh.position.y += (targetY - particlesMesh.position.y) * 0.05;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
      scene.remove(particlesMesh);
      scene.remove(starsMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-20 pointer-events-none" />;
}
