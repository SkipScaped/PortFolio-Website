import React, { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Volume1, Sparkles, Disc3, Play, Pause, ChevronUp, ChevronDown, Sliders } from "lucide-react";

interface HiddenYouTubeAudioProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

export default function HiddenYouTubeAudio({ isPlaying, setIsPlaying }: HiddenYouTubeAudioProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState<number>(30); // 0 to 100, default low volume
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Auto-hide welcome toast after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Monitor first click/touch to unlock browser autoplay policy immediately
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (!isPlaying) {
        setIsPlaying(true);
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isPlaying, setIsPlaying]);

  // Ambient synthesized harmonic drone at low volume
  useEffect(() => {
    if (!isPlaying || volume === 0) {
      if (ambientGainRef.current && audioContextRef.current) {
        ambientGainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.3);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended" && hasInteracted) {
        ctx.resume();
      }

      if (!ambientOscRef.current && ctx.state === "running") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(174, ctx.currentTime); // 174 Hz Solfeggio soothing frequency
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(350, ctx.currentTime);

        const targetGain = (volume / 100) * 0.05;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.001, targetGain), ctx.currentTime + 1.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        ambientOscRef.current = osc;
        ambientGainRef.current = gain;
      } else if (ambientGainRef.current && audioContextRef.current) {
        const targetGain = (volume / 100) * 0.05;
        ambientGainRef.current.gain.linearRampToValueAtTime(Math.max(0.0001, targetGain), audioContextRef.current.currentTime + 0.2);
      }
    } catch {
      // Audio context ignored
    }
  }, [isPlaying, hasInteracted, volume]);

  const togglePlayback = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (!hasInteracted) setHasInteracted(true);
    
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    if (val > 0 && !isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* 📻 OFF-SCREEN STREAM (AUDIO ONLY - ZERO VIDEO DISPLAYED) */}
      {isPlaying && (
        <div 
          aria-hidden="true" 
          className="fixed -top-[9999px] -left-[9999px] w-1 h-1 overflow-hidden opacity-0 pointer-events-none invisible"
        >
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/hLuhfSP8Odc?autoplay=1&loop=1&playlist=hLuhfSP8Odc&mute=0&controls=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
            title="Aaliyan Portfolio Ambient Music"
            allow="autoplay *; encrypted-media *"
            className="w-1 h-1 pointer-events-none"
          />
        </div>
      )}

      {/* 🎵 FLOATING LIQUID GLASS AUDIO PLAYER SUITE */}
      <aside 
        aria-label="Liquid Glass Ambient Sound Player"
        className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none font-sans"
      >
        {/* First time hint toast */}
        {showToast && (
          <div className="mb-2 px-3 py-1.5 rounded-xl liquid-glass text-[11px] font-mono text-teal-300 border border-teal-500/30 flex items-center gap-2 shadow-2xl animate-bounce-slow">
            <Sparkles className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span>Ambient sound playing in background</span>
            <button 
              onClick={() => setShowToast(false)} 
              className="text-slate-400 hover:text-white ml-1 text-xs"
            >
              ×
            </button>
          </div>
        )}

        {/* Expanded Volume / Controls Drawer */}
        {isExpanded && (
          <div className="mb-2 p-3.5 rounded-2xl liquid-glass w-64 border border-white/20 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-3 duration-250">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Disc3 className={`h-4 w-4 text-teal-400 ${isPlaying ? "animate-spin-slow" : ""}`} />
                <span className="font-orbitron text-[11px] font-bold text-slate-100">
                  AMBIENT SOUND
                </span>
              </div>
              <span className="font-mono text-[9px] text-teal-400 font-bold">
                {volume}% VOL
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Output Volume</span>
                <span>{volume === 0 ? "Muted" : volume < 40 ? "Low (Chill)" : "Balanced"}</span>
              </div>

              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setVolume(15)}
                  className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Whisper (15%)
                </button>
                <button
                  onClick={() => setVolume(35)}
                  className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 hover:bg-white/10 text-teal-400 font-bold"
                >
                  Ideal (35%)
                </button>
                <button
                  onClick={() => setVolume(60)}
                  className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Vibrant (60%)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Master Liquid Glass Player Pill */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass border border-white/20 shadow-2xl backdrop-blur-3xl group">
          
          {/* Animated Waveform Visualizer */}
          <div className="flex items-end gap-[3px] h-4.5 px-2.5 py-1 rounded-xl bg-black/20 dark:bg-black/40 border border-white/10">
            {isPlaying ? (
              <>
                <div className="w-[3px] bg-gradient-to-t from-teal-400 to-indigo-500 rounded-full animate-music-bar" style={{ animationDelay: "0.1s" }} />
                <div className="w-[3px] bg-gradient-to-t from-teal-400 to-indigo-500 rounded-full animate-music-bar" style={{ animationDelay: "0.3s" }} />
                <div className="w-[3px] bg-gradient-to-t from-indigo-400 to-rose-400 rounded-full animate-music-bar" style={{ animationDelay: "0.2s" }} />
                <div className="w-[3px] bg-gradient-to-t from-rose-400 to-teal-400 rounded-full animate-music-bar" style={{ animationDelay: "0.45s" }} />
                <div className="w-[3px] bg-gradient-to-t from-teal-400 to-indigo-500 rounded-full animate-music-bar" style={{ animationDelay: "0.15s" }} />
              </>
            ) : (
              <div className="flex items-center gap-[3px] h-full">
                <div className="w-[3px] h-1 bg-slate-600 rounded-full" />
                <div className="w-[3px] h-1 bg-slate-600 rounded-full" />
                <div className="w-[3px] h-1 bg-slate-600 rounded-full" />
                <div className="w-[3px] h-1 bg-slate-600 rounded-full" />
                <div className="w-[3px] h-1 bg-slate-600 rounded-full" />
              </div>
            )}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayback}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold tracking-wider transition-all duration-300 cursor-pointer
              ${isPlaying 
                ? "bg-gradient-to-r from-teal-500/25 to-indigo-500/25 text-teal-300 border border-teal-500/40 shadow-inner" 
                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
            title={isPlaying ? "Pause Ambient Audio" : "Play Ambient Audio"}
          >
            {isPlaying ? (
              <>
                <Volume2 className="h-4 w-4 text-teal-400 animate-pulse" />
                <span className="hidden sm:inline">AMBIENT: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-slate-400" />
                <span className="hidden sm:inline">SOUND: OFF</span>
              </>
            )}
          </button>

          {/* Expand/Collapse Drawer button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title={isExpanded ? "Collapse Controls" : "Volume Settings"}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <Sliders className="h-4 w-4 text-teal-400" />}
          </button>
        </div>
      </aside>
    </>
  );
}
