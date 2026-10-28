import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleVortexProps {
  theme: 'dark' | 'light';
  turbulenceMode?: 'ambient' | 'surge' | 'quantum';
  is3DActive?: boolean;
}

export default function ParticleVortex({
  theme,
  turbulenceMode = 'ambient',
  is3DActive = false
}: ParticleVortexProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const isDark = theme === 'dark';

  // Number of particles in the vortex accretion disk
  const count = 1600;

  // Initialize particle states in flat typed arrays for zero-allocation performance
  const [positions, colors, particleData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Flat array tracking per-particle physical state:
    // [radius, angle, inwardSpeed, angularSpeed, armId, zPhase, zBase]
    const data = new Float32Array(count * 7);

    const armsCount = 5;

    for (let i = 0; i < count; i++) {
      const arm = i % armsCount;
      const armAngle = (arm / armsCount) * Math.PI * 2;
      
      // Radius distributed with higher concentration toward mid-inner vortex
      const radius = 0.5 + Math.pow(Math.random(), 1.4) * 6.8;
      
      // Logarithmic spiral angle calculation
      const spiralSpread = (Math.random() - 0.5) * 0.45;
      const angle = armAngle + Math.log(radius + 0.3) * 2.2 + spiralSpread;
      
      const inwardSpeed = 0.003 + Math.random() * 0.006;
      const angularSpeed = (0.55 + Math.random() * 0.45) / Math.pow(radius + 0.4, 0.65);
      const zPhase = Math.random() * Math.PI * 2;
      const zBase = -1.8 * Math.exp(-radius / 1.9) + (Math.random() - 0.5) * 0.4;

      const dIdx = i * 7;
      data[dIdx] = radius;
      data[dIdx + 1] = angle;
      data[dIdx + 2] = inwardSpeed;
      data[dIdx + 3] = angularSpeed;
      data[dIdx + 4] = arm;
      data[dIdx + 5] = zPhase;
      data[dIdx + 6] = zBase;

      // Cartesians
      const pIdx = i * 3;
      pos[pIdx] = Math.cos(angle) * radius;
      pos[pIdx + 1] = Math.sin(angle) * radius * 0.72; // slight inclination
      pos[pIdx + 2] = zBase;

      // Default baseline colors
      col[pIdx] = 0.2;
      col[pIdx + 1] = 0.8;
      col[pIdx + 2] = 0.95;
    }

    return [pos, col, data];
  }, [count]);

  // Target color definitions for smooth theme transitions
  const themeColors = useMemo(() => {
    if (isDark) {
      return {
        inner: new THREE.Color('#38bdf8'),     // Vivid electric cyan
        mid: new THREE.Color('#a855f7'),       // Quantum purple
        outer: new THREE.Color('#ec4899'),     // Neon magenta
        fringe: new THREE.Color('#4f46e5')     // Deep indigo edge
      };
    } else {
      return {
        inner: new THREE.Color('#fbbf24'),     // Radiant champagne gold
        mid: new THREE.Color('#d97706'),       // Warm amber bronze
        outer: new THREE.Color('#0284c7'),     // Azure sky
        fringe: new THREE.Color('#6366f1')     // Indigo light glaze
      };
    }
  }, [isDark]);

  // Pre-allocated scratch vectors for zero-GC loop execution
  const centerPos = useRef(new THREE.Vector2(0, 0));
  const targetCenter = useRef(new THREE.Vector2(0, 0));
  const lastPointer = useRef(new THREE.Vector2(0, 0));
  const pointerSpeed = useRef(0);

  // Speed multiplier based on turbulence mode
  const modeMultiplier = turbulenceMode === 'quantum' ? 2.3 : turbulenceMode === 'surge' ? 1.6 : 1.0;

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colAttr = geo.attributes.color as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;

    const clampedDelta = Math.min(delta, 0.05);
    const time = state.clock.getElapsedTime();

    // Compute pointer velocity for dynamic disturbance
    const pX = pointer.x;
    const pY = pointer.y;
    const dX = pX - lastPointer.current.x;
    const dY = pY - lastPointer.current.y;
    const instantSpeed = Math.sqrt(dX * dX + dY * dY) / (clampedDelta || 0.016);
    pointerSpeed.current += (instantSpeed - pointerSpeed.current) * 0.1;
    lastPointer.current.set(pX, pY);

    // Gently drift vortex center towards mouse (more pronounced when 3D active)
    const pullFactor = is3DActive ? 1.8 : 0.85;
    targetCenter.current.set(pX * pullFactor, pY * pullFactor * 0.7);
    centerPos.current.lerp(targetCenter.current, clampedDelta * 3.5);

    const cX = centerPos.current.x;
    const cY = centerPos.current.y;

    const disturbance = Math.min(pointerSpeed.current * 0.06, 0.8) * modeMultiplier;

    for (let i = 0; i < count; i++) {
      const dIdx = i * 7;
      let radius = particleData[dIdx];
      let angle = particleData[dIdx + 1];
      const inwardSpeed = particleData[dIdx + 2];
      const angularSpeed = particleData[dIdx + 3];
      const zPhase = particleData[dIdx + 5];
      const zBase = particleData[dIdx + 6];

      // Keplerian angular acceleration (closer spins faster)
      const currentAngularSpeed = angularSpeed * (1 + disturbance * 0.8) * modeMultiplier;
      angle += currentAngularSpeed * clampedDelta * 1.6;

      // Inward gravitational accretion drift
      radius -= inwardSpeed * (1 + disturbance * 0.5) * modeMultiplier * (clampedDelta * 60);

      // Reset particles once they plunge into the core singularity
      if (radius < 0.45) {
        radius = 7.0 + Math.random() * 0.8;
        angle = Math.random() * Math.PI * 2;
      }

      particleData[dIdx] = radius;
      particleData[dIdx + 1] = angle;

      // Spatial coordinates with center displacement & funnel curvature
      const pIdx = i * 3;
      const xLocal = Math.cos(angle) * radius;
      const yLocal = Math.sin(angle) * radius * 0.75;
      
      // Funnel well drops particles in Z as they near the eye
      const funnelDepth = -2.4 * Math.exp(-radius / 1.7);
      const verticalWave = Math.sin(radius * 3.2 - time * 2.2 + zPhase) * 0.12;

      posArr[pIdx] = xLocal + cX;
      posArr[pIdx + 1] = yLocal + cY;
      posArr[pIdx + 2] = zBase + funnelDepth + verticalWave;

      // Compute dynamic color gradient based on radius ratio
      const normalizedR = Math.max(0, Math.min(1, (radius - 0.45) / 6.5));
      let r = 0, g = 0, b = 0;

      if (normalizedR < 0.28) {
        // Inner core to mid
        const t = normalizedR / 0.28;
        r = themeColors.inner.r + (themeColors.mid.r - themeColors.inner.r) * t;
        g = themeColors.inner.g + (themeColors.mid.g - themeColors.inner.g) * t;
        b = themeColors.inner.b + (themeColors.mid.b - themeColors.inner.b) * t;
      } else if (normalizedR < 0.72) {
        // Mid to outer
        const t = (normalizedR - 0.28) / 0.44;
        r = themeColors.mid.r + (themeColors.outer.r - themeColors.mid.r) * t;
        g = themeColors.mid.g + (themeColors.outer.g - themeColors.mid.g) * t;
        b = themeColors.mid.b + (themeColors.outer.b - themeColors.mid.b) * t;
      } else {
        // Outer to fringe
        const t = (normalizedR - 0.72) / 0.28;
        r = themeColors.outer.r + (themeColors.fringe.r - themeColors.outer.r) * t;
        g = themeColors.outer.g + (themeColors.fringe.g - themeColors.outer.g) * t;
        b = themeColors.outer.b + (themeColors.fringe.b - themeColors.outer.b) * t;
      }

      // Action potential flash during turbulence
      if (disturbance > 0.1) {
        r = Math.min(1, r + disturbance * 0.3);
        g = Math.min(1, g + disturbance * 0.3);
        b = Math.min(1, b + disturbance * 0.3);
      }

      colArr[pIdx] = r;
      colArr[pIdx + 1] = g;
      colArr[pIdx + 2] = b;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <group position={[0, 0, -2.2]} rotation={[-Math.PI / 6, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.045 : 0.038}
          vertexColors
          transparent
          opacity={isDark ? 0.85 : 0.75}
          sizeAttenuation
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* Central Singularity Glow Orb */}
      <mesh position={[centerPos.current.x, centerPos.current.y, -1.8]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial
          color={isDark ? '#38bdf8' : '#fbbf24'}
          transparent
          opacity={isDark ? 0.45 : 0.3}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
