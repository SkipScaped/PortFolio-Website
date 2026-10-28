import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  X, RotateCw, Eye, Sparkles, Layers, Sliders, Maximize2, Minimize2, 
  Zap, Award, Compass, ShieldCheck, Box
} from 'lucide-react';

interface Project3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    role?: string;
    badge: string;
    desc: string;
    link: string;
    highlightColor: "cyan" | "indigo" | "emerald" | "amber" | "rose" | "purple";
  } | null;
  theme: 'dark' | 'light';
}

// 🔊 Synth audio feedback
const playModalTone = (freq = 520, type: OscillatorType = 'sine', duration = 0.08) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio permission
  }
};

// 1. OverDrive Energy Turbine & Cryo-Canister Model
function OverDriveTurbine({ wireframe, exploded, color }: { wireframe: boolean; exploded: number; color: string }) {
  const turbineRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (turbineRef.current) turbineRef.current.rotation.z += delta * 2.5;
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.8;
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.5;
      coreRef.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group>
      {/* Central Cryo Core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.55, 1]} />
        <meshPhysicalMaterial
          color={color}
          wireframe={wireframe}
          roughness={0.1}
          metalness={0.4}
          transmission={wireframe ? 0 : 0.85}
          thickness={1.5}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Top Cap (Explodes upward) */}
      <mesh position={[0, 1.2 + exploded * 0.8, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.35, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Bottom Base (Explodes downward) */}
      <mesh position={[0, -1.2 - exploded * 0.8, 0]}>
        <cylinderGeometry args={[0.9, 0.8, 0.35, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} wireframe={wireframe} />
      </mesh>

      {/* Outer Protective Slotted Lattice Tube */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.05 + exploded * 0.3, 1.05 + exploded * 0.3, 2.0, 16, 4, true]} />
        <meshStandardMaterial color={color} wireframe metalness={0.8} roughness={0.3} transparent opacity={0.6} />
      </mesh>

      {/* High-Voltage Kinetic Turbine Fan */}
      <group ref={turbineRef} position={[0, 0.5 + exploded * 0.4, 0]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} rotation={[0, (i / 6) * Math.PI * 2, Math.PI / 4]}>
            <boxGeometry args={[0.7, 0.04, 0.15]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Equatorial Gyro Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.4 + exploded * 0.5, 0.04, 16, 48]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

// 2. LevinoAuthin Neural Cube Matrix Model
function LevinoAuthinTesseract({ wireframe, exploded, color }: { wireframe: boolean; exploded: number; color: string }) {
  const outerBoxRef = useRef<THREE.Mesh>(null);
  const midBoxRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerBoxRef.current) {
      outerBoxRef.current.rotation.x += delta * 0.4;
      outerBoxRef.current.rotation.y += delta * 0.6;
    }
    if (midBoxRef.current) {
      midBoxRef.current.rotation.y -= delta * 0.8;
      midBoxRef.current.rotation.z += delta * 0.5;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x -= delta * 0.6;
      innerCoreRef.current.rotation.z -= delta * 0.9;
    }
  });

  return (
    <group>
      {/* Outer Hologram Frame */}
      <mesh ref={outerBoxRef}>
        <boxGeometry args={[2.2 + exploded * 0.8, 2.2 + exploded * 0.8, 2.2 + exploded * 0.8]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.7} />
      </mesh>

      {/* Mid Layer Glass Prism */}
      <mesh ref={midBoxRef}>
        <boxGeometry args={[1.5 + exploded * 0.4, 1.5 + exploded * 0.4, 1.5 + exploded * 0.4]} />
        <meshPhysicalMaterial
          color={color}
          wireframe={wireframe}
          transmission={wireframe ? 0 : 0.8}
          roughness={0.1}
          metalness={0.5}
          ior={1.8}
          thickness={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Glowing Synapse Nucleus */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.0}
          wireframe={wireframe}
        />
      </mesh>

      {/* Satellite corner sensor probes */}
      {[
        [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]
      ].map((pos, idx) => {
        const spread = 1.3 + exploded * 0.9;
        return (
          <mesh key={idx} position={[pos[0] * spread, pos[1] * spread, pos[2] * spread]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        );
      })}
    </group>
  );
}

// 3. Weather Flow Pro Atmospheric Radar Model
function WeatherFlowRadar({ wireframe, exploded, color }: { wireframe: boolean; exploded: number; color: string }) {
  const radarSweepRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (radarSweepRef.current) radarSweepRef.current.rotation.y += delta * 2.0;
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x += delta * 0.3;
      ringGroupRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group>
      {/* Central Cloud Geo-Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          wireframe={wireframe}
          transmission={wireframe ? 0 : 0.85}
          roughness={0.2}
          metalness={0.3}
          thickness={2.0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Radar Dish & Sweeper */}
      <group ref={radarSweepRef} position={[0, 0, 0]}>
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshStandardMaterial color="#38bdf8" wireframe={wireframe} />
        </mesh>
        {/* Sweep beam */}
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[1.2, 0.02, 0.02]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Concentric Barometric Latitude Rings */}
      <group ref={ringGroupRef}>
        <mesh position={[0, 0.4 + exploded * 0.4, 0]}>
          <torusGeometry args={[1.3, 0.02, 16, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, -0.4 - exploded * 0.4, 0]}>
          <torusGeometry args={[1.3, 0.02, 16, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.6 + exploded * 0.6, 0.03, 16, 48]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.6} wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}

// 4. Default / Bio-Dome Model (Green Loop / SMP / Generic)
function BioDomeModel({ wireframe, exploded, color }: { wireframe: boolean; exploded: number; color: string }) {
  const domeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (domeRef.current) domeRef.current.rotation.y += delta * 0.5;
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.7;
      ringRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={domeRef} position={[0, 0, 0]}>
        <dodecahedronGeometry args={[1.0, 0]} />
        <meshPhysicalMaterial
          color={color}
          wireframe={wireframe}
          roughness={0.15}
          metalness={0.3}
          transmission={wireframe ? 0 : 0.85}
          thickness={1.5}
          ior={1.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.5 + exploded * 0.5, 0.04, 16, 48]} />
        <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

// Model Selector
function ArtifactScene({
  projectTitle,
  wireframe,
  exploded,
  color,
  rotationSpeed,
}: {
  projectTitle: string;
  wireframe: boolean;
  exploded: number;
  color: string;
  rotationSpeed: number;
}) {
  const rootGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rootGroupRef.current && rotationSpeed > 0) {
      rootGroupRef.current.rotation.y += delta * 0.6 * rotationSpeed;
    }
  });

  const titleLower = projectTitle.toLowerCase();

  return (
    <group ref={rootGroupRef}>
      {titleLower.includes('overdrive') ? (
        <OverDriveTurbine wireframe={wireframe} exploded={exploded} color={color} />
      ) : titleLower.includes('levinoauthin') ? (
        <LevinoAuthinTesseract wireframe={wireframe} exploded={exploded} color={color} />
      ) : titleLower.includes('weather') ? (
        <WeatherFlowRadar wireframe={wireframe} exploded={exploded} color={color} />
      ) : (
        <BioDomeModel wireframe={wireframe} exploded={exploded} color={color} />
      )}
    </group>
  );
}

export default function Project3DModal({
  isOpen,
  onClose,
  project,
  theme,
}: Project3DModalProps) {
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(0); // 0 to 1
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [activeColor, setActiveColor] = useState<string>('#22d3ee');
  const [isControlsExpanded, setIsControlsExpanded] = useState(true);

  // Sync initial color with project theme
  useEffect(() => {
    if (project) {
      const colorMap: Record<string, string> = {
        cyan: '#22d3ee',
        amber: '#f59e0b',
        indigo: '#818cf8',
        emerald: '#10b981',
        rose: '#f43f5e',
        purple: '#c084fc',
      };
      setActiveColor(colorMap[project.highlightColor] || '#22d3ee');
    }
  }, [project]);

  // Handle keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        playModalTone(380);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in select-none">
      
      {/* 🚀 Main Modal Shell */}
      <div className="relative w-full max-w-5xl h-[88vh] rounded-3xl border border-teal-500/30 bg-slate-950/90 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Box className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-orbitron text-sm sm:text-base font-black tracking-wide text-white">
                  3D ARTIFACT INSPECTOR // {project.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  INTERACTIVE WEBGL
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                DRAG TO ORBIT • SCROLL TO ZOOM • RIGHT-CLICK TO PAN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playModalTone(420);
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Close 3D Inspector (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3D Viewport Canvas */}
        <div className="relative flex-1 w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 cursor-grab active:cursor-grabbing">
          
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={isDark ? 0.8 : 1.4} />
            <pointLight position={[5, 6, 4]} intensity={5.0} color="#ffffff" />
            <pointLight position={[-5, -4, -3]} intensity={2.5} color={activeColor} />
            
            <ArtifactScene
              projectTitle={project.title}
              wireframe={wireframe}
              exploded={exploded}
              color={activeColor}
              rotationSpeed={rotationSpeed}
            />

            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minDistance={2.0}
              maxDistance={7.5}
            />
          </Canvas>

          {/* Quick corner indicator */}
          <div className="absolute top-4 left-4 pointer-events-none font-mono text-[10px] text-teal-400/80 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-teal-500/20 backdrop-blur-sm">
            FPS: 60 • POLYGONS: PROCEDURAL • SHADER: PBR_GLASS
          </div>
        </div>

        {/* Ergonomic Unified Bottom Control Dock */}
        <div className="relative z-10 border-t border-white/10 bg-slate-950/90 backdrop-blur-md px-6 py-3">
          
          {/* Collapse/Expand Toggle Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-3 w-3 text-teal-400" /> KINEMATICS & SHADER CONTROLS
            </span>
            <button
              onClick={() => {
                playModalTone(580);
                setIsControlsExpanded(!isControlsExpanded);
              }}
              className="text-[10px] font-mono text-teal-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {isControlsExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              <span>{isControlsExpanded ? "HIDE_DOCK" : "SHOW_DOCK"}</span>
            </button>
          </div>

          {isControlsExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 animate-fade-in">
              
              {/* 1. Wireframe Toggle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">GEOMETRY MESH</span>
                <button
                  onClick={() => {
                    playModalTone(wireframe ? 460 : 720);
                    setWireframe(!wireframe);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    wireframe
                      ? "bg-teal-500/20 text-teal-300 border-teal-400/50 shadow-md shadow-teal-500/20"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{wireframe ? "WIREFRAME: ON" : "PBR LIQUID GLASS"}</span>
                </button>
              </div>

              {/* 2. Exploded View Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>EXPLODED MATRIX</span>
                  <span className="text-teal-400">{Math.round(exploded * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={exploded}
                  onChange={(e) => {
                    setExploded(parseFloat(e.target.value));
                    playModalTone(300 + parseFloat(e.target.value) * 300, 'sine', 0.03);
                  }}
                  className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 3. Rotation Speed Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>KINETIC ROTATION</span>
                  <span className="text-teal-400">{rotationSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.2"
                  value={rotationSpeed}
                  onChange={(e) => {
                    setRotationSpeed(parseFloat(e.target.value));
                    playModalTone(400 + parseFloat(e.target.value) * 150, 'sine', 0.03);
                  }}
                  className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 4. Color Swatches */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">HOLOGRAM SPECTRUM</span>
                <div className="flex items-center gap-2">
                  {[
                    { hex: '#22d3ee', label: 'Cyan' },
                    { hex: '#f59e0b', label: 'Amber' },
                    { hex: '#818cf8', label: 'Indigo' },
                    { hex: '#10b981', label: 'Emerald' },
                    { hex: '#f43f5e', label: 'Rose' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        playModalTone(650);
                        setActiveColor(c.hex);
                      }}
                      className={`h-7 w-7 rounded-lg transition-transform cursor-pointer border ${
                        activeColor === c.hex ? "scale-115 border-white ring-2 ring-white/30" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
