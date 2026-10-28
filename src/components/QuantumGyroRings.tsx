import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumGyroRingsProps {
  theme: 'dark' | 'light';
  turbulenceMode?: 'ambient' | 'surge' | 'quantum';
  is3DActive?: boolean;
}

export default function QuantumGyroRings({
  theme,
  turbulenceMode = 'ambient',
  is3DActive = false,
}: QuantumGyroRingsProps) {
  const isDark = theme === 'dark';
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const markersRef = useRef<THREE.InstancedMesh>(null);

  const markerCount = 18;
  const tempMatrix = new THREE.Matrix4();
  const tempPosition = new THREE.Vector3();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedMult = turbulenceMode === 'quantum' ? 2.5 : turbulenceMode === 'surge' ? 1.6 : 1.0;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.35 * speedMult;
      ring1Ref.current.rotation.y = time * 0.15 * speedMult;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.42 * speedMult;
      ring2Ref.current.rotation.z = time * 0.22 * speedMult;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = time * 0.28 * speedMult;
      ring3Ref.current.rotation.x = -time * 0.18 * speedMult;
    }

    if (groupRef.current) {
      // Gentle floating bob
      groupRef.current.position.y = (is3DActive ? 0.3 : -0.2) + Math.sin(time * 0.7) * 0.1;
      // Parallax react
      const pointer = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.15, 0.05);
    }

    // Update marker nodes traveling along the 3 concentric orbits
    if (markersRef.current) {
      for (let i = 0; i < markerCount; i++) {
        const ringIdx = i % 3;
        const radius = ringIdx === 0 ? 1.35 : ringIdx === 1 ? 1.75 : 2.15;
        const angle = (i / (markerCount / 3)) * Math.PI * 2 + time * (ringIdx === 1 ? -0.8 : 0.6) * speedMult;

        if (ringIdx === 0) {
          tempPosition.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
          if (ring1Ref.current) tempPosition.applyEuler(ring1Ref.current.rotation);
        } else if (ringIdx === 1) {
          tempPosition.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
          if (ring2Ref.current) tempPosition.applyEuler(ring2Ref.current.rotation);
        } else {
          tempPosition.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          if (ring3Ref.current) tempPosition.applyEuler(ring3Ref.current.rotation);
        }

        tempMatrix.makeTranslation(tempPosition.x, tempPosition.y, tempPosition.z);
        markersRef.current.setMatrixAt(i, tempMatrix);
      }
      markersRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const ring1Color = isDark ? '#22d3ee' : '#0284c7';
  const ring2Color = isDark ? '#818cf8' : '#4f46e5';
  const ring3Color = isDark ? '#ec4899' : '#db2777';

  return (
    <group ref={groupRef} position={[0, -0.2, -2.6]}>
      {/* ⭕ Ring 1 - Inner Gyro Orbital */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.35, 0.012, 12, 64]} />
        <meshStandardMaterial
          color={ring1Color}
          roughness={0.2}
          metalness={0.8}
          emissive={ring1Color}
          emissiveIntensity={isDark ? 0.6 : 0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* ⭕ Ring 2 - Mid Gyro Orbital */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.75, 0.014, 12, 64]} />
        <meshStandardMaterial
          color={ring2Color}
          roughness={0.2}
          metalness={0.8}
          emissive={ring2Color}
          emissiveIntensity={isDark ? 0.6 : 0.3}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* ⭕ Ring 3 - Outer Gyro Orbital */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.15, 0.016, 12, 64]} />
        <meshStandardMaterial
          color={ring3Color}
          roughness={0.2}
          metalness={0.8}
          emissive={ring3Color}
          emissiveIntensity={isDark ? 0.6 : 0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Orbiting Quantum Markers on the Gyro Rims */}
      <instancedMesh ref={markersRef} args={[undefined, undefined, markerCount]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={isDark ? '#38bdf8' : '#6366f1'}
          transparent
          opacity={0.9}
        />
      </instancedMesh>
    </group>
  );
}
