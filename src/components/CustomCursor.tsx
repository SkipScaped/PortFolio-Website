import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const outline = outlineRef.current;
    if (!cursor || !outline) return;

    // Set initial scales
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(outline, { xPercent: -50, yPercent: -50 });

    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.05, ease: "none" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.05, ease: "none" });
    
    const xToOutline = gsap.quickTo(outline, "x", { duration: 0.4, ease: "power3" });
    const yToOutline = gsap.quickTo(outline, "y", { duration: 0.4, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToOutline(e.clientX);
      yToOutline(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer');

      if (isInteractive) {
        gsap.to(cursor, { scale: 3, duration: 0.3, ease: "power3" });
        gsap.to(outline, { scale: 1.5, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.6)", duration: 0.3 });
      } else {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power3" });
        gsap.to(outline, { scale: 1, backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.3)", duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={outlineRef} className="custom-cursor-outline" />
    </>
  );
}
