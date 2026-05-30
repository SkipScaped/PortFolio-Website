import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import { Play, RotateCcw, Zap, Flame, Compass, Settings, Sparkles } from "lucide-react";

interface BabylonSandboxProps {
  theme: "dark" | "light";
}

export default function BabylonSandbox({ theme }: BabylonSandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);

  // Core state controls linked to Babylon objects
  const [coreStatus, setCoreStatus] = useState<"STABLE" | "OVERCHARGED" | "CRITICAL">("STABLE");
  const [coreSpeed, setCoreSpeed] = useState<number>(1.2);
  const [glowIntensity, setGlowIntensity] = useState<number>(0.8);
  const [temperature, setTemperature] = useState<number>(240);
  const [reactionLog, setReactionLog] = useState<string[]>([
    "Babylon.js engine initialized.",
    "Quantum plasma chambers aligned on host 3000.",
    "Orbiting geometries locked to standard frequency."
  ]);

  const addLog = (msg: string) => {
    setReactionLog((prev) => [msg, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize Babylon engine & scene
    const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Elegant transparent viewport fitting our bento layout flawlessly
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // 2. Camera setup targeting the center core
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2.2, // alpha
      Math.PI / 2.6, // beta
      4.8,           // radius
      BABYLON.Vector3.Zero(),
      scene
    );
    // Allow user to rotate and explore the 3D space with their cursor/finger
    camera.attachControl(canvas, true, false);
    camera.lowerRadiusLimit = 3.0;
    camera.upperRadiusLimit = 8.0;

    // 3. Dynamic lighting matching the theme
    const isDark = theme === "dark";
    const hemiLight = new BABYLON.HemisphericLight(
      "hemiLight",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = isDark ? 0.5 : 1.25;
    hemiLight.groundColor = isDark 
      ? new BABYLON.Color3(0.05, 0.05, 0.08) 
      : new BABYLON.Color3(0.9, 0.9, 0.95);

    const pointLight = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(2, 3, -2),
      scene
    );
    pointLight.intensity = isDark ? 1.5 : 0.8;
    pointLight.diffuse = isDark 
      ? new BABYLON.Color3(0.14, 0.83, 0.93) // Turquoise cyan
      : new BABYLON.Color3(0.31, 0.27, 0.9);  // Deep indigo

    // 4. Glow Layer for beautiful bloom/neon reflections (Cyberpunk hallmark)
    const glowLayer = new BABYLON.GlowLayer("glow", scene);
    glowLayer.intensity = glowIntensity;

    // 5. Creating multiple high-fidelity geometric 3D elements inside the workspace
    // A: Main hollow geosphere core representing the quantum cell
    const coreMesh = BABYLON.MeshBuilder.CreateSphere(
      "coreGeo",
      { diameter: 0.95, segments: 12 },
      scene
    );
    const coreMat = new BABYLON.StandardMaterial("coreMat", scene);
    coreMat.wireframe = true;
    coreMat.emissiveColor = isDark 
      ? new BABYLON.Color3(0.14, 0.83, 0.93) 
      : new BABYLON.Color3(0.31, 0.27, 0.9);
    coreMesh.material = coreMat;

    // B: Inner solid core sphere that pulses
    const innerCore = BABYLON.MeshBuilder.CreateSphere(
      "innerCore",
      { diameter: 0.45 },
      scene
    );
    const innerCoreMat = new BABYLON.StandardMaterial("innerCoreMat", scene);
    innerCoreMat.emissiveColor = new BABYLON.Color3(0.95, 0.35, 0.15); // Bright neon amber orange
    innerCore.material = innerCoreMat;

    // C: Outer rotating orbital rings (Torus structures)
    const ring1 = BABYLON.MeshBuilder.CreateTorus(
      "ring1",
      { diameter: 2.0, thickness: 0.05, tessellation: 24 },
      scene
    );
    // Position rings initially in complementary tilts
    ring1.rotation.x = Math.PI / 3.5;
    const ringMat1 = new BABYLON.StandardMaterial("ringMat1", scene);
    ringMat1.emissiveColor = isDark 
      ? new BABYLON.Color3(0.93, 0.28, 0.6)  // Pink magenta
      : new BABYLON.Color3(0.5, 0.2, 0.85);  // Royal purple
    ringMat1.wireframe = true;
    ring1.material = ringMat1;

    const ring2 = BABYLON.MeshBuilder.CreateTorus(
      "ring2",
      { diameter: 1.6, thickness: 0.03, tessellation: 24 },
      scene
    );
    ring2.rotation.y = Math.PI / 4.0;
    const ringMat2 = new BABYLON.StandardMaterial("ringMat2", scene);
    ringMat2.emissiveColor = isDark 
      ? new BABYLON.Color3(0.08, 0.72, 0.65)  // Teal
      : new BABYLON.Color3(0.05, 0.65, 0.95); // Azure blue
    ringMat2.wireframe = true;
    ring2.material = ringMat2;

    // D: Satellite swarm system (Custom mesh array doing orbital physics trigonometry)
    const satellitesCount = 8;
    const satelliteMeshes: BABYLON.Mesh[] = [];
    const satMaterials: BABYLON.StandardMaterial[] = [];

    for (let i = 0; i < satellitesCount; i++) {
      const sat = BABYLON.MeshBuilder.CreateBox(
        `sat_${i}`,
        { size: 0.09 },
        scene
      );
      const satMat = new BABYLON.StandardMaterial(`satMat_${i}`, scene);
      satMat.emissiveColor = new BABYLON.Color3(Math.random(), Math.random(), 1.0);
      sat.material = satMat;
      satelliteMeshes.push(sat);
      satMaterials.push(satMat);
    }

    // 6. Main render frame loop
    let time = 0;
    const renderLoop = () => {
      time += 0.015 * coreSpeed;

      // Pulse calculations
      const pulseScale = 1.0 + Math.sin(time * 3.5) * 0.12;
      coreMesh.scaling.setAll(pulseScale);

      const innerPulseScale = 1.0 + Math.cos(time * 5.0) * 0.18;
      innerCore.scaling.setAll(innerPulseScale);

      // Orbital rotation coordinates
      coreMesh.rotation.y = time * 0.45;
      coreMesh.rotation.x = time * 0.18;

      ring1.rotation.y = time * 0.35;
      ring1.rotation.z = time * 0.15;

      ring2.rotation.x = -time * 0.55;
      ring2.rotation.y = time * 0.25;

      // Swarm trigonometry tracking orbits
      satelliteMeshes.forEach((sat, idx) => {
        const offsetAngle = (idx / satellitesCount) * Math.PI * 2 + time * 0.8;
        const radius = 1.1 + Math.sin(time + idx) * 0.15;
        sat.position.x = Math.sin(offsetAngle) * radius;
        sat.position.z = Math.cos(offsetAngle) * radius;
        sat.position.y = Math.sin(time * 1.5 + idx) * 0.3;
        
        sat.rotation.y = time * 1.2;
        sat.rotation.x = time * 0.5;
      });

      // Synchronize slider state values safely
      glowLayer.intensity = glowIntensity;

      // Sync color overrides dynamically depending on core statuses
      if (coreStatus === "CRITICAL") {
        const dangerRed = new BABYLON.Color3(1.0, 0.1, 0.1);
        coreMat.emissiveColor = dangerRed;
        innerCoreMat.emissiveColor = dangerRed;
        glowLayer.intensity = glowIntensity * 1.6;
      } else if (coreStatus === "OVERCHARGED") {
        const energyGold = new BABYLON.Color3(0.98, 0.75, 0.1);
        coreMat.emissiveColor = energyGold;
        innerCoreMat.emissiveColor = energyGold;
        glowLayer.intensity = glowIntensity * 1.35;
      } else {
        // Return back to elegant defaults synchronizing with App Theme
        coreMat.emissiveColor = isDark 
          ? new BABYLON.Color3(0.14, 0.83, 0.93) 
          : new BABYLON.Color3(0.31, 0.27, 0.9);
        innerCoreMat.emissiveColor = new BABYLON.Color3(0.95, 0.35, 0.15);
      }

      scene.render();
    };

    engine.runRenderLoop(renderLoop);

    // 7. Watch for canvas dimensions shifts manually to maintain superb responsiveness
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, [theme, coreSpeed, glowIntensity, coreStatus]);

  // Handle thermal metrics tick simulations
  useEffect(() => {
    const timer = setInterval(() => {
      const baseTemp = coreStatus === "CRITICAL" ? 780 : coreStatus === "OVERCHARGED" ? 450 : 220;
      const variation = Math.floor(Math.random() * 24 - 12);
      setTemperature(Math.max(40, baseTemp + variation));
    }, 1500);

    return () => clearInterval(timer);
  }, [coreStatus]);

  return (
    <div className="glass-panel relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      <div className="absolute top-0 left-0 h-[2.5px] w-full bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 opacity-90" />

      {/* Header and Engine labelings */}
      <div className="flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <h3 className="font-orbitron text-xs font-bold tracking-widest text-slate-100 uppercase">
              Babylon.js 3D Quantum Holo-Core
            </h3>
          </div>
          <span className="font-mono text-[9px] text-pink-400 font-bold border border-pink-500/20 px-2 py-0.5 rounded bg-pink-500/5 uppercase">
            Babylon.js v7.x
          </span>
        </div>
        <p className="font-sans text-[11px] text-slate-400">
          Hold, rotate, click, and customize this high-fidelity procedural 3D model running on Babylon’s WebGL graphics pipe.
        </p>
      </div>

      {/* Main split grid: WebGL view vs custom tuning board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Visual Canvas Element spanning columns */}
        <div className="lg:col-span-7 relative h-72 lg:h-96 rounded-xl overflow-hidden border border-slate-900 bg-slate-950/60 flex items-center justify-center">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto"
            style={{ outline: "none", touchAction: "none" }}
          />
          
          {/* Dynamic 3D telemetry display in corner */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none font-mono text-[9px] text-slate-400 bg-slate-950/80 border border-slate-800/40 p-2.5 rounded-lg backdrop-blur-md">
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
              TELEMETRY: ONLINE
            </span>
            <div className="mt-1 flex flex-col gap-0.5 text-slate-500">
              <span>Status: <strong className={`font-bold ${
                coreStatus === "CRITICAL" ? "text-red-400" : coreStatus === "OVERCHARGED" ? "text-amber-400" : "text-emerald-400"
              }`}>{coreStatus}</strong></span>
              <span>Thermals: <strong className="text-slate-300">{temperature}°K</strong></span>
              <span>Rotations: <strong className="text-slate-300">{(coreSpeed * 45).toFixed(0)} RPM</strong></span>
            </div>
          </div>
        </div>

        {/* Console tuning board spanning columns */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          
          <div className="space-y-4">
            {/* Core engine state selectors */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Settings className="h-3 w-3 text-indigo-400 animate-spin-slow" /> Chamber Reactivity State
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["STABLE", "OVERCHARGED", "CRITICAL"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setCoreStatus(status);
                      if (status === "CRITICAL") {
                        setCoreSpeed(2.8);
                        setGlowIntensity(1.5);
                        addLog("[ALERT]: Reaction chamber pushed to critical limits.");
                      } else if (status === "OVERCHARGED") {
                        setCoreSpeed(1.8);
                        setGlowIntensity(1.1);
                        addLog("[SYSTEM]: core_boost() -> reactivity amplified.");
                      } else {
                        setCoreSpeed(1.0);
                        setGlowIntensity(0.7);
                        addLog("[SYSTEM]: chamber returned to baseline coordinates.");
                      }
                    }}
                    className={`py-2 rounded-lg border font-mono text-[9px] font-bold transition-all cursor-pointer ${
                      coreStatus === status
                        ? status === "CRITICAL" 
                          ? "bg-red-500/25 border-red-500 text-red-400 font-black shadow-lg shadow-red-500/10"
                          : status === "OVERCHARGED"
                            ? "bg-amber-500/25 border-amber-500 text-amber-400 font-black shadow-lg shadow-amber-500/10"
                            : "bg-teal-500/25 border-teal-500 text-teal-400 font-black shadow-lg shadow-teal-500/10"
                        : "bg-slate-900/60 border-slate-900/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Core kinetic speed ranges */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-slate-900 bg-slate-900/30">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 font-bold uppercase">Plasma Speed</span>
                <span className="text-emerald-400 font-bold">{coreSpeed.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="3.0" 
                step="0.1"
                value={coreSpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCoreSpeed(val);
                  addLog(`[SYSTEM]: rotor_frequency_adjusted(${val.toFixed(1)}x)`);
                }}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400 outline-none"
              />
            </div>

            {/* Emissive glow range scales */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-slate-900 bg-slate-900/30">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 font-bold uppercase">Glow Intensity</span>
                <span className="text-pink-400 font-bold">{(glowIntensity * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="2.0" 
                step="0.05"
                value={glowIntensity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setGlowIntensity(val);
                  addLog(`[SYSTEM]: photoluminescence_intensity_adjusted(${val.toFixed(2)})`);
                }}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 outline-none"
              />
            </div>
          </div>

          {/* Engine system telemetry logs output console */}
          <div className="rounded-xl border border-slate-900 bg-black/40 p-4 font-mono text-[9px] leading-relaxed select-none">
            <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-2">
              Babylon.js diagnostic feed
            </span>
            <div className="space-y-1 h-24 overflow-hidden flex flex-col justify-end text-slate-400">
              {reactionLog.slice().reverse().map((log, idx) => (
                <div key={idx} className="flex gap-1.5 truncate border-l border-slate-800 pl-2">
                  <span className="text-slate-600 font-bold">&gt;&gt;</span>
                  <p className="truncate">{log}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
