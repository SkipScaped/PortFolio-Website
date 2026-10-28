import React, { useState, useRef, MouseEvent, TouchEvent, useEffect } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glowColor?: "cyan" | "indigo" | "emerald" | "amber" | "rose" | "purple";
  intensity?: number; // Tilt intensity multiplier (default: 1.0)
  onClick?: () => void;
}

interface ThreeDCardItemProps {
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string; // Depth in px or CSS string (e.g., 20, "40px")
  rotateX?: number;
  rotateY?: number;
  as?: React.ElementType;
}

export function ThreeDCardItem({
  children,
  className = "",
  translateZ = 20,
  rotateX = 0,
  rotateY = 0,
  as: Component = "div",
}: ThreeDCardItemProps) {
  const zVal = typeof translateZ === "number" ? `${translateZ}px` : translateZ;
  return (
    <Component
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: `translateZ(${zVal}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </Component>
  );
}

export default function ThreeDCard({ 
  children, 
  className = "", 
  id,
  glowColor = "cyan",
  intensity = 1.0,
  onClick
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const glowStyles = {
    cyan: {
      border: "rgba(34, 211, 238, 0.4)",
      sheen: "from-teal-400/25 via-cyan-500/15 to-transparent",
      spotlight: "rgba(34, 211, 238, 0.25)"
    },
    indigo: {
      border: "rgba(99, 102, 241, 0.4)",
      sheen: "from-indigo-500/25 via-purple-500/15 to-transparent",
      spotlight: "rgba(99, 102, 241, 0.25)"
    },
    emerald: {
      border: "rgba(16, 185, 129, 0.4)",
      sheen: "from-emerald-400/25 via-teal-500/15 to-transparent",
      spotlight: "rgba(16, 185, 129, 0.25)"
    },
    amber: {
      border: "rgba(245, 158, 11, 0.4)",
      sheen: "from-amber-400/25 via-orange-500/15 to-transparent",
      spotlight: "rgba(245, 158, 11, 0.25)"
    },
    rose: {
      border: "rgba(244, 63, 94, 0.4)",
      sheen: "from-rose-400/25 via-pink-500/15 to-transparent",
      spotlight: "rgba(244, 63, 94, 0.25)"
    },
    purple: {
      border: "rgba(168, 85, 247, 0.4)",
      sheen: "from-purple-400/25 via-indigo-500/15 to-transparent",
      spotlight: "rgba(168, 85, 247, 0.25)"
    },
  };

  const currentGlow = glowStyles[glowColor];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Responsive, physical 3D tilt calculation with intensity control
    const maxAngle = 14 * intensity;
    const rotateYVal = ((x - centerX) / centerX) * maxAngle;
    const rotateXVal = -((y - centerY) / centerY) * maxAngle;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);

    // Specular glare coordinates in percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 1 });
    setSpotlightPos({ x: glareX, y: glareY });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxAngle = 10 * intensity;
    const rotateYVal = ((x - centerX) / centerX) * maxAngle;
    const rotateXVal = -((y - centerY) / centerY) * maxAngle;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setIsHovered(true);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.8 });
    setSpotlightPos({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className={`perspective-container relative group rounded-3xl transition-transform duration-200 ease-out select-none ${className}`}
      style={{
        perspective: "1100px",
        transform: isHovered 
          ? `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.018, 1.018, 1.018)` 
          : "perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 🌊 DYNAMIC CURSOR-TRACKED BORDER SPOTLIGHT */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
        style={{
          background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, ${currentGlow.spotlight}, transparent 60%)`,
        }}
      />

      {/* 🌊 PRISMATIC LIQUID GLARE REFLECTION */}
      <div 
        className="pointer-events-none absolute inset-0 z-30 rounded-3xl transition-opacity duration-300 mix-blend-overlay overflow-hidden"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4), transparent 75%)`,
        }}
      />

      {/* 💎 PRISMATIC LIQUID RIM SHEEN */}
      <div 
        className={`pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-br ${currentGlow.sheen} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20 blur-sm`}
      />

      {/* 3D Depth Card Body with Z-Parallax Space */}
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="h-full w-full rounded-3xl"
      >
        {children}
      </div>
    </div>
  );
}
