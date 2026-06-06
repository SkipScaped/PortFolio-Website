import React, { useEffect, useState } from "react";
import { Music, VolumeX, Volume2 } from "lucide-react";

interface HiddenYouTubeAudioProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

export default function HiddenYouTubeAudio({ isPlaying, setIsPlaying }: HiddenYouTubeAudioProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Monitor first click interaction to assist auto-play on browser policy guidelines
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      // Try to ensure playing is initiated
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  return (
    <>
      {/* 📻 COMPLETELY HIDDEN AND OFFSCREEN YOUTUBE IFRAME */}
      {isPlaying && (
        <div className="fixed -top-99 -left-99 w-1 h-1 overflow-hidden opacity-0 pointer-events-none invisible">
          <iframe
            src={`https://www.youtube.com/embed/hLuhfSP8Odc?autoplay=1&loop=1&playlist=hLuhfSP8Odc&mute=0&controls=0&enablejsapi=1`}
            title="Ambient Music Stream"
            allow="autoplay; encrypted-media"
            className="w-1 h-1"
          />
        </div>
      )}

      {/* 🎵 FLOATING GLASS FLOATING MUSIC RADIAL WAVES INDICATOR */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3.5 px-1 bg-white/10 dark:bg-black/20 rounded-md backdrop-blur-md py-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
                className="w-[2px] bg-gradient-to-t from-teal-400 to-indigo-500 rounded-t animate-music-bar shrink-0"
              />
            ))}
          </div>
        )}
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono text-[10px] font-bold tracking-widest transition-all duration-300 shadow-lg cursor-pointer backdrop-blur-md
            ${isPlaying 
              ? "bg-indigo-600/20 dark:bg-teal-500/10 text-indigo-500 dark:text-teal-400 border-indigo-500/20 dark:border-teal-500/30 shadow-indigo-500/10" 
              : "bg-white/80 dark:bg-slate-950/80 text-slate-500 border-slate-200 dark:border-slate-800"}`}
          title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        >
          {isPlaying ? <Volume2 className="h-4 w-4 text-emerald-500 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
          <span className="uppercase text-[9px]">
            {isPlaying ? "Ambient Sound: ON" : "Ambient Sound: OFF"}
          </span>
        </button>
      </div>
    </>
  );
}
