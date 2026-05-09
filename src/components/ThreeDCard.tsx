import React, { useState, useRef, MouseEvent } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function ThreeDCard({ children, className = "", id }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside the card
    const y = e.clientY - rect.top; // y position inside the card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Scale down the rotation so it is subtle and beautiful (max rotate 10 degrees)
    const rotateYVal = ((x - centerX) / centerX) * 12; // horizontal tilt
    const rotateXVal = -((y - centerY) / centerY) * 12; // vertical tilt

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
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
      className={`perspective-container relative select-none transition-all duration-200 ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        {children}
      </div>
    </div>
  );
}
