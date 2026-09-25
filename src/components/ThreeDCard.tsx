import React, { useState, useRef, MouseEvent } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  glowColor?: "cyan" | "indigo" | "emerald" | "amber" | "rose" | "purple";
}

export default function ThreeDCard({ 
  children, 
  className = "", 
  id,
  glowColor = "cyan"
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: "from-teal-400/20 via-cyan-500/10 to-transparent",
    indigo: "from-indigo-500/20 via-purple-500/10 to-transparent",
    emerald: "from-emerald-400/20 via-teal-500/10 to-transparent",
    amber: "from-amber-400/20 via-orange-500/10 to-transparent",
    rose: "from-rose-400/20 via-pink-500/10 to-transparent",
    purple: "from-purple-400/20 via-indigo-500/10 to-transparent",
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt
    const rotateYVal = ((x - centerX) / centerX) * 12;
    const rotateXVal = -((y - centerY) / centerY) * 12;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);

    // Specular glare coordinates in percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 1 });
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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-container relative group rounded-2xl transition-all duration-300 ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)` 
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 🌊 DYNAMIC LIQUID SPECULAR GLARE REFLECTION */}
      <div 
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl transition-opacity duration-300 mix-blend-overlay"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45), transparent 75%)`,
        }}
      />

      {/* 💎 PRISMATIC LIQUID RIM SHEEN */}
      <div 
        className={`pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${glowStyles[glowColor]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm`}
      />

      {/* 3D Depth Card Body */}
      <div 
        style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
        className="h-full w-full rounded-2xl"
      >
        {children}
      </div>
    </div>
  );
}
