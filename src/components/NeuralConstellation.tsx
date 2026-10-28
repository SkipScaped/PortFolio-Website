import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface NeuralConstellationProps {
  theme: 'dark' | 'light';
  neuralSurge?: boolean;
  is3DActive?: boolean;
}

interface SynapticPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

export default function NeuralConstellation({
  theme,
  neuralSurge = false,
  is3DActive = false
}: NeuralConstellationProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesPointsRef = useRef<THREE.Points>(null);
  const pulsesPointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const isDark = theme === 'dark';

  const nodeCount = 95;
  const maxLines = 320; // 320 lines = 640 vertices
  const pulseCount = 36;
  const connectionThreshold = 2.15;

  // Initialize node states (positions, velocities, baseline coordinates)
  const [nodePositions, nodeVelocities, nodeFlashes] = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const vel = new Float32Array(nodeCount * 3);
    const flash = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 13;      // X: -6.5 to 6.5
      pos[idx + 1] = (Math.random() - 0.5) * 10;  // Y: -5 to 5
      pos[idx + 2] = (Math.random() - 0.5) * 4.5 - 1.2; // Z: -3.5 to 1.0

      vel[idx] = (Math.random() - 0.5) * 0.008;
      vel[idx + 1] = (Math.random() - 0.5) * 0.008;
      vel[idx + 2] = (Math.random() - 0.5) * 0.005;

      flash[i] = 0;
    }

    return [pos, vel, flash];
  }, [nodeCount]);

  // Pre-allocate typed arrays for LineSegments
  const [linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(maxLines * 2 * 3);
    const col = new Float32Array(maxLines * 2 * 3);

    // Default to far away to hide inactive line segments
    for (let i = 0; i < maxLines * 2 * 3; i++) {
      pos[i] = 999;
      col[i] = 0;
    }

    return [pos, col];
  }, [maxLines]);

  // Pre-allocate traveling synaptic action potential pulses
  const [pulses, pulsePositions, pulseColors] = useMemo(() => {
    const pList: SynapticPulse[] = [];
    const pos = new Float32Array(pulseCount * 3);
    const col = new Float32Array(pulseCount * 3);

    for (let i = 0; i < pulseCount; i++) {
      const from = Math.floor(Math.random() * nodeCount);
      let to = Math.floor(Math.random() * nodeCount);
      if (to === from) to = (from + 1) % nodeCount;

      pList.push({
        fromNode: from,
        toNode: to,
        progress: Math.random(),
        speed: 0.012 + Math.random() * 0.018
      });

      pos[i * 3] = 999;
      pos[i * 3 + 1] = 999;
      pos[i * 3 + 2] = 999;
    }

    return [pList, pos, col];
  }, [pulseCount, nodeCount]);

  // Theme palettes
  const palette = useMemo(() => {
    if (isDark) {
      return {
        nodeColor: new THREE.Color('#2dd4bf'),      // Neon teal
        nodeGlow: new THREE.Color('#38bdf8'),       // Electric cyan
        synapseBase: new THREE.Color('#6366f1'),    // Indigo synaptic line
        synapsePulse: new THREE.Color('#f43f5e'),   // Action potential spark
        flashColor: new THREE.Color('#ffffff')
      };
    } else {
      return {
        nodeColor: new THREE.Color('#0284c7'),      // Deep azure
        nodeGlow: new THREE.Color('#f59e0b'),       // Amber glow
        synapseBase: new THREE.Color('#818cf8'),    // Light indigo
        synapsePulse: new THREE.Color('#ea580c'),   // Radiant amber pulse
        flashColor: new THREE.Color('#ffffff')
      };
    }
  }, [isDark]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    const speedMult = neuralSurge ? 2.2 : 1.0;

    // 1. Update Node Coordinates & Boundary Wrapping
    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;

      // Cursor repulsion/attraction field
      const dx = pointer.x * 5.5 - nodePositions[idx];
      const dy = pointer.y * 4.5 - nodePositions[idx + 1];
      const distToCursorSq = dx * dx + dy * dy;

      if (distToCursorSq < 6.0 && distToCursorSq > 0.01) {
        const force = (1.0 - Math.sqrt(distToCursorSq) / 2.5) * 0.003 * (is3DActive ? 2.5 : 1.0);
        nodePositions[idx] -= (dx / Math.sqrt(distToCursorSq)) * force;
        nodePositions[idx + 1] -= (dy / Math.sqrt(distToCursorSq)) * force;
      }

      // Linear motion
      nodePositions[idx] += nodeVelocities[idx] * speedMult * (clampedDelta * 60);
      nodePositions[idx + 1] += nodeVelocities[idx + 1] * speedMult * (clampedDelta * 60);
      nodePositions[idx + 2] += nodeVelocities[idx + 2] * speedMult * (clampedDelta * 60);

      // Soft bounds reflection
      if (Math.abs(nodePositions[idx]) > 6.8) nodeVelocities[idx] *= -1;
      if (Math.abs(nodePositions[idx + 1]) > 5.2) nodeVelocities[idx + 1] *= -1;
      if (nodePositions[idx + 2] > 1.2 || nodePositions[idx + 2] < -3.8) nodeVelocities[idx + 2] *= -1;

      // Decay flash highlight
      if (nodeFlashes[i] > 0) {
        nodeFlashes[i] = Math.max(0, nodeFlashes[i] - clampedDelta * 3.5);
      }
    }

    // 2. Dynamically Compute Connections (LineSegments)
    if (linesRef.current) {
      const geo = linesRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const colAttr = geo.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      let lineIdx = 0;

      for (let i = 0; i < nodeCount && lineIdx < maxLines; i++) {
        const iIdx = i * 3;
        const x1 = nodePositions[iIdx];
        const y1 = nodePositions[iIdx + 1];
        const z1 = nodePositions[iIdx + 2];

        for (let j = i + 1; j < nodeCount && lineIdx < maxLines; j++) {
          const jIdx = j * 3;
          const x2 = nodePositions[jIdx];
          const y2 = nodePositions[jIdx + 1];
          const z2 = nodePositions[jIdx + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectionThreshold * connectionThreshold) {
            const dist = Math.sqrt(distSq);
            const strength = Math.pow(1.0 - dist / connectionThreshold, 1.4);

            const v1Idx = lineIdx * 6;
            const v2Idx = v1Idx + 3;

            posArr[v1Idx] = x1;
            posArr[v1Idx + 1] = y1;
            posArr[v1Idx + 2] = z1;

            posArr[v2Idx] = x2;
            posArr[v2Idx + 1] = y2;
            posArr[v2Idx + 2] = z2;

            // Connection line color opacity modulation
            const baseR = palette.synapseBase.r;
            const baseG = palette.synapseBase.g;
            const baseB = palette.synapseBase.b;

            const glowR = palette.nodeGlow.r;
            const glowG = palette.nodeGlow.g;
            const glowB = palette.nodeGlow.b;

            colArr[v1Idx] = baseR * strength;
            colArr[v1Idx + 1] = baseG * strength;
            colArr[v1Idx + 2] = baseB * strength;

            colArr[v2Idx] = glowR * strength;
            colArr[v2Idx + 1] = glowG * strength;
            colArr[v2Idx + 2] = glowB * strength;

            lineIdx++;
          }
        }
      }

      // Hide unused line slots
      for (let k = lineIdx * 6; k < maxLines * 6; k += 3) {
        posArr[k] = 999;
        posArr[k + 1] = 999;
        posArr[k + 2] = 999;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // 3. Update Traveling Synaptic Pulses
    if (pulsesPointsRef.current) {
      const geo = pulsesPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const colAttr = geo.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      pulses.forEach((pulse, pIdx) => {
        pulse.progress += pulse.speed * speedMult * (clampedDelta * 60);

        if (pulse.progress >= 1.0) {
          // Action potential reached destination: trigger synaptic flash on destination node!
          nodeFlashes[pulse.toNode] = 1.0;

          // Pick a new synaptic path
          pulse.progress = 0;
          pulse.fromNode = pulse.toNode;
          // Find a nearby node
          let closestNode = (pulse.toNode + 1) % nodeCount;
          let minD = 999;
          const fromIdx = pulse.fromNode * 3;

          for (let c = 0; c < 8; c++) {
            const candidate = Math.floor(Math.random() * nodeCount);
            if (candidate === pulse.fromNode) continue;
            const cIdx = candidate * 3;
            const d = Math.hypot(
              nodePositions[fromIdx] - nodePositions[cIdx],
              nodePositions[fromIdx + 1] - nodePositions[cIdx + 1],
              nodePositions[fromIdx + 2] - nodePositions[cIdx + 2]
            );
            if (d < minD && d < connectionThreshold * 1.5) {
              minD = d;
              closestNode = candidate;
            }
          }

          pulse.toNode = closestNode;
        }

        const fIdx = pulse.fromNode * 3;
        const tIdx = pulse.toNode * 3;
        const t = pulse.progress;

        const pOffset = pIdx * 3;
        posArr[pOffset] = nodePositions[fIdx] + (nodePositions[tIdx] - nodePositions[fIdx]) * t;
        posArr[pOffset + 1] = nodePositions[fIdx + 1] + (nodePositions[tIdx + 1] - nodePositions[fIdx + 1]) * t;
        posArr[pOffset + 2] = nodePositions[fIdx + 2] + (nodePositions[tIdx + 2] - nodePositions[fIdx + 2]) * t;

        // Pulse flash brightness
        colArr[pOffset] = palette.synapsePulse.r;
        colArr[pOffset + 1] = palette.synapsePulse.g;
        colArr[pOffset + 2] = palette.synapsePulse.b;
      });

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // 4. Update Node Points Attribute Buffer
    if (nodesPointsRef.current) {
      const geo = nodesPointsRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const colAttr = geo.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        const idx = i * 3;
        posArr[idx] = nodePositions[idx];
        posArr[idx + 1] = nodePositions[idx + 1];
        posArr[idx + 2] = nodePositions[idx + 2];

        // Flash brighter when receiving action potential
        const f = nodeFlashes[i];
        colArr[idx] = palette.nodeColor.r * (1 - f) + palette.flashColor.r * f;
        colArr[idx + 1] = palette.nodeColor.g * (1 - f) + palette.flashColor.g * f;
        colArr[idx + 2] = palette.nodeColor.b * (1 - f) + palette.flashColor.b * f;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, -1.0]}>
      {/* 🧠 Synaptic Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={maxLines * 2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={lineColors}
            count={maxLines * 2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isDark ? 0.65 : 0.55}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* ⚡ Traveling Action Potential Sparks */}
      <points ref={pulsesPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={pulsePositions}
            count={pulseCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={pulseColors}
            count={pulseCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.08 : 0.065}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 🔮 Neural Nodes Point Clustered Array */}
      <points ref={nodesPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(nodeCount * 3)}
            count={nodeCount}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={new Float32Array(nodeCount * 3)}
            count={nodeCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.095 : 0.075}
          vertexColors
          transparent
          opacity={isDark ? 0.95 : 0.85}
          sizeAttenuation
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
