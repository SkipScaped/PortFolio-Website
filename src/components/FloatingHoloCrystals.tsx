import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingHoloCrystalsProps {
  theme: 'dark' | 'light';
  turbulenceMode?: 'ambient' | 'surge' | 'quantum';
}

interface CrystalConfig {
  id: number;
  type: 'icosa' | 'octa' | 'dodeca' | 'tetra';
  basePos: [number, number, number];
  rotationSpeed: [number, number, number];
  bobFrequency: number;
  bobAmplitude: number;
  scale: number;
  color: string;
}

export default function FloatingHoloCrystals({
  theme,
  turbulenceMode = 'ambient',
}: FloatingHoloCrystalsProps) {
  const isDark = theme === 'dark';
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const wireRefs = useRef<THREE.Mesh[]>([]);

  // Procedural crystal configs distributed across wide field of view
  const crystals = useMemo<CrystalConfig[]>(() => {
    const palette = isDark
      ? ['#22d3ee', '#818cf8', '#f43f5e', '#34d399', '#fbbf24', '#c084fc']
      : ['#0284c7', '#6366f1', '#e11d48', '#059669', '#d97706', '#9333ea'];

    const types: ('icosa' | 'octa' | 'dodeca' | 'tetra')[] = ['icosa', 'octa', 'dodeca', 'tetra'];

    return Array.from({ length: 14 }).map((_, i) => {
      // Spread across Z-depth and along viewport edges to avoid blocking text
      const angle = (i / 14) * Math.PI * 2;
      const radius = 3.6 + (i % 3) * 1.4;
      const x = Math.sin(angle) * radius;
      const y = ((i % 5) - 2) * 1.6;
      const z = -2.5 - (i % 4) * 1.8;

      return {
        id: i,
        type: types[i % types.length],
        basePos: [x, y, z],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.3,
        ],
        bobFrequency: 0.6 + Math.random() * 0.8,
        bobAmplitude: 0.15 + Math.random() * 0.25,
        scale: 0.22 + (i % 3) * 0.12,
        color: palette[i % palette.length],
      };
    });
  }, [isDark]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedMult = turbulenceMode === 'quantum' ? 2.2 : turbulenceMode === 'surge' ? 1.5 : 1.0;

    crystals.forEach((crystal, idx) => {
      const mesh = meshRefs.current[idx];
      const wire = wireRefs.current[idx];
      if (!mesh) return;

      // Smooth floating bob
      const bob = Math.sin(time * crystal.bobFrequency * speedMult + crystal.id) * crystal.bobAmplitude;
      mesh.position.y = crystal.basePos[1] + bob;
      mesh.position.x = crystal.basePos[0] + Math.cos(time * 0.3 + crystal.id) * 0.1;

      // Rotation kinetics
      mesh.rotation.x += crystal.rotationSpeed[0] * 0.015 * speedMult;
      mesh.rotation.y += crystal.rotationSpeed[1] * 0.02 * speedMult;
      mesh.rotation.z += crystal.rotationSpeed[2] * 0.015 * speedMult;

      if (wire) {
        wire.position.copy(mesh.position);
        wire.rotation.copy(mesh.rotation);
      }
    });

    if (groupRef.current) {
      // Subtle pointer reactive tilt for the entire crystal cluster
      const pointer = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.12, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -pointer.y * 0.1, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {crystals.map((c, idx) => {
        let Geo = <icosahedronGeometry args={[1, 0]} />;
        if (c.type === 'octa') Geo = <octahedronGeometry args={[1, 0]} />;
        if (c.type === 'dodeca') Geo = <dodecahedronGeometry args={[1, 0]} />;
        if (c.type === 'tetra') Geo = <tetrahedronGeometry args={[1, 0]} />;

        return (
          <React.Fragment key={c.id}>
            {/* Solid Glass Faceted Body */}
            <mesh
              ref={(el) => { if (el) meshRefs.current[idx] = el; }}
              position={c.basePos}
              scale={c.scale}
            >
              {Geo}
              <meshPhysicalMaterial
                color={c.color}
                roughness={isDark ? 0.25 : 0.03}
                metalness={isDark ? 0.3 : 0.05}
                transmission={isDark ? 0.4 : 0.95}
                thickness={1.5}
                ior={1.65}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
                transparent
                opacity={isDark ? 0.65 : 0.92}
                depthWrite={false}
              />
            </mesh>

            {/* Glowing Wireframe Outer Exoskeleton */}
            <mesh
              ref={(el) => { if (el) wireRefs.current[idx] = el; }}
              position={c.basePos}
              scale={c.scale * 1.04}
            >
              {Geo}
              <meshBasicMaterial
                color={c.color}
                wireframe
                transparent
                opacity={isDark ? 0.45 : 0.65}
              />
            </mesh>
          </React.Fragment>
        );
      })}
    </group>
  );
}
