import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface ThreeBackgroundProps {
  theme: "dark" | "light";
  activeTab: "home" | "sandbox" | "proposal" | "companion";
  is3DActive?: boolean;
  setIs3DActive?: (val: boolean) => void;
}

// 🔊 Interactive Audio Synth for High-Fidelity Cyberpunk Feedback
const playCyberSynth = (freq = 440, type: OscillatorType = 'sine', duration = 0.1, sweep = false) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    if (sweep) {
      // Sleek exponential pitch sweep common in high-end arcade and visual UI
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + duration);
    }
    
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    // Avoid blocking any UX if blocked by browser audio policy permissions
  }
};

// Interface for dynamic stardust explosive impacts
interface Sparkle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  life: number;
  decay: number;
}

// 🕹️ Draggable Node Wrapper that calculates precise screen plane coordinate mapping,
// manages instantaneous motion velocities, and simulates damped high-frequency springs back to bento layouts!
interface DraggableNodeProps {
  children: React.ReactNode;
  defaultPosition: [number, number, number];
  name: string;
  is3DActive: boolean;
  themeColor: string;
  onInteracted: (pos: THREE.Vector3) => void;
  springTension?: number;
}

function DraggableNode({ 
  children, 
  defaultPosition, 
  name, 
  is3DActive, 
  themeColor, 
  onInteracted,
  springTension = 0.08
}: DraggableNodeProps) {
  const { camera, raycaster, viewport } = useThree();
  const ref = useRef<THREE.Group>(null);
  
  // Real-time physics state stores
  const positionRef = useRef<THREE.Vector3>(new THREE.Vector3(...defaultPosition));
  const velocityRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(...defaultPosition));
  
  // State indicators
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Spatial readouts to inject elegantly into HTML hovering labels
  const [telemetry, setTelemetry] = useState({ x: 0, y: 0, status: "READY" });

  // Update real-time targets whenever tabs or active selections transition
  useEffect(() => {
    targetRef.current.set(...defaultPosition);
  }, [defaultPosition]);

  useFrame((state) => {
    if (!ref.current) return;

    if (isDragging) {
      // Solve dragging on a camera-facing plane positioned precisely at the object's depth
      const planeZ = positionRef.current.z;
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -planeZ);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        // Find targeted coordinate subtracting dragging offsets
        const targetX = intersection.x - dragOffsetRef.current.x;
        const targetY = intersection.y - dragOffsetRef.current.y;
        
        // Let position catch up smoothly with high frame-rate lerping
        positionRef.current.x += (targetX - positionRef.current.x) * 0.28;
        positionRef.current.y += (targetY - positionRef.current.y) * 0.28;
        
        // Calculate instantaneous momentum vectors to transfer cleanly upon flings
        velocityRef.current.subVectors(positionRef.current, ref.current.position);
      }
    } else {
      // Spring forces returning mesh back to designated baseline coordinates
      const springX = (targetRef.current.x - positionRef.current.x) * springTension;
      const springY = (targetRef.current.y - positionRef.current.y) * springTension;
      const springZ = (targetRef.current.z - positionRef.current.z) * springTension;

      velocityRef.current.x += springX;
      velocityRef.current.y += springY;
      velocityRef.current.z += springZ;

      // Friction dumper (limits oscillations and stabilizes baseline)
      velocityRef.current.multiplyScalar(0.85);

      // Translate
      positionRef.current.add(velocityRef.current);
    }

    // Apply calculated positions seamlessly to Object3D
    ref.current.position.copy(positionRef.current);

    // Stagger/update localized metadata readouts periodically to manage React performance
    if (state.clock.getElapsedTime() % 0.15 < 0.016) {
      setTelemetry({
        x: Number(positionRef.current.x.toFixed(2)),
        y: Number(positionRef.current.y.toFixed(2)),
        status: isDragging ? "CAPTURED" : isHovered ? "FOCUS" : "ORBITING"
      });
    }
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        if (!is3DActive) return;
        e.stopPropagation();
        setIsHovered(true);
        playCyberSynth(520, 'sine', 0.04); // low quiet diagnostic clicking pop
      }}
      onPointerOut={(e) => {
        if (!is3DActive) return;
        e.stopPropagation();
        setIsHovered(false);
      }}
      onPointerDown={(e) => {
        if (!is3DActive) return;
        e.stopPropagation();
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        // Capture offset between exact mouse intersection point and current object center
        dragOffsetRef.current.subVectors(e.point, positionRef.current);

        // Emit high energy tactile beeping frequency sweeps
        playCyberSynth(320, 'triangle', 0.14, true);
        onInteracted(positionRef.current);
      }}
      onPointerUp={(e) => {
        if (!is3DActive) return;
        e.stopPropagation();
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);

        // High frequency sweep on release flings
        const velocityMagnitude = velocityRef.current.length();
        if (velocityMagnitude > 0.05) {
          playCyberSynth(640 + velocityMagnitude * 200, 'sawtooth', 0.12, true);
        } else {
          playCyberSynth(580, 'sine', 0.08);
        }
      }}
    >
      {/* Visual mesh sizing scales popping upon hover and pointer triggers */}
      <group scale={isHovered ? (isDragging ? 1.05 : 1.2) : 1.0}>
        {children}
      </group>

      {/* Holographic operational tags positioned in 3D WebGL space overlaying the entities */}
      {is3DActive && (
        <Html distanceFactor={4.5} position={[0, -0.62, 0]} center>
          <div className="font-mono flex flex-col select-none whitespace-nowrap bg-slate-950/90 border rounded-lg px-2 py-1.5 text-[8px] leading-tight text-slate-300 pointer-events-none border-teal-500/30 backdrop-blur-md shadow-2xl">
            <span className="font-bold tracking-widest text-[#22d3ee] uppercase">{name}</span>
            <div className="mt-1 flex gap-2 items-center text-slate-500">
              <span>X: <strong className="text-slate-300">{telemetry.x}</strong></span>
              <span>Y: <strong className="text-slate-300">{telemetry.y}</strong></span>
              <span className={`px-1 py-[1px] rounded text-[6px] font-bold ${
                telemetry.status === "CAPTURED" ? "bg-red-500/20 text-red-400 border border-red-500/30 font-black" :
                telemetry.status === "FOCUS" ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : 
                "bg-indigo-500/10 text-indigo-400"
              }`}>
                {telemetry.status}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ☄️ Scene Content living natively inside R3F Canvas context
function SceneContent({ theme, activeTab, is3DActive }: ThreeBackgroundProps) {
  const { camera, size } = useThree();
  const isDark = theme === "dark";

  // Geometries references
  const mainCoreGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const stardustRef = useRef<THREE.Points>(null);
  const gridHelperRef = useRef<THREE.GridHelper>(null);

  // Real-time interactive liquid glass bubbles and light highlights configurations
  const cursorLightRef = useRef<THREE.PointLight>(null);
  const bubbleRefs = useRef<THREE.Mesh[]>([]);

  const bubbles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, idx) => {
      // Procedurally spread bubbles across various depth levels to create absolute dimension layers
      const angle = (idx / 18) * Math.PI * 2;
      const radius = 2.4 + Math.random() * 1.8;
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius;
      const z = (Math.random() - 0.5) * 2 - 1.5;
      return {
        id: idx,
        basePos: new THREE.Vector3(x, y, z),
        speed: 0.08 + Math.random() * 0.22,
        offset: Math.random() * Math.PI * 2,
        scale: 0.06 + Math.random() * 0.15
      };
    });
  }, []);

  // Submodules refs purely for rotation
  const coreIcosahedronRef = useRef<THREE.Mesh>(null);
  const satelliteMeshRef = useRef<THREE.Mesh>(null);
  const octahedronMeshRef = useRef<THREE.Mesh>(null);
  const dodecahedronMeshRef = useRef<THREE.Mesh>(null);
  const tetrahedronMeshRef = useRef<THREE.Mesh>(null);
  const superRingMeshRef = useRef<THREE.Mesh>(null);

  // Lights refs for GSAP theme interpolations
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const keyLightRef = useRef<THREE.PointLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);

  // 1. Generate core stardust nebula points
  const particleCount = 2000;
  const [positions, originalY, randomSpeeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const origY = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 16;
      const yVal = (Math.random() - 0.5) * 14;
      pos[idx + 1] = yVal;
      origY[i] = yVal;
      pos[idx + 2] = (Math.random() - 0.5) * 10 - 2;
      speeds[i] = 1.0 + Math.random() * 2.2;
    }
    return [pos, origY, speeds];
  }, []);

  // 2. High-Performance Sparks particles system (Avoids React states rerender triggers!)
  const sparksRef = useRef<Sparkle[]>([]);
  const sparkPointsRef = useRef<THREE.Points>(null);
  const maxSparksCount = 500;

  const [sparkPositions, sparkColors] = useMemo(() => {
    const pos = new Float32Array(maxSparksCount * 3);
    const col = new Float32Array(maxSparksCount * 3);
    // Hide dormant particles far off
    for (let i = 0; i < maxSparksCount; i++) {
       pos[i*3] = 999;
       pos[i*3+1] = 999;
       pos[i*3+2] = 999;
    }
    return [pos, col];
  }, []);

  // Spawn stardust sparks upon object grabs and impacts
  const triggerImpactSparks = (origin: THREE.Vector3, count = 25, colorString = "#22d3ee") => {
    const targetColor = new THREE.Color(colorString);
    for (let i = 0; i < count; i++) {
      sparksRef.current.push({
        position: origin.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        ),
        color: targetColor.clone(),
        life: 1.0,
        decay: 0.02 + Math.random() * 0.035
      });
    }

    // Cap maximum sparks queue to conserve fast rendering memory
    if (sparksRef.current.length > maxSparksCount) {
      sparksRef.current = sparksRef.current.slice(-maxSparksCount);
    }
  };

  // Sync lighting intensities and material colors smoothly based on Theme selections
  useEffect(() => {
    const isDarkTheme = theme === "dark";

    // Palette targets
    const coreColor = new THREE.Color(isDarkTheme ? '#22d3ee' : '#4f46e5');
    const satelliteColor = new THREE.Color(isDarkTheme ? '#ec4899' : '#a855f7');
    const starfieldColor = new THREE.Color(isDarkTheme ? '#6366f1' : '#64748b');
    const ringColor = new THREE.Color(isDarkTheme ? '#14b8a6' : '#0ea5e9');
    const octahedronColor = new THREE.Color(isDarkTheme ? '#a855f7' : '#db2777');
    const dodecahedronColor = new THREE.Color(isDarkTheme ? '#3b82f6' : '#10b981');

    if (ambientLightRef.current) {
      gsap.to(ambientLightRef.current, {
        intensity: isDarkTheme ? 0.65 : 1.35,
        duration: 1.2,
        ease: 'power2.out'
      });
      gsap.to(ambientLightRef.current.color, {
        r: isDarkTheme ? 0.1 : 0.95,
        g: isDarkTheme ? 0.12 : 0.96,
        b: isDarkTheme ? 0.25 : 0.99,
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    if (keyLightRef.current) {
      gsap.to(keyLightRef.current, {
        intensity: isDarkTheme ? 5.5 : 3.5,
        duration: 1.2,
        ease: 'power2.out'
      });
      gsap.to(keyLightRef.current.color, {
        r: isDarkTheme ? 0.13 : 0.31,
        g: isDarkTheme ? 0.83 : 0.27,
        b: isDarkTheme ? 0.93 : 0.9,
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // Material transitions
    if (coreIcosahedronRef.current) {
      const mat = coreIcosahedronRef.current.material as THREE.MeshBasicMaterial;
      gsap.to(mat.color, { r: coreColor.r, g: coreColor.g, b: coreColor.b, duration: 1.2, ease: 'power2.out' });
    }
    if (satelliteMeshRef.current) {
      const mat = satelliteMeshRef.current.material as THREE.MeshBasicMaterial;
      gsap.to(mat.color, { r: satelliteColor.r, g: satelliteColor.g, b: satelliteColor.b, duration: 1.2, ease: 'power2.out' });
    }
    if (octahedronMeshRef.current) {
      const mat = octahedronMeshRef.current.material as THREE.MeshBasicMaterial;
      gsap.to(mat.color, { r: octahedronColor.r, g: octahedronColor.g, b: octahedronColor.b, duration: 1.2, ease: 'power2.out' });
    }
    if (dodecahedronMeshRef.current) {
      const mat = dodecahedronMeshRef.current.material as THREE.MeshBasicMaterial;
      gsap.to(mat.color, { r: dodecahedronColor.r, g: dodecahedronColor.g, b: dodecahedronColor.b, duration: 1.2, ease: 'power2.out' });
    }
    if (stardustRef.current) {
      const mat = stardustRef.current.material as THREE.PointsMaterial;
      gsap.to(mat.color, { r: starfieldColor.r, g: starfieldColor.g, b: starfieldColor.b, duration: 1.2, ease: 'power2.out' });
    }
    if (ring1Ref.current && ring2Ref.current) {
      const mat1 = ring1Ref.current.material as THREE.MeshBasicMaterial;
      const mat2 = ring2Ref.current.material as THREE.MeshBasicMaterial;
      gsap.to([mat1.color, mat2.color], { r: ringColor.r, g: ringColor.g, b: ringColor.b, duration: 1.2, ease: 'power2.out' });
    }
  }, [theme]);

  // Adjust high-fidelity camera positioning during navigation shifts
  useEffect(() => {
    let targetCamZ = 3.2;
    let targetCamY = 0;
    let targetCamX = 0;

    const isMobile = size.width < 768;

    if (is3DActive) {
      // Direct center focus during sandbox experiments giving optimal spatial spacing
      targetCamZ = isMobile ? 4.2 : 2.8;
      targetCamY = 0;
      targetCamX = 0;
    } else {
      if (activeTab === "home") {
        targetCamZ = isMobile ? 3.9 : 3.2;
      } else if (activeTab === "sandbox") {
        targetCamZ = isMobile ? 3.4 : 2.5;
        targetCamY = 0.35;
        targetCamX = -0.3;
      } else if (activeTab === "proposal") {
        targetCamZ = isMobile ? 3.8 : 3.0;
        targetCamY = -0.2;
        targetCamX = 0.4;
      } else if (activeTab === "companion") {
        targetCamZ = isMobile ? 3.5 : 2.4;
        targetCamY = 0.1;
        targetCamX = -0.3;
      }
    }

    gsap.to(camera.position, {
      z: targetCamZ,
      y: targetCamY,
      x: targetCamX,
      duration: 1.6,
      ease: "power2.inOut"
    });
  }, [activeTab, is3DActive, size]);

  // 🛸 Computed Baseline Layout Anchor coordinate configurations
  const baselineLayouts = useMemo(() => {
    const isMobile = size.width < 768;

    // Set positions for all 7 structures matching different user screens
    const positionsData = {
      home: {
        core: isMobile ? [-0.1, 1.4, -1.8] : [-1.7, 0.8, -1.5],
        satellite: isMobile ? [0.1, -1.9, -2.0] : [1.9, -0.9, -1.5],
        octahedron: isMobile ? [-1.2, -1.2, -2.5] : [-2.3, -1.2, -2.0],
        dodecahedron: isMobile ? [1.2, 1.1, -2.5] : [2.2, 1.1, -2.0],
        tetrahedron: isMobile ? [-1.5, 0.2, -2.8] : [-2.1, -0.2, -1.8],
        superRing: isMobile ? [1.4, -0.6, -2.8] : [2.0, 0.1, -1.8],
        helix: isMobile ? [0, 0, -3.5] : [0, 1.2, -2.5],
        grid: [0, -2.0, -2.0],
        gridRot: Math.PI / 2.5
      },
      sandbox: {
        core: isMobile ? [0, 1.5, -1.2] : [1.7, 0.9, -1.0],
        satellite: isMobile ? [0, -1.7, -1.5] : [-1.7, -0.6, -1.0],
        octahedron: isMobile ? [-1.0, 1.0, -2.0] : [-1.9, 1.2, -1.5],
        dodecahedron: isMobile ? [1.0, -1.0, -2.0] : [1.5, -1.2, -1.5],
        tetrahedron: isMobile ? [-1.2, 0.1, -2.2] : [-2.2, 0.1, -1.2],
        superRing: isMobile ? [1.2, -0.2, -2.2] : [2.2, -0.4, -1.2],
        helix: isMobile ? [0, 2.5, -2.5] : [0, -1.5, -1.8],
        grid: [0, -1.6, -1.5],
        gridRot: Math.PI / 2.0
      },
      proposal: {
        core: isMobile ? [0, 1.4, -1.8] : [-2.1, -0.4, -1.3],
        satellite: isMobile ? [0, -1.6, -1.8] : [2.1, 1.0, -1.3],
        octahedron: isMobile ? [-1.2, 0.5, -2.2] : [-2.3, 1.1, -1.6],
        dodecahedron: isMobile ? [1.2, -0.5, -2.2] : [2.3, -1.1, -1.6],
        tetrahedron: isMobile ? [-1.5, -1.2, -2.2] : [-1.8, -1.2, -1.5],
        superRing: isMobile ? [1.5, 1.2, -2.2] : [1.8, 1.2, -1.5],
        helix: [0, -2.4, -2.0],
        grid: [0, -1.5, -1.8],
        gridRot: Math.PI / 3.0
      },
      companion: {
        core: isMobile ? [0, 1.6, -1.0] : [1.35, 0.1, -0.8],
        satellite: isMobile ? [0, -2.0, -2.2] : [-1.6, -1.1, -2.0],
        octahedron: isMobile ? [1.0, -1.0, -1.5] : [1.5, -1.1, -1.2],
        dodecahedron: isMobile ? [-1.0, 1.0, -2.2] : [-1.8, 1.0, -1.8],
        tetrahedron: isMobile ? [1.4, 0.5, -1.8] : [1.7, 0.7, -1.0],
        superRing: isMobile ? [-1.4, -0.1, -2.2] : [-2.1, -0.1, -1.5],
        helix: [0, -2.5, -2.5],
        grid: [0, -2.2, -2.2],
        gridRot: Math.PI / 2.3
      },
      labPlayground: {
        // Models are distributed in a gorgeous full screen orbital circle arc surrounding the camera!
        core: [0, 0.8, -1.2],
        satellite: [-2.1, 0.9, -1.5],
        octahedron: [2.1, 0.9, -1.5],
        dodecahedron: [-2.2, -0.8, -1.5],
        tetrahedron: [2.2, -0.8, -1.5],
        superRing: [0, -1.1, -1.2],
        helix: [0, 2.3, -2.2],
        grid: [0, -2.1, -2.0],
        gridRot: Math.PI / 2.2
      }
    };

    const scheme = is3DActive ? positionsData.labPlayground : positionsData[activeTab] || positionsData.home;
    return scheme as typeof positionsData.home;
  }, [activeTab, is3DActive, size]);

  // Sync grid helper positions with GSAP smoothly
  useEffect(() => {
    if (!gridHelperRef.current) return;
    gsap.to(gridHelperRef.current.position, {
      x: baselineLayouts.grid[0],
      y: baselineLayouts.grid[1],
      z: baselineLayouts.grid[2],
      duration: 1.8,
      ease: "power2.out"
    });
    gsap.to(gridHelperRef.current.rotation, {
      x: baselineLayouts.gridRot,
      duration: 1.8,
      ease: "power2.out"
    });
  }, [baselineLayouts]);

  // Main high frame rate render loop callback:
  // Drives kinetic rotators, organic stardust waves, custom stardust sparks updates, and pointer parallax offsets!
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const pointer = state.pointer;

    // 1. Organic drifting stardust waves animations
    if (stardustRef.current) {
      const geo = stardustRef.current.geometry;
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const values = posAttr.array as Float32Array;

      const rotMultiplier = activeTab === "sandbox" ? 2.5 : 1.0;
      stardustRef.current.rotation.y = elapsedTime * 0.012 * rotMultiplier;
      stardustRef.current.rotation.x = elapsedTime * 0.005 * rotMultiplier;

      for (let i = 0; i < particleCount; i++) {
        const floatIdx = i * 3;
        const speed = randomSpeeds[i];
        const offset = Math.sin(elapsedTime * 0.7 * speed + (values[floatIdx] * 0.18)) * 0.07;
        values[floatIdx + 1] = originalY[i] + offset;
      }
      posAttr.needsUpdate = true;
    }

    // 2. Mesh-specific kinetic spins
    if (coreIcosahedronRef.current) {
      coreIcosahedronRef.current.rotation.y = elapsedTime * 0.35;
      coreIcosahedronRef.current.rotation.x = elapsedTime * 0.14;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = elapsedTime * 0.45;
      ring1Ref.current.scale.setScalar(1 + Math.sin(elapsedTime * 2.5) * 0.07);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -elapsedTime * 0.55;
      ring2Ref.current.scale.setScalar(1 + Math.cos(elapsedTime * 2.5) * 0.07);
    }
    if (ring3Ref.current) {
       ring3Ref.current.rotation.z = elapsedTime * 0.3;
       ring3Ref.current.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.1);
    }
    if (satelliteMeshRef.current) {
      satelliteMeshRef.current.rotation.y = elapsedTime * 0.42;
      satelliteMeshRef.current.rotation.z = -elapsedTime * 0.18;
    }
    if (octahedronMeshRef.current) {
      octahedronMeshRef.current.rotation.y = -elapsedTime * 0.35;
      octahedronMeshRef.current.rotation.x = elapsedTime * 0.22;
    }
    if (dodecahedronMeshRef.current) {
      dodecahedronMeshRef.current.rotation.y = elapsedTime * 0.22;
      dodecahedronMeshRef.current.rotation.z = elapsedTime * 0.33;
    }
    if (tetrahedronMeshRef.current) {
      tetrahedronMeshRef.current.rotation.y = -elapsedTime * 0.5;
      tetrahedronMeshRef.current.rotation.z = elapsedTime * 0.25;
    }
    if (superRingMeshRef.current) {
      superRingMeshRef.current.rotation.y = elapsedTime * 0.15;
      superRingMeshRef.current.rotation.x = elapsedTime * 0.45;
    }

    // 2.5. Interact and guide liquid glass bubbles and cursor-following spotlight
    if (cursorLightRef.current) {
      // Lerp spotlight coordinates to follow user pointing input smoothly
      cursorLightRef.current.position.x += (pointer.x * 6 - cursorLightRef.current.position.x) * 0.1;
      cursorLightRef.current.position.y += (pointer.y * 5 - cursorLightRef.current.position.y) * 0.1;
    }

    bubbles.forEach((bubble, idx) => {
      const bMesh = bubbleRefs.current[idx];
      if (!bMesh) return;
      const t = elapsedTime * bubble.speed + bubble.offset;
      bMesh.position.x = bubble.basePos.x + Math.sin(t) * 0.45;
      bMesh.position.y = bubble.basePos.y + Math.cos(t * 1.1) * 0.45;
      bMesh.position.z = bubble.basePos.z + Math.sin(t * 0.8) * 0.25;
      bMesh.rotation.y = elapsedTime * 0.15;
    });

    // 3. Update high performance sparks (Explosive interactive buffer maps)
    if (sparkPointsRef.current) {
      const geo = sparkPointsRef.current.geometry;
      const positionsAttr = geo.attributes.position as THREE.BufferAttribute;
      const colorsAttr = geo.attributes.color as THREE.BufferAttribute;
      
      const posArr = positionsAttr.array as Float32Array;
      const colArr = colorsAttr.array as Float32Array;

      // Reset all array indexes to dormant state
      for (let i = 0; i < maxSparksCount; i++) {
        posArr[i*3] = 999;
        posArr[i*3+1] = 999;
        posArr[i*3+2] = 999;
      }

      // Populate alive structures
      sparksRef.current.forEach((spark, index) => {
        if (index >= maxSparksCount) return;
        
        // Translate
        spark.position.add(spark.velocity);
        
        // Slowly apply vacuum drag and gravity pulling down
        spark.velocity.multiplyScalar(0.96);
        spark.velocity.y -= 0.003; // visual digital gravity drop
        
        // Subtract life
        spark.life -= spark.decay;

        if (spark.life > 0) {
          const idx = index * 3;
          posArr[idx] = spark.position.x;
          posArr[idx+1] = spark.position.y;
          posArr[idx+2] = spark.position.z;

          colArr[idx] = spark.color.r * spark.life;
          colArr[idx+1] = spark.color.g * spark.life;
          colArr[idx+2] = spark.color.b * spark.life;
        }
      });

      // Erase dead particles inside array queue
      sparksRef.current = sparksRef.current.filter(s => s.life > 0);

      positionsAttr.needsUpdate = true;
      colorsAttr.needsUpdate = true;
    }

    // 4. Smooth floating horizon grid drifts
    if (gridHelperRef.current) {
      gridHelperRef.current.rotation.z = elapsedTime * 0.05;
    }

    // 5. Parallax coordinate dampener (Enabled when NOT dragging in sandbox view)
    if (!is3DActive) {
      const targetParallaxX = pointer.x * 0.45;
      const targetParallaxY = pointer.y * 0.45;
      
      const baselineY = (activeTab === "sandbox" ? 0.35 : activeTab === "proposal" ? -0.2 : activeTab === "companion" ? 0.1 : 0);
      camera.position.x += (targetParallaxX - camera.position.x) * 0.04;
      camera.position.y += (targetParallaxY - baselineY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, -2);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={isDark ? 0.65 : 1.35} color={isDark ? '#111827' : '#f8fafc'} />
      <pointLight ref={keyLightRef} position={[4, 6, 2]} intensity={isDark ? 5.5 : 3.5} color={isDark ? '#22d3ee' : '#4f46e5'} distance={25} />
      <pointLight ref={fillLightRef} position={[-6, -4, -3]} intensity={isDark ? 2.5 : 1.5} color={isDark ? '#ec4899' : '#0ea5e9'} distance={20} />

      {/* 💡 INTERACTIVE CURSOR HIGHLIGHT: Drives high-gloss liquid glass specular reflections */}
      <pointLight ref={cursorLightRef} intensity={isDark ? 3.5 : 7.0} color={isDark ? '#22d3ee' : '#4f46e5'} distance={12} />

      {/* ☄️ Background Stardust Fields */}
      <points ref={stardustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={particleCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.016}
          color={isDark ? '#6366f1' : '#64748b'}
          transparent
          opacity={isDark ? 0.5 : 0.3}
          sizeAttenuation
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* 💥 EXPLOSIVE INTERACTIVE SPARKS EMITTERS */}
      <points ref={sparkPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={sparkPositions} count={maxSparksCount} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={sparkColors} count={maxSparksCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 💧 BACKGROUND INTERACTIVE LIQUID GLASS BUBBLES */}
      {bubbles.map((bubble, idx) => (
        <mesh
          key={bubble.id}
          ref={(el) => { if (el) bubbleRefs.current[idx] = el; }}
          position={bubble.basePos}
          scale={bubble.scale}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color={isDark ? '#38bdf8' : '#4f46e5'}
            roughness={isDark ? 0.35 : 0.02}
            metalness={isDark ? 0.15 : 0.05}
            transmission={isDark ? 0.35 : 0.96} // High glass transmission in light mode
            thickness={2.2}
            ior={1.62}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            transparent
            opacity={isDark ? 0.45 : 0.95}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* 🛡️ 1. CORE MATRIX UNIT */}
      <DraggableNode 
        name="Mainframe Core" 
        defaultPosition={baselineLayouts.core as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#22d3ee' : '#4f46e5'}
        onInteracted={(pos) => triggerImpactSparks(pos, 35, isDark ? '#22d3ee' : '#4f46e5')}
      >
        <group ref={mainCoreGroupRef}>
          {/* Inner crystal glass sphere pulsing */}
          <mesh>
            <sphereGeometry args={[0.26, 32, 32]} />
            <meshPhysicalMaterial
              color={isDark ? '#22d3ee' : '#4f46e5'}
              roughness={isDark ? 0.32 : 0.02}
              metalness={isDark ? 0.12 : 0.02}
              transmission={isDark ? 0.3 : 0.98}
              thickness={1.6}
              ior={1.55}
              clearcoat={1.0}
              clearcoatRoughness={0.02}
              transparent
              opacity={isDark ? 0.6 : 0.98}
            />
          </mesh>
          <mesh ref={coreIcosahedronRef}>
            <icosahedronGeometry args={[0.38, 1]} />
            <meshBasicMaterial color={isDark ? '#22d3ee' : '#4f46e5'} wireframe transparent opacity={0.4} />
          </mesh>
          <points>
            <icosahedronGeometry args={[0.38, 1]} />
            <pointsMaterial color={isDark ? '#22d3ee' : '#4f46e5'} size={0.05} transparent opacity={0.8} sizeAttenuation />
          </points>
          <mesh ref={ring1Ref}>
            <torusGeometry args={[0.55, 0.008, 8, 48]} />
            <meshBasicMaterial color={isDark ? '#14b8a6' : '#0ea5e9'} transparent opacity={0.35} />
          </mesh>
          <mesh ref={ring2Ref}>
            <torusGeometry args={[0.55, 0.008, 8, 48]} />
            <meshBasicMaterial color={isDark ? '#14b8a6' : '#0ea5e9'} transparent opacity={0.35} />
          </mesh>
        </group>
      </DraggableNode>

      {/* 📡 2. TELEMETRY SATELLITE */}
      <DraggableNode 
        name="Grid Linkage" 
        defaultPosition={baselineLayouts.satellite as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#ec4899' : '#a855f7'}
        onInteracted={(pos) => triggerImpactSparks(pos, 25, isDark ? '#ec4899' : '#a855f7')}
      >
        <group>
          {/* Refractive high-end glass loop */}
          <mesh ref={satelliteMeshRef}>
            <torusKnotGeometry args={[0.26, 0.07, 60, 12]} />
            <meshPhysicalMaterial 
              color={isDark ? '#ec4899' : '#a855f7'} 
              roughness={isDark ? 0.3 : 0.02}
              metalness={isDark ? 0.1 : 0.03}
              transmission={isDark ? 0.25 : 0.94}
              thickness={1.3}
              ior={1.62}
              clearcoat={1.0}
              transparent 
              opacity={isDark ? 0.55 : 0.98} 
            />
          </mesh>
          <mesh>
            <torusKnotGeometry args={[0.262, 0.071, 48, 8]} />
            <meshBasicMaterial color={isDark ? '#ec4899' : '#a855f7'} wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      </DraggableNode>

      {/* 🔮 3. OCTAHEDRON NODE */}
      <DraggableNode 
        name="Amethyst Node" 
        defaultPosition={baselineLayouts.octahedron as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#a855f7' : '#db2777'}
        onInteracted={(pos) => triggerImpactSparks(pos, 25, isDark ? '#a855f7' : '#db2777')}
      >
        <group>
          <mesh ref={octahedronMeshRef}>
            <octahedronGeometry args={[0.34, 0]} />
            <meshPhysicalMaterial 
              color={isDark ? '#a855f7' : '#db2777'} 
              roughness={isDark ? 0.28 : 0.02}
              transmission={isDark ? 0.35 : 0.96}
              thickness={1.4}
              ior={1.52}
              clearcoat={1.0}
              transparent 
              opacity={isDark ? 0.55 : 0.95} 
            />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.345, 0]} />
            <meshBasicMaterial color={isDark ? '#a855f7' : '#db2777'} wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      </DraggableNode>

      {/* 💎 4. DODECAHEDRON CODEBASE */}
      <DraggableNode 
        name="SQL Telemetry" 
        defaultPosition={baselineLayouts.dodecahedron as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#3b82f6' : '#10b981'}
        onInteracted={(pos) => triggerImpactSparks(pos, 25, isDark ? '#3b82f6' : '#10b981')}
      >
        <group>
          <mesh ref={dodecahedronMeshRef}>
            <dodecahedronGeometry args={[0.3, 0]} />
            <meshPhysicalMaterial 
              color={isDark ? '#3b82f6' : '#10b981'} 
              roughness={isDark ? 0.3 : 0.03}
              transmission={isDark ? 0.25 : 0.95}
              thickness={1.5}
              clearcoat={0.9}
              transparent 
              opacity={isDark ? 0.6 : 0.98} 
            />
          </mesh>
          <mesh>
            <dodecahedronGeometry args={[0.305, 0]} />
            <meshBasicMaterial color={isDark ? '#3b82f6' : '#10b981'} wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      </DraggableNode>

      {/* 🧪 5. NEW TETRAHEDRON GLASS NODE */}
      <DraggableNode 
        name="AI Prism Sensor" 
        defaultPosition={baselineLayouts.tetrahedron as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#10b981' : '#f59e0b'}
        onInteracted={(pos) => triggerImpactSparks(pos, 25, isDark ? '#10b981' : '#f59e0b')}
      >
        <group>
          <mesh ref={tetrahedronMeshRef}>
            <tetrahedronGeometry args={[0.32, 0]} />
            <meshPhysicalMaterial 
              color={isDark ? '#10b981' : '#f59e0b'} 
              roughness={isDark ? 0.35 : 0.02}
              transmission={isDark ? 0.3 : 0.97}
              thickness={1.8}
              ior={1.65}
              clearcoat={1.0}
              transparent 
              opacity={isDark ? 0.6 : 0.98} 
            />
          </mesh>
          <mesh>
            <tetrahedronGeometry args={[0.325, 0]} />
            <meshBasicMaterial color={isDark ? '#10b981' : '#f59e0b'} wireframe transparent opacity={0.35} />
          </mesh>
        </group>
      </DraggableNode>

      {/* 🌐 6. NEW NEON SUPER RING REACTOR */}
      <DraggableNode 
        name="Compiler Reactor" 
        defaultPosition={baselineLayouts.superRing as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#f43f5e' : '#6366f1'}
        onInteracted={(pos) => triggerImpactSparks(pos, 30, isDark ? '#f43f5e' : '#6366f1')}
      >
        <group>
          <mesh ref={superRingMeshRef}>
            <torusGeometry args={[0.35, 0.05, 12, 64]} />
            <meshPhysicalMaterial 
              color={isDark ? '#f43f5e' : '#6366f1'} 
              roughness={isDark ? 0.25 : 0.02}
              transmission={isDark ? 0.35 : 0.92}
              thickness={1.2}
              clearcoat={0.9}
              transparent 
              opacity={isDark ? 0.55 : 0.95} 
            />
          </mesh>
          <mesh>
            <torusGeometry args={[0.35, 0.055, 8, 36]} />
            <meshBasicMaterial color={isDark ? '#f43f5e' : '#6366f1'} wireframe transparent opacity={0.3} />
          </mesh>
          <mesh ref={ring3Ref}>
            <torusGeometry args={[0.48, 0.006, 8, 36]} />
            <meshBasicMaterial color={isDark ? '#22d3ee' : '#ec4899'} transparent opacity={0.3} />
          </mesh>
        </group>
      </DraggableNode>

      {/* 🧬 7. NEW HOLOGRAPHIC HELIX CHAIN */}
      <DraggableNode 
        name="Holo Link Chain" 
        defaultPosition={baselineLayouts.helix as any} 
        is3DActive={is3DActive || false}
        themeColor={isDark ? '#14b8a6' : '#a855f7'}
        onInteracted={(pos) => triggerImpactSparks(pos, 25, isDark ? '#14b8a6' : '#a855f7')}
        springTension={0.06}
      >
        <group>
          {/* Form a gorgeous dual helix chain of glowing point blocks */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const angleVal = (idx / 12) * Math.PI * 2.8;
            const radius = 0.22;
            const yOffset = (idx / 12) * 1.0 - 0.5;
            
            const x1 = Math.sin(angleVal) * radius;
            const z1 = Math.cos(angleVal) * radius;
            
            const x2 = Math.sin(angleVal + Math.PI) * radius;
            const z2 = Math.cos(angleVal + Math.PI) * radius;

            return (
              <group key={idx}>
                {/* Strand A node with exquisite liquid glass beads */}
                <mesh position={[x1, yOffset, z1]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshPhysicalMaterial
                    color={isDark ? '#14b8a6' : '#a855f7'}
                    roughness={isDark ? 0.2 : 0.01}
                    transmission={isDark ? 0.2 : 0.95}
                    thickness={0.5}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                {/* Strand B node with exquisite liquid glass beads */}
                <mesh position={[x2, yOffset, z2]}>
                  <sphereGeometry args={[0.04, 16, 16]} />
                  <meshPhysicalMaterial
                    color={isDark ? '#ec4899' : '#0ea5e9'}
                    roughness={isDark ? 0.2 : 0.01}
                    transmission={isDark ? 0.2 : 0.95}
                    thickness={0.5}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                {/* Link line */}
                {idx % 2 === 0 && (
                  <mesh position={[(x1 + x2) / 2, yOffset, (z1 + z2) / 2]} rotation={[0, 0, angleVal]}>
                    <boxGeometry args={[radius * 2, 0.005, 0.005]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      </DraggableNode>

      {/* 🧭 Horizon cyber grids */}
      <gridHelper 
        ref={gridHelperRef}
        args={[24, 24, isDark ? '#22d3ee' : '#4f46e5', isDark ? '#111827' : '#cbd5e1']} 
        position={[0, -2.0, -2.0]}
        rotation={[Math.PI / 2.5, 0, 0]}
      />
    </>
  );
}

// Parent container hosting the WebGL setups and managing foreground/background container swap triggers
export default function ThreeBackground({ theme, activeTab, is3DActive, setIs3DActive }: ThreeBackgroundProps) {
  return (
    <>
      <div 
        className={`fixed inset-0 transition-all duration-700 overflow-hidden
          ${is3DActive 
            ? "z-30 pointer-events-auto bg-slate-950/25 backdrop-blur-[6px]" 
            : "-z-20 pointer-events-none bg-transparent"}`}
      >
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 3] }}
          dpr={[1, 2]}
          style={{ pointerEvents: is3DActive ? 'auto' : 'none' }}
        >
          <SceneContent theme={theme} activeTab={activeTab} is3DActive={is3DActive || false} />
        </Canvas>

        {/* Floating Custom HUD console available in interactive full screen mode */}
        {is3DActive && (
          <div className="absolute inset-x-0 bottom-8 px-4 flex justify-center pointer-events-none select-none">
            <div className="w-full max-w-sm rounded-2xl bg-slate-950/95 border border-teal-500/30 p-4 shadow-2xl backdrop-blur-md flex flex-col gap-3 pointer-events-auto text-slate-100 font-mono text-[10px] items-center text-center animate-bounce-slow">
              <div className="flex items-center gap-1 text-teal-400">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="font-orbitron tracking-widest font-bold uppercase">3D CYBER LABORATORY</span>
              </div>
              <p className="text-slate-400 text-[9px] max-w-xs">
                Grab, fling, and flick target modules! Click shapes to trigger high-velocity stardust fusion shocks.
              </p>
              <div className="w-full h-px bg-teal-500/10 my-1" />
              <button
                onClick={() => {
                  if (setIs3DActive) {
                    setIs3DActive(false);
                    playCyberSynth(445, 'sine', 0.2);
                  }
                }}
                className="w-full py-2 bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500 hover:to-indigo-600 border border-teal-400/30 font-bold font-orbitron tracking-wider text-teal-300 hover:text-white rounded-xl transition-all active:scale-[0.98] cursor-pointer text-[9px]"
              >
                RETURN TO PROTOCOL MODULES
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
