import React, { useRef, useEffect, useState } from "react";
import { Play, RotateCcw, Shield, Zap, Swords, Award, Brain, Compass, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Star3D {
  gx: number; // Grid x
  gy: number; // Grid y
  gz: number; // Grid height
  active: boolean;
  value: number;
}

interface Obstacle3D {
  gx: number; // Grid x
  gy: number; // Grid y
  gz: number; // Grid height
  speed: number;
  width: number;
  direction: number;
  color: string;
  type?: "bug" | "mecha";
}

interface Particle3D {
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

interface Bullet3D {
  gx: number;
  gy: number;
  gz: number;
  vx: number;
  vy: number;
  active: boolean;
}

const MECHA_SPRITE = [
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,6,6,6,6,6,6,1,0],
  [1,6,1,1,1,1,1,1,6,1], // head
  [1,6,1,5,5,5,5,1,6,1], // red visor
  [1,6,1,1,1,1,1,1,6,1],
  [0,1,6,6,6,6,6,6,1,0],
  [0,0,0,1,1,1,1,0,0,0], // neck
  [0,1,1,6,1,1,6,1,1,0], // shoulders
  [1,6,1,6,6,6,6,1,6,1], // torso
  [1,6,1,6,6,6,6,1,6,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,0,1,6,1,1,6,1,0,0], // hips
  [0,0,1,6,1,1,6,1,0,0], // legs
  [0,0,1,1,1,1,1,1,0,0]
];

const BOY_SPRITE = [
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,2,2,2,2,2,2,1,1,1],
  [1,1,2,2,2,2,2,2,2,2,1,1],
  [0,1,2,2,1,2,2,1,2,2,1,0], // eyes
  [0,1,2,2,1,2,2,1,2,2,1,0],
  [0,0,1,2,2,2,2,2,2,1,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,3,3,3,3,3,3,1,0,0], // light blue shirt
  [0,1,3,3,3,3,3,3,3,3,1,0],
  [1,3,3,3,3,3,3,3,3,3,3,1],
  [1,2,3,3,3,3,3,3,3,3,2,1], // sleeves/hands
  [1,2,1,3,3,3,3,3,3,1,2,1],
  [0,1,0,4,4,4,4,4,4,0,1,0], // shorts
  [0,0,0,4,4,0,0,4,4,0,0,0],
  [0,0,0,2,2,0,0,2,2,0,0,0], // legs
  [0,0,4,4,4,0,0,4,4,4,0,0]  // shoes
];

const ALIEN_SPRITE = [
  [0,0,6,0,0,0,0,0,6,0,0],
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,0],
  [1,1,2,2,2,2,2,2,2,1,1],
  [1,2,2,2,2,2,2,2,2,2,1],
  [1,1,3,3,1,1,1,3,3,1,1], // cream eyes
  [1,1,3,4,1,1,1,3,4,1,1],
  [1,1,1,1,2,2,2,1,1,1,1],
  [1,5,1,1,1,1,1,1,1,5,1], // white fangs
  [0,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,0,1,0,1,0,1,0,0], // legs/tentacles
  [0,0,1,0,1,0,1,0,1,0,0]
];

interface Coin3D {
  gx: number;
  gy: number;
  gz: number;
  active: boolean;
  value: number;
}

const ITEMS = {
  SHIELD: {
    id: "shield",
    name: "Nano Shield",
    duration: 15000,
    price: 15
  }
};

const WEAPONS = {
  STANDARD: {
    id: "standard",
    name: "Standard Pistol",
    cooldown: 250,
    bulletSpeed: 0.15,
    damage: 1,
    color: "#fbbf24",
    price: 0
  },
  PLASMA: {
    id: "plasma",
    name: "Plasma Blaster",
    cooldown: 120, // Faster fire rate
    bulletSpeed: 0.25, // Fast bullets
    damage: 2,
    color: "#22d3ee", // Cyan energy
    price: 25
  }
};

const COIN_SPRITE = [
  [0,0,1,1,1,1,0,0],
  [0,1,2,2,2,2,1,0],
  [1,2,2,3,2,2,2,1],
  [1,2,3,3,3,2,2,1],
  [1,2,3,3,3,2,2,1],
  [1,2,2,3,2,2,2,1],
  [0,1,2,2,2,2,1,0],
  [0,0,1,1,1,1,0,0]
];

const BLASTER_SPRITE = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,3,3,3,3,2,1],
  [1,2,3,3,4,4,4,4,3,1],
  [1,2,3,3,4,4,4,4,3,1],
  [1,1,1,3,3,3,3,3,1,1],
  [0,0,1,2,2,2,1,0,0,0],
  [0,0,1,2,2,1,0,0,0,0]
];

export default function GameSandbox() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("ais_game_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [weaponType, setWeaponType] = useState<keyof typeof WEAPONS>("STANDARD");
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [activeEngineLogs, setActiveEngineLogs] = useState<string[]>([
    "Initializing Godot Engine Wasm compiler...",
    "Godot 3D sub-Viewport loaded successfully. Native GDScript bindings synchronized."
  ]);

  // Ref based lightweight simulation for full 60fps performance
  const internalState = useRef({
    // Grid coordinate variables
    player: {
      gx: 0.0,  // Grid x position (ranges -2 to 2)
      gy: 0.0,  // Grid y position (ranges -2 to 2)
      gz: 0.0,  // Height above ground (Z-axis in 3D)
      vz: 0.0,  // Gravity velocity along Z
      isJumping: false,
      size: 0.4, // Grid size representation
      facing: "right" as "left" | "right"
    },
    stars: [] as Star3D[],
    coinEntities: [] as Coin3D[],
    obstacles: [] as Obstacle3D[],
    bullets: [] as Bullet3D[],
    particles: [] as Particle3D[],
    keys: {} as Record<string, boolean>,
    frameId: 0,
    score: 0,
    coins: 0,
    lives: 3,
    isShielded: false,
    shieldExpire: 0,
    lastSpawnTime: 0,
    gameDifficulty: 1.0,
    lastShootTime: 0,
    weapon: WEAPONS.STANDARD
  });

  const synthesizeSound = (freq: number, type: OscillatorType, duration: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio permission muted
    }
  };

  const playSoundEffect = (action: "shoot" | "explosion" | "star" | "hit" | "jump" | "land" | "powerup" | "coin") => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      
      const playSimple = (freq: number, type: OscillatorType, duration: number, gainValue = 0.05) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(gainValue, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      };

      if (action === "shoot") {
        const weaponId = internalState.current.weapon.id;
        if (weaponId === "plasma") {
          playSimple(1200, "sawtooth", 0.05, 0.03);
        } else {
          playSimple(880, "sawtooth", 0.08, 0.04);
          setTimeout(() => playSimple(440, "sine", 0.08, 0.03), 40);
        }
      } else if (action === "explosion") {
        playSimple(180, "sawtooth", 0.25, 0.08);
        setTimeout(() => playSimple(90, "sawtooth", 0.2, 0.08), 50);
      } else if (action === "star") {
        playSimple(523.25, "sine", 0.1, 0.05); // C5
        setTimeout(() => playSimple(659.25, "sine", 0.12, 0.05), 80); // E5
        setTimeout(() => playSimple(784.00, "sine", 0.15, 0.05), 150); // G5
      } else if (action === "coin") {
        playSimple(987.77, "sine", 0.08, 0.04); // B5
        setTimeout(() => playSimple(1318.51, "sine", 0.1, 0.04), 50); // E6
      } else if (action === "hit") {
        playSimple(200, "triangle", 0.2, 0.08);
        setTimeout(() => playSimple(80, "sawtooth", 0.3, 0.08), 80);
      } else if (action === "jump") {
        playSimple(293.66, "sine", 0.12, 0.04); // D4
        setTimeout(() => playSimple(392.00, "sine", 0.15, 0.04), 60); // G4
      } else if (action === "land") {
        playSimple(120, "triangle", 0.12, 0.06);
      } else if (action === "powerup") {
        playSimple(440, "sine", 0.1, 0.04);
        setTimeout(() => playSimple(880, "sine", 0.12, 0.04), 100);
      }
    } catch (e) {
      // Permission block catch
    }
  };

  const drawPixelMecha = (ctx: CanvasRenderingContext2D, sx: number, sy: number) => {
    const sprite = MECHA_SPRITE;
    const pixelSize = 1.4;
    const startX = sx - (sprite[0].length * pixelSize) / 2;
    const startY = sy - (sprite.length * pixelSize);

    const palette: Record<number, string> = {
      0: "transparent",
      1: "#0f172a", // black outline
      5: "#ef4444", // red visor
      6: "#1e293b", // dark steel body
      7: "#334155"  // medium steel
    };

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const fillVal = sprite[r][c];
        if (fillVal !== 0) {
          ctx.fillStyle = palette[fillVal] || "#1e293b";
          ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const drawPixelBoy = (ctx: CanvasRenderingContext2D, sx: number, sy: number, facing: "left" | "right") => {
    const palette: Record<number, string> = {
      0: "transparent",
      1: "#000000", // outline
      2: "#feddc4", // peach skin
      3: "#bae6fd", // sky shirt
      4: "#2563eb", // blue shorts/shoes
    };

    const sprite = BOY_SPRITE;
    const pixelSize = 1.6; // Scale of pixel art boy on our isometric cells
    const startX = sx - (sprite[0].length * pixelSize) / 2;
    const startY = sy - (sprite.length * pixelSize) - 2;

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const colIndex = facing === "left" ? sprite[r].length - 1 - c : c;
        const fillVal = sprite[r][colIndex];
        if (fillVal !== 0) {
          ctx.fillStyle = palette[fillVal] || "transparent";
          ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Draw the active weapon
    const weaponId = internalState.current.weapon.id;
    if (weaponId === "plasma") {
      drawPixelBlaster(ctx, sx, sy, facing);
    } else {
      drawPixelGun(ctx, sx, sy, facing);
    }
  };

  const drawPixelBlaster = (ctx: CanvasRenderingContext2D, sx: number, sy: number, facing: "left" | "right") => {
    const palette: Record<number, string> = {
      0: "transparent",
      1: "#0f172a", // black outline
      2: "#64748b", // gray metal
      3: "#06b6d4", // cyan glow
      4: "#ffffff"  // white highlight
    };

    const sprite = BLASTER_SPRITE;
    const pixelSize = 1.4;
    const offsetX = facing === "right" ? 5 : -19;
    const offsetY = -15;
    const gunX = sx + offsetX;
    const gunY = sy + offsetY;

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const colIndex = facing === "left" ? sprite[r].length - 1 - c : c;
        const fillVal = sprite[r][colIndex];
        if (fillVal !== 0) {
          ctx.fillStyle = palette[fillVal] || "transparent";
          ctx.fillRect(gunX + c * pixelSize, gunY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const drawPixelGun = (ctx: CanvasRenderingContext2D, sx: number, sy: number, facing: "left" | "right") => {
    const gunSprite = [
      [1,1,1,1,1,1,1,1],
      [1,3,3,3,3,3,3,1],
      [1,2,2,2,2,2,2,1],
      [0,1,1,2,1,1,1,0],
      [0,0,1,2,2,1,0,0]
    ];

    const palette: Record<number, string> = {
      0: "transparent",
      1: "#0f172a", // black outline
      2: "#475569", // medium gray steel
      3: "#94a3b8"  // light slide
    };

    const pixelSize = 1.4;
    const offsetX = facing === "right" ? 5 : -17;
    const offsetY = -15;
    const gunX = sx + offsetX;
    const gunY = sy + offsetY;

    for (let r = 0; r < gunSprite.length; r++) {
      for (let c = 0; c < gunSprite[r].length; c++) {
        const colIndex = facing === "left" ? gunSprite[r].length - 1 - c : c;
        const fillVal = gunSprite[r][colIndex];
        if (fillVal !== 0) {
          ctx.fillStyle = palette[fillVal] || "transparent";
          ctx.fillRect(gunX + c * pixelSize, gunY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const drawPixelAlien = (ctx: CanvasRenderingContext2D, sx: number, sy: number) => {
    const sprite = ALIEN_SPRITE;
    const pixelSize = 1.6;
    const startX = sx - (sprite[0].length * pixelSize) / 2;
    const startY = sy - (sprite.length * pixelSize);

    const palette: Record<number, string> = {
      0: "transparent",
      1: "#0284c7", // Medium blue body
      2: "#38bdf8", // Light blue band
      3: "#ffecb3", // Cream eyes
      4: "#1e1b4b", // Dark pupil
      5: "#ffffff", // White teeth fangs
      6: "#f59e0b"  // Orange/yellow horns on top
    };

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const fillVal = sprite[r][c];
        if (fillVal !== 0) {
          ctx.fillStyle = palette[fillVal] || "transparent";
          ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const drawPixelCoin = (ctx: CanvasRenderingContext2D, sx: number, sy: number) => {
    const sprite = COIN_SPRITE;
    const pixelSize = 1.6;
    const startX = sx - (sprite[0].length * pixelSize) / 2;
    const startY = sy - (sprite.length * pixelSize);

    const palette: Record<number, string> = {
      0: "transparent",
      1: "#d97706", // Dark gold border
      2: "#fbbf24", // Bright gold
      3: "#ffffff"  // Shine
    };

    for (let r = 0; r < sprite.length; r++) {
      for (let c = 0; c < sprite[r].length; c++) {
        const fillVal = sprite[r][c];
        if (fillVal !== 0) {
          ctx.fillStyle = palette[fillVal] || "transparent";
          ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  };

  const handleShoot = () => {
    const state = internalState.current;
    if (!isPlaying || isGameOver) return;
    const now = Date.now();
    const weapon = state.weapon;
    
    if (now - state.lastShootTime > weapon.cooldown) {
      const vx = state.player.facing === "left" ? -weapon.bulletSpeed : weapon.bulletSpeed;
      const vy = 0.0;

      state.bullets.push({
        gx: state.player.gx,
        gy: state.player.gy,
        gz: state.player.gz + 0.15,
        vx,
        vy,
        active: true
      });

      state.lastShootTime = now;
      playSoundEffect("shoot");
      addLog(`[WEAPON]: fire_${weapon.id}() -> vector_${vx > 0 ? "RIGHT" : "LEFT"}`);
    }
  };

  const addLog = (msg: string) => {
    setActiveEngineLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  const add3DExplosion = (screenX: number, screenY: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      internalState.current.particles.push({
        sx: screenX,
        sy: screenY,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        color,
        size: Math.random() * 4 + 1.5,
        alpha: 1.0
      });
    }
  };

  // Convert 3D Isometric Coordinates (gx, gy, gz) to Screen X & Y
  const getIsoScreenPos = (gx: number, gy: number, gz: number, width: number, height: number) => {
    // Width represents isometric projection angle scale
    const isoScaleX = 42;
    const isoScaleY = 24;
    const centerX = width / 2;
    const centerY = height / 2 + 15; // Shift center down slightly for higher visual perspective

    const screenX = centerX + (gx - gy) * isoScaleX;
    const screenY = centerY + (gx + gy) * isoScaleY - (gz * 55);

    return { sx: screenX, sy: screenY };
  };

  // Draw an isometric 3D rectangular cuboid block
  const drawIsometricBlock = (
    ctx: CanvasRenderingContext2D,
    gx: number,
    gy: number,
    gz: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    topColor: string,
    leftColor: string,
    rightColor: string,
    canvasW: number,
    canvasH: number
  ) => {
    const isoScaleX = 42;
    const isoScaleY = 24;

    // Corner vertices in relative grid positions
    const getScreenPoint = (dx: number, dy: number, dz: number) => {
      return getIsoScreenPos(gx + dx, gy + dy, gz + dz, canvasW, canvasH);
    };

    // Screen projection points
    const p1 = getScreenPoint(0, 0, sizeZ);          // Top point (center)
    const p2 = getScreenPoint(sizeX, 0, sizeZ);      // Top right
    const p3 = getScreenPoint(sizeX, sizeY, sizeZ);  // Top bottom
    const p4 = getScreenPoint(0, sizeY, sizeZ);      // Top left

    const b1 = getScreenPoint(0, 0, 0);              // Bottom point (center)
    const b2 = getScreenPoint(sizeX, 0, 0);          // Bottom right
    const b3 = getScreenPoint(sizeX, sizeY, 0);      // Bottom bottom
    const b4 = getScreenPoint(0, sizeY, 0);          // Bottom left

    // 1. Draw Left Face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(p1.sx, p1.sy);
    ctx.lineTo(p4.sx, p4.sy);
    ctx.lineTo(b4.sx, b4.sy);
    ctx.lineTo(b1.sx, b1.sy);
    ctx.closePath();
    ctx.fill();

    // 2. Draw Right Face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(p4.sx, p4.sy);
    ctx.lineTo(p3.sx, p3.sy);
    ctx.lineTo(b3.sx, b3.sy);
    ctx.lineTo(b4.sx, b4.sy);
    ctx.closePath();
    ctx.fill();

    // 3. Draw Top Face
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(p1.sx, p1.sy);
    ctx.lineTo(p2.sx, p2.sy);
    ctx.lineTo(p3.sx, p3.sy);
    ctx.lineTo(p4.sx, p4.sy);
    ctx.closePath();
    ctx.fill();
  };

  const handleJump = () => {
    const state = internalState.current;
    if (!state.player.isJumping && isPlaying && !isGameOver) {
      state.player.vz = 0.16; // Upward velocity multiplier
      state.player.isJumping = true;
      playSoundEffect("jump");
      addLog("[GDScript]: func apply_impulse(Vector3.UP * JUMP_FORCE)");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Up", "Down", "Left", "Right", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", " "].includes(e.key)) {
        e.preventDefault();
      }
      internalState.current.keys[e.key] = true;

      if (e.key === " " || e.key === "Spacebar") {
        handleJump();
      }

      if (e.key === "f" || e.key === "F" || e.key === "Enter" || e.key === "x" || e.key === "X") {
        handleShoot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      internalState.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(internalState.current.frameId);
    };
  }, [isPlaying, isGameOver]);

  const updateGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = internalState.current;
    const w = canvas.width;
    const h = canvas.height;

    // Beautiful space background representing Godot 3D Skybox context
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // Render cyber background blueprint lines
    ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }

    // 1. Draw Grid Base Columns in Isometric perspective (-3 to 3 grid)
    for (let gx = -2; gx <= 2; gx++) {
      for (let gy = -2; gy <= 2; gy++) {
        const isAlt = (gx + gy) % 2 === 0;
        const topHex = isAlt ? "#1e1e38" : "#111827";
        const leftHex = isAlt ? "#101026" : "#0f0f1c";
        const rightHex = isAlt ? "#0a0a18" : "#080812";

        drawIsometricBlock(
          ctx,
          gx,
          gy,
          -0.5,
          0.8,
          0.8,
          0.5,
          topHex,
          leftHex,
          rightHex,
          w,
          h
        );
      }
    }

    // 2. Spawn and update Stars, Coins & Bugs
    const difficultyMultiplier = difficulty === "Easy" ? 0.7 : difficulty === "Hard" ? 1.5 : 1.0;
    const now = Date.now();
    const spawnRate = 3000 / difficultyMultiplier;

    // Update Shield State
    if (state.isShielded) {
      if (now > state.shieldExpire) {
        state.isShielded = false;
        setIsShieldActive(false);
        setShieldTimeLeft(0);
        addLog("[SYSTEM]: shield_expired() -> defenses_online(FALSE)");
      } else {
        setShieldTimeLeft(Math.ceil((state.shieldExpire - now) / 1000));
      }
    }

    if (now - state.lastSpawnTime > spawnRate) {
      // Spawn star
      if (state.stars.filter(s => s.active).length < 2) {
        state.stars.push({
          gx: (Math.floor(Math.random() * 5) - 2),
          gy: (Math.floor(Math.random() * 5) - 2),
          gz: 0.1,
          active: true,
          value: 15
        });
      }

      // Spawn coins
      if (state.coinEntities.length < 4) {
        state.coinEntities.push({
          gx: (Math.floor(Math.random() * 5) - 2),
          gy: (Math.floor(Math.random() * 5) - 2),
          gz: 0.1,
          active: true,
          value: 5
        });
      }

      // Spawn bug obstacles
      if (state.obstacles.length < Math.floor(3 * difficultyMultiplier)) {
        const isMecha = Math.random() > 0.7; // 30% chance for mecha
        state.obstacles.push({
          gx: -2.0,
          gy: (Math.floor(Math.random() * 5) - 2),
          gz: 0.0,
          speed: (0.02 + Math.random() * 0.03) * (isMecha ? 1.4 : 1.0) * difficultyMultiplier,
          width: 0.3,
          direction: 1,
          color: isMecha ? "#334155" : "#f43f5e",
          type: isMecha ? "mecha" : "bug"
        });
      }

      state.lastSpawnTime = now;
    }

    // 3. Handle Player Movement controls inside Isometric plane limits (-2.0 to 2.0)
    const keys = state.keys;
    const moveSpeed = 0.045;

    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
      state.player.gx = Math.max(-2.2, state.player.gx - moveSpeed);
      state.player.facing = "left";
    }
    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
      state.player.gx = Math.min(2.2, state.player.gx + moveSpeed);
      state.player.facing = "right";
    }
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
      state.player.gy = Math.max(-2.2, state.player.gy - moveSpeed);
    }
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
      state.player.gy = Math.min(2.2, state.player.gy + moveSpeed);
    }

    // 4. Height Physics (Gravity simulation for jumping 3D Cube)
    if (state.player.isJumping) {
      state.player.vz -= 0.012; // Gravity coefficient
      state.player.gz += state.player.vz;

      if (state.player.gz <= 0) {
        state.player.gz = 0;
        state.player.vz = 0;
        state.player.isJumping = false;
        playSoundEffect("land"); // Landing thud
      }
    }

    // 5. Draw Obstacles (Code bugs / Pixel Alien Invaders) sliding diagonally
    state.obstacles.forEach((obs, idx) => {
      obs.gx += obs.speed * obs.direction;

      if (obs.gx > 2.5) {
        state.obstacles.splice(idx, 1);
      } else {
        const obsScreen = getIsoScreenPos(obs.gx, obs.gy, obs.gz, w, h);

        // Draw obstacle base shadow
        const obsShadow = getIsoScreenPos(obs.gx, obs.gy, 0, w, h);
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.ellipse(obsShadow.sx, obsShadow.sy + 2, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw correct enemy type
        if (obs.type === "mecha") {
          drawPixelMecha(ctx, obsScreen.sx, obsScreen.sy);
        } else {
          drawPixelAlien(ctx, obsScreen.sx, obsScreen.sy);
        }

        // Check 3D bounding collision with player (Isometric grid proximity)
        const dx = Math.abs(state.player.gx - obs.gx);
        const dy = Math.abs(state.player.gy - obs.gy);
        const dz = Math.abs(state.player.gz - obs.gz);

        if (dx < 0.4 && dy < 0.4 && dz < 0.4) {
          state.obstacles.splice(idx, 1);
          const pScreen = getIsoScreenPos(state.player.gx, state.player.gy, state.player.gz, w, h);
          
          if (state.isShielded) {
             add3DExplosion(pScreen.sx, pScreen.sy, "#22d3ee", 20); // Shield impact color (cyan)
             playSoundEffect("explosion");
             addLog("[SYSTEM]: shield_bounce() -> Enemy neutralized by energy barrier.");
             state.score += 10;
             setScore(state.score);
          } else {
            add3DExplosion(pScreen.sx, pScreen.sy, "#0284c7", 18); // alien explode color (blue)
            state.lives -= 1;
            setLives(state.lives);
            playSoundEffect("hit");
            addLog("[WARNING]: Node collision debug: Memory Leak bug intercepted (-1 LIFE)");

            if (state.lives <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              addLog("[FATAL CORE]: Server overflow. Godot 3D viewport crashed.");
              if (state.score > highScore) {
                setHighScore(state.score);
                localStorage.setItem("ais_game_highscore", state.score.toString());
              }
            }
          }
        }
      }
    });

    // 6. Draw Collectable Stars (GDScript files / Source core nodes)
    state.stars.forEach((star, idx) => {
      if (star.active) {
        // Floating hover effect on Z axis over time
        const hoverOffset = Math.sin(Date.now() * 0.006) * 0.08;
        const currentZ = star.gz + hoverOffset;

        // Render 3D emerald star
        drawIsometricBlock(
          ctx,
          star.gx,
          star.gy,
          currentZ,
          0.2, // Small isometric prism
          0.2,
          0.3,
          "#2dd4bf", // Bright green
          "#0d9488",
          "#115e59",
          w,
          h
        );

        // Grid Collision check
        const dx = Math.abs(state.player.gx - star.gx);
        const dy = Math.abs(state.player.gy - star.gy);
        const dz = Math.abs(state.player.gz - currentZ);

        if (dx < 0.4 && dy < 0.4 && dz < 0.5) {
          star.active = false;
          state.stars.splice(idx, 1);
          const pScreen = getIsoScreenPos(star.gx, star.gy, currentZ, w, h);
          add3DExplosion(pScreen.sx, pScreen.sy, "#2dd4bf", 15);
          state.score += star.value;
          setScore(state.score);
          playSoundEffect("star");
          addLog(`[GDScript]: func _on_Star_collected() -> compiled node +${star.value}`);
        }
      }
    });

    // 6.5 Draw Collectable Coins
    state.coinEntities.forEach((coin, idx) => {
      if (coin.active) {
        const hoverOffset = Math.sin(Date.now() * 0.008) * 0.1;
        const currentZ = coin.gz + hoverOffset;
        const coinPos = getIsoScreenPos(coin.gx, coin.gy, currentZ, w, h);

        drawPixelCoin(ctx, coinPos.sx, coinPos.sy);

        const dx = Math.abs(state.player.gx - coin.gx);
        const dy = Math.abs(state.player.gy - coin.gy);
        const dz = Math.abs(state.player.gz - currentZ);

        if (dx < 0.4 && dy < 0.4 && dz < 0.5) {
          coin.active = false;
          state.coinEntities.splice(idx, 1);
          state.coins += coin.value;
          setCoins(state.coins);
          playSoundEffect("coin");
          addLog(`[SYSTEM]: coin_acquired() -> economy balance +${coin.value}`);
        }
      }
    });

    // 7. Draw Jumping Player 3D Character (The Pixel Art Character holding a Gun)
    // Draw player base shadow on track floor
    const shadowPos = getIsoScreenPos(state.player.gx, state.player.gy, 0, w, h);
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(shadowPos.sx, shadowPos.sy + 4, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Active screen coordinates for status floating telemetry
    const screenPlayer = getIsoScreenPos(state.player.gx, state.player.gy, state.player.gz, w, h);

    // Draw Shield Effect
    if (state.isShielded) {
      const shieldPulse = Math.sin(Date.now() * 0.01) * 3;
      const gradient = ctx.createRadialGradient(screenPlayer.sx, screenPlayer.sy - 15, 5, screenPlayer.sx, screenPlayer.sy - 15, 30 + shieldPulse);
      gradient.addColorStop(0, "rgba(34, 211, 238, 0.0)");
      gradient.addColorStop(0.7, "rgba(34, 211, 238, 0.2)");
      gradient.addColorStop(1, "rgba(34, 211, 238, 0.0)");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(screenPlayer.sx, screenPlayer.sy - 15, 30 + shieldPulse, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw the pixel art boy character holding the gun
    drawPixelBoy(ctx, screenPlayer.sx, screenPlayer.sy, state.player.facing);

    // Render little tech rings or wings
    ctx.strokeStyle = "rgba(45, 212, 191, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(screenPlayer.sx, screenPlayer.sy + 3, 10, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 7.5 Update and Draw 3D Bullets
    state.bullets.forEach((bullet, bIdx) => {
      bullet.gx += bullet.vx;
      bullet.gy += bullet.vy;

      if (Math.abs(bullet.gx) > 2.8 || Math.abs(bullet.gy) > 2.8) {
        state.bullets.splice(bIdx, 1);
      } else {
        const bPos = getIsoScreenPos(bullet.gx, bullet.gy, bullet.gz, w, h);
        
        ctx.fillStyle = "#fbbf24"; // Neon gold bullet
        ctx.beginPath();
        ctx.arc(bPos.sx, bPos.sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Motion blur bullet trail
        ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bPos.sx - (bullet.vx * 30), bPos.sy);
        ctx.lineTo(bPos.sx, bPos.sy);
        ctx.stroke();

        // Check bullet collision with alien obstacles
        state.obstacles.forEach((obs, oIdx) => {
          const dx = Math.abs(bullet.gx - obs.gx);
          const dy = Math.abs(bullet.gy - obs.gy);
          const dz = Math.abs(bullet.gz - obs.gz);

          if (dx < 0.4 && dy < 0.4 && dz < 0.6) {
            state.bullets.splice(bIdx, 1);
            state.obstacles.splice(oIdx, 1);
            
            const obsScreen = getIsoScreenPos(obs.gx, obs.gy, obs.gz, w, h);
            add3DExplosion(obsScreen.sx, obsScreen.sy, "#0284c7", 18); // alien blue explosion splash
            
            state.score += 25;
            setScore(state.score);
            
            // Sometimes drops a coin when enemy dies
            if (Math.random() > 0.6) {
              state.coinEntities.push({
                gx: obs.gx,
                gy: obs.gy,
                gz: 0.1,
                active: true,
                value: 10
              });
            }

            playSoundEffect("explosion");
            addLog("[SYSTEM]: func destroy_enemy() -> Alien target eliminated (+25 PTS)");
          }
        });
      }
    });

    // 8. Particle systems for sparkles
    state.particles.forEach((p, idx) => {
      p.sx += p.vx;
      p.sy += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        state.particles.splice(idx, 1);
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1.0;

    // HUD Telemetry overlay directly inside canvas corners
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fillText(`X_COOR: ${state.player.gx.toFixed(2)}`, 15, h - 35);
    ctx.fillText(`Y_COOR: ${state.player.gy.toFixed(2)}`, 15, h - 22);
    ctx.fillText(`Z_COOR: ${state.player.gz.toFixed(2)}`, 15, h - 9);

    ctx.textAlign = "right";
    ctx.fillText("GODOT_3D_VIEWPORT: ACTIVE", w - 15, h - 9);
    ctx.textAlign = "left";

    // Request animation iteration
    if (isPlaying && !isGameOver) {
      state.frameId = requestAnimationFrame(updateGame);
    }
  };

  const handleStartGame = () => {
    const state = internalState.current;
    state.player = {
      gx: 0.0,
      gy: 0.0,
      gz: 0.0,
      vz: 0.0,
      isJumping: false,
      size: 0.4,
      facing: "right"
    };
    state.stars = [
      { gx: -1.0, gy: 1.0, gz: 0.1, active: true, value: 15 },
      { gx: 1.0, gy: -1.0, gz: 0.1, active: true, value: 15 }
    ];
    state.coinEntities = [];
    state.obstacles = [];
    state.bullets = [];
    state.particles = [];
    state.score = 0;
    state.lives = 3;

    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsPlaying(true);
    addLog("[SYSTEM]: Booting Aaliyan's Isometric Godot template...");
    playSoundEffect("powerup");
  };

  const buyWeapon = (type: keyof typeof WEAPONS) => {
    const weapon = WEAPONS[type];
    if (coins >= weapon.price && weaponType !== type) {
      setCoins(prev => prev - weapon.price);
      internalState.current.coins -= weapon.price;
      setWeaponType(type);
      internalState.current.weapon = weapon;
      playSoundEffect("powerup");
      addLog(`[SYSTEM]: Weapon upgraded to ${weapon.name}`);
      setIsShopOpen(false);
    }
  };

  const buyItem = (type: keyof typeof ITEMS) => {
    const item = ITEMS[type];
    if (coins >= item.price) {
      setCoins(prev => prev - item.price);
      internalState.current.coins -= item.price;
      
      if (item.id === "shield") {
        internalState.current.isShielded = true;
        internalState.current.shieldExpire = Date.now() + item.duration;
        setIsShieldActive(true);
        setShieldTimeLeft(Math.ceil(item.duration / 1000));
        playSoundEffect("powerup");
        addLog(`[SYSTEM]: ${item.name} activated for 15 seconds.`);
      }
      
      setIsShopOpen(false);
    }
  };

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      internalState.current.frameId = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(internalState.current.frameId);
  }, [isPlaying, isGameOver]);

  return (
    <div className="glass-panel relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl md:col-span-2">
      <div className="absolute top-0 left-0 h-[2.5px] w-full bg-gradient-to-r from-violet-500 via-emerald-500 to-indigo-500 opacity-90" />
      
      {/* Shop Overlay */}
      <AnimatePresence>
        {isShopOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
            >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-orbitron font-bold text-lg text-slate-100 flex items-center gap-2">
                <Swords className="h-5 w-5 text-indigo-400" /> ARMORY SHOP
              </h3>
              <div className="flex items-center gap-2 text-yellow-400 font-mono text-sm">
                <span>{coins} COINS</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Weapons</p>
                <div className="space-y-2">
                  {Object.entries(WEAPONS).map(([key, w]) => (
                    <div 
                      key={key} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        weaponType === key ? "border-indigo-500 bg-indigo-500/10" : "border-slate-800 bg-slate-900/40 hover:bg-slate-900"
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">{w.name}</h4>
                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter">
                          CD: {w.cooldown}ms | SPD: {w.bulletSpeed}
                        </p>
                      </div>
                      <button
                        onClick={() => buyWeapon(key as keyof typeof WEAPONS)}
                        disabled={coins < w.price || weaponType === key}
                        className={`px-3 py-1 rounded-lg font-orbitron text-[9px] font-bold transition-all ${
                          weaponType === key 
                            ? "bg-emerald-600 text-white cursor-default" 
                            : coins >= w.price 
                              ? "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95" 
                              : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {weaponType === key ? "EQUIPPED" : `${w.price} COINS`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Support Items</p>
                <div className="space-y-2">
                  {Object.entries(ITEMS).map(([key, item]) => (
                    <div 
                      key={key} 
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 transition-all text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-200">{item.name}</h4>
                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter">
                          Provides {item.duration/1000}s invincibility
                        </p>
                      </div>
                      <button
                        onClick={() => buyItem(key as keyof typeof ITEMS)}
                        disabled={coins < item.price || (item.id === "shield" && isShieldActive)}
                        className={`px-3 py-1 rounded-lg font-orbitron text-[9px] font-bold transition-all ${
                          (item.id === "shield" && isShieldActive)
                            ? "bg-emerald-600/50 text-emerald-200 cursor-default"
                            : coins >= item.price 
                              ? "bg-slate-200 text-slate-950 hover:bg-white active:scale-95" 
                              : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                         {item.id === "shield" && isShieldActive ? "ACTIVE" : `${item.price} COINS`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsShopOpen(false)}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 font-bold text-xs hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              Back to Viewport
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Settings Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl"
            >
            <h3 className="font-orbitron font-bold text-lg text-slate-100 flex items-center gap-2 mb-6">
              <Compass className="h-5 w-5 text-indigo-400" /> SYSTEM CONFIG
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty Matrix</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Easy", "Medium", "Hard"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-2 rounded-lg border font-mono text-[10px] font-bold transition-all ${
                        difficulty === level 
                          ? "bg-indigo-600 border-indigo-400 text-white" 
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">Acoustics Feedback</h4>
                  <p className="text-[10px] text-slate-500">Toggle sound effects</p>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all ${soundEnabled ? "bg-emerald-600" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${soundEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="mt-8 w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 font-bold text-xs hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              Update Settings
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Dynamic HUD header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-950/80 px-2 py-0.5 font-mono text-[9px] font-bold text-indigo-400 border border-indigo-500/20">
              GODOT ENGINE WEB BUILD
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h3 className="font-orbitron text-lg font-bold tracking-wider text-slate-200 mt-1 uppercase">
            2.5D Firing Game
          </h3>
          <p className="font-sans text-[11px] text-slate-400">
            Play this emulated isometric shooter representing physical vector loops written in C# & GDScript
          </p>
        </div>

        {/* Live HUD statistics */}
        <div className="flex flex-wrap gap-2.5 font-mono text-xs">
          <div className="flex items-center gap-1.5 rounded bg-slate-900 border border-slate-800 px-3 py-1">
            <Award className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-500">HI-SCORE:</span>
            <span className="text-indigo-400 font-bold">{highScore}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded bg-slate-900 border border-slate-800 px-3 py-1">
            < Award className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-slate-500">COINS:</span>
            <span className="text-yellow-400 font-bold">{coins}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded bg-slate-900 border border-slate-800 px-3 py-1">
            <Swords className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-500">NODES:</span>
            <span className="text-emerald-400 font-bold">{score}</span>
          </div>

          <AnimatePresence>
            {isShieldActive && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 rounded bg-cyan-950/60 border border-cyan-800 px-3 py-1"
              >
                <Shield className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold uppercase text-[10px]">Shield: {shieldTimeLeft}s</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShopOpen(true)}
              className="flex items-center gap-1.5 rounded bg-slate-900 border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-indigo-400" /> Shop
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded bg-slate-900 border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-indigo-400" /> Config
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Real time engine logger logs representing actual compiler steps */}
        <div className="flex flex-col gap-3 rounded-xl bg-slate-950/60 p-4 border border-slate-900 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-wider text-indigo-400 uppercase flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 animate-bounce" /> Godot Engine Log
            </span>
            <span className="font-mono text-[9px] text-emerald-500">60FPS</span>
          </div>

          <div className="h-44 overflow-y-auto space-y-1.5 rounded bg-black/60 p-3 font-mono text-[9px] leading-relaxed text-indigo-400 border border-slate-900">
            {activeEngineLogs.map((log, idx) => (
              <div key={idx} className="flex gap-1">
                <span className="text-slate-600">&gt;</span>
                <span className={idx === 0 ? "text-indigo-300 font-bold animate-pulse" : "opacity-80"}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 space-y-2 text-xs text-slate-400 font-sans leading-relaxed">
            <p className="font-semibold text-slate-300">Aaliyan's 3D Physics Loop:</p>
            <p>
              "I emulate coordinate matrices in React canvas using isometric projection conversion equations. GDScript-based platforming translates to lightweight, highly scaled responsive loops."
            </p>
          </div>
        </div>

        {/* Center column: Beautiful Canvas game frame */}
        <div className="relative flex flex-col items-center justify-center lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-inner w-full max-w-[360px]">
            {(!isPlaying || isGameOver) && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 p-6 text-center backdrop-blur-sm">
                <Compass className="h-10 w-10 text-indigo-400 animate-spin mb-2" />
                <h4 className="font-orbitron text-[16px] font-bold tracking-widest text-slate-200 uppercase">
                  {isGameOver ? "GDScript Core Crash" : "Emulate Isometric 3D Build"}
                </h4>
                <p className="my-2 max-w-xs font-sans text-[11px] text-slate-400">
                  {isGameOver
                    ? `Build failed with minor overflows. Final score: ${score} Compiled Nodes. Restart to re-stabilize.`
                    : "Experience a fully responsive pseudo-3D platform game engine made by SkipScape. Steer along the floating cube platform grid & leap bugs!"}
                </p>
                <button
                  id="btn_play_isometric"
                  onClick={handleStartGame}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-orbitron text-xs font-bold tracking-wider text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  {isGameOver ? "RE-BOOT COMPILER" : "STABILIZE & LAUNCH"}
                </button>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={350}
              height={330}
              className="rounded bg-slate-950 border border-slate-900 block shadow-inner h-[330px] w-full max-w-[350px]"
            />
          </div>

          {/* Tactical touch panel for responsive developers */}
          <div className="mt-4 flex w-full max-w-[350px] items-center justify-between gap-4 px-1.5">
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button
                id="btn_move_up"
                onMouseDown={() => { internalState.current.keys["ArrowUp"] = true; }}
                onMouseUp={() => { internalState.current.keys["ArrowUp"] = false; }}
                onTouchStart={() => { internalState.current.keys["ArrowUp"] = true; }}
                onTouchEnd={() => { internalState.current.keys["ArrowUp"] = false; }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 active:bg-indigo-500 active:text-slate-950 text-xs cursor-pointer select-none"
              >
                ▲
              </button>
              <div />

              <button
                id="btn_move_left"
                onMouseDown={() => { internalState.current.keys["ArrowLeft"] = true; }}
                onMouseUp={() => { internalState.current.keys["ArrowLeft"] = false; }}
                onTouchStart={() => { internalState.current.keys["ArrowLeft"] = true; }}
                onTouchEnd={() => { internalState.current.keys["ArrowLeft"] = false; }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 active:bg-indigo-500 active:text-slate-950 text-xs cursor-pointer select-none"
              >
                ◀
              </button>
              <button
                id="btn_move_down"
                onMouseDown={() => { internalState.current.keys["ArrowDown"] = true; }}
                onMouseUp={() => { internalState.current.keys["ArrowDown"] = false; }}
                onTouchStart={() => { internalState.current.keys["ArrowDown"] = true; }}
                onTouchEnd={() => { internalState.current.keys["ArrowDown"] = false; }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 active:bg-indigo-500 active:text-slate-950 text-xs cursor-pointer select-none"
              >
                ▼
              </button>
              <button
                id="btn_move_right"
                onMouseDown={() => { internalState.current.keys["ArrowRight"] = true; }}
                onMouseUp={() => { internalState.current.keys["ArrowRight"] = false; }}
                onTouchStart={() => { internalState.current.keys["ArrowRight"] = true; }}
                onTouchEnd={() => { internalState.current.keys["ArrowRight"] = false; }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 active:bg-indigo-500 active:text-slate-950 text-xs cursor-pointer select-none"
              >
                ▶
              </button>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[110px]">
              <button
                id="btn_shoot_action"
                onClick={handleShoot}
                className="active:scale-95 flex h-8 px-3 items-center justify-center gap-1.5 rounded-lg border border-rose-950 bg-rose-950/60 font-orbitron text-[10px] text-rose-300 font-bold active:bg-rose-500 active:text-slate-950 transition-all cursor-pointer select-none uppercase tracking-wide"
              >
                <Swords className="h-3 w-3 text-rose-400" /> Shoot [F]
              </button>

              <button
                id="btn_jump_action"
                onClick={handleJump}
                className="active:scale-95 flex h-8 px-3 items-center justify-center gap-1.5 rounded-lg border border-teal-900 bg-teal-950/60 font-orbitron text-[10px] text-teal-300 font-bold active:bg-teal-500 active:text-slate-950 transition-all cursor-pointer select-none uppercase tracking-wide"
              >
                <Zap className="h-3 w-3 text-teal-400" /> Leap [Space]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
