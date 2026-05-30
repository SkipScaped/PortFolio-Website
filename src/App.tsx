import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, Github, Cpu, Layers, Globe, Sparkles, Code, Database, 
  Gamepad, Award, Volume2, VolumeX, Mail, ArrowUpRight, CheckCircle2,
  Sun, Moon, PhoneCall, ExternalLink, Blocks, HeartHandshake, Laptop,
  Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeDCard from "./components/ThreeDCard";
import GameSandbox from "./components/GameSandbox";
import BabylonSandbox from "./components/BabylonSandbox";
import AICompanion from "./components/AICompanion";
import ProposalBuilder from "./components/ProposalBuilder";
import CustomCursor from "./components/CustomCursor";
import ThreeBackground from "./components/ThreeBackground";

gsap.registerPlugin(ScrollTrigger);

interface ProjectItem {
  title: string;
  desc: string;
  link: string;
  tags: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "sandbox" | "proposal" | "companion">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [is3DActive, setIs3DActive] = useState(false);
  const [currentDateString, setCurrentDateString] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const date = new Date();
    setCurrentDateString(date.toLocaleDateString([], { month: "short", day: "numeric" }));

    // Create a GSAP Context for exact scoped rendering and reliable cleanup
    const ctx = gsap.context(() => {
      // Small timeout ensures the DOM has fully rendered under the new tab selection
      const timer = setTimeout(() => {
        if (activeTab === "home") {
          // Hero title sequence
          gsap.fromTo(".hero-name", 
            { y: 90, opacity: 0, scale: 0.85, rotateX: 12 },
            { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.4, ease: "expo.out" }
          );

          // Subtitle and descriptions staggered reveal
          gsap.fromTo([".hero-subtitle", ".hero-desc", ".hero-btn"],
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: "power4.out", delay: 0.1 }
          );

          // Absolute layout metadata indicators
          gsap.fromTo(".hero-indicator",
            { opacity: 0, x: 25 },
            { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.4 }
          );

          // Project cards reveal on scroll
          gsap.fromTo(".project-card", 
            { y: 80, opacity: 0, scale: 0.95 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 1.1, 
              stagger: 0.15, 
              ease: "power4.out",
              scrollTrigger: {
                trigger: ".project-card",
                start: "top 90%",
                toggleActions: "play none none none"
              }
            }
          );

          // Bento cards stagger scale-up reveal on scroll
          gsap.fromTo(".bento-card",
            { y: 80, opacity: 0, scale: 0.94 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.1,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".bento-card",
                start: "top 92%",
                toggleActions: "play none none none"
              }
            }
          );
        } else {
          // Secondary Tab Views entry transitions of the viewframes
          gsap.fromTo(".active-panel-view",
            { opacity: 0, y: 35, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
          );
        }
      }, 40);

      return () => clearTimeout(timer);
    });

    return () => {
      ctx.revert(); // Terminate and revert all matching scroll triggers instantly
    };
  }, [activeTab]);

  const audioCtxRef = React.useRef<AudioContext | null>(null);

  const playBeep = (freq = 600, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio permissions ignored
    }
  };

  const whatsappUrl = "https://api.whatsapp.com/send/?phone=923705375016&text&type=phone_number&app_absent=0";
  const githubUrl = "https://github.com/SkipScaped";

  const skillsData = [
    { name: "TypeScript", level: "94%", category: "Languages" },
    { name: "HTML & CSS", level: "95%", category: "Frontend" },
    { name: "JavaScript", level: "92%", category: "Languages" },
    { name: "Tailwind CSS", level: "95%", category: "Frontend" },
    { name: "AOS.js", level: "90%", category: "Animations" },
    { name: "React.js", level: "90%", category: "Frontend" },
    { name: "Redux.js", level: "85%", category: "Frontend" },
    { name: "Next.js", level: "88%", category: "Frontend" },
    { name: "Python", level: "82%", category: "Languages" },
    { name: "C#", level: "76%", category: "Languages" },
    { name: "Django", level: "80%", category: "Backend" },
    { name: "FastAPI", level: "82%", category: "Backend" },
    { name: "Supabase DB", level: "90%", category: "Database" },
    { name: "Firebase (ABAC)", level: "92%", category: "Database" }
  ];

  const showcaseProjects: ProjectItem[] = [
    {
      title: "Weather Flow Pro",
      desc: "High-performance meteorology dashboard with procedural atmospheric visualizations and dynamic data streaming. Precision weather mapping.",
      link: "https://weather-flow-app-pro.vercel.app/",
      tags: ["React", "Motion", "Vite", "API Integration"]
    },
    {
      title: "Green Loop Shop",
      desc: "Full-scale eco-friendly e-commerce engine with modular green lifestyle product listings, dynamic slide-out cart modules, and real-time checkout configurations.",
      link: "https://green-loop-shop.vercel.app/",
      tags: ["Next.js", "Tailwind CSS", "Redux.js", "Supabase DB"]
    },
    {
      title: "Private Java SMP",
      desc: "Prismatic, highly-optimized interactive dashboard and gaming system interface for a premium Java Minecraft multiplayer community with integrated live server feeds.",
      link: "http://private-java-smp.vercel.app/",
      tags: ["React.js", "Tailwind CSS", "TypeScript", "Realtime Web Interface"]
    }
  ];

  return (
    <div className={`tech-grid min-h-screen transition-colors duration-300 font-sans flex flex-col pb-12 selection:bg-indigo-500 selection:text-white relative cursor-none ${theme}
      ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}
    >
      <CustomCursor />
      <ThreeBackground theme={theme} activeTab={activeTab} is3DActive={is3DActive} setIs3DActive={setIs3DActive} />
      
      {/* 🔮 MESH BACKGROUND ORBS */}
      <div className="mesh-container">
        <div className="mesh-orb orb-1" />
        <div className="mesh-orb orb-2" />
        <div className="mesh-orb orb-3" />
      </div>

      {/* 🚀 IMMERSIVE HUD HEADER */}
      <header className={`sticky top-0 z-40 w-full glass-nav px-4 py-3 sm:px-8 transition-colors duration-300`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div 
            onClick={() => { playBeep(520); setActiveTab("home"); }}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-rose-400 p-[1.5px] shadow-lg shadow-indigo-500/10">
              <div className={`flex h-full w-full items-center justify-center rounded-xl transition-colors duration-300
                ${theme === "dark" ? "bg-slate-950" : "bg-white"}`}
              >
                <span className="font-orbitron text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">
                  S//S
                </span>
              </div>
            </div>
            <div>
              <h1 className={`font-orbitron text-sm font-bold tracking-widest transition-colors duration-300
                ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
              >
                SKIP_SCAPE
              </h1>
              <span className="font-mono text-[9px] text-teal-500 tracking-wider font-semibold">
                TS_PORT_ENGINE_V4.2
              </span>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: "home", label: "Home Base" },
              { id: "sandbox", label: "Game Sandbox" },
              { id: "proposal", label: "Proposal Builder" },
              { id: "companion", label: "AI Companion" }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => { playBeep(640); setActiveTab(tab.id as any); }}
                className={`rounded-lg px-4 py-1.5 font-sans text-xs font-bold transition-all cursor-pointer border
                  ${activeTab === tab.id 
                    ? "bg-indigo-600/10 text-indigo-500 border-indigo-500/20 shadow-sm" 
                    : theme === "dark" 
                      ? "bg-transparent text-slate-400 border-transparent hover:text-slate-200"
                      : "bg-transparent text-slate-500 border-transparent hover:text-slate-900"}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* HUD Utility controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {/* 🕹️ 3D Physics Sandbox Toggle */}
            <button
              id="btn_3d_sandbox_toggle"
              onClick={() => {
                const newState = !is3DActive;
                setIs3DActive(newState);
                playBeep(newState ? 880 : 440, 0.15);
              }}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border transition-all duration-300 cursor-pointer font-bold font-orbitron text-[9px] tracking-widest
                ${is3DActive 
                  ? "bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-pink-500/20 text-teal-400 border-teal-500/40 shadow-lg shadow-teal-500/15 animate-pulse" 
                  : theme === "dark" 
                    ? "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200" 
                    : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"}`}
              title="Toggle Fullscreen 3D Space Laboratory"
            >
              <Blocks className="h-3.5 w-3.5 text-teal-400 animate-spin-slow" />
              <span className="hidden md:inline">{is3DActive ? "LAB: ACTIVE" : "3D LAB"}</span>
            </button>

            {/* Dark & Light mode toggle */}
            <button
              id="btn_theme_toggle"
              onClick={() => { playBeep(theme === "dark" ? 780 : 540); setTheme(theme === "dark" ? "light" : "dark"); }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-300 cursor-pointer
                ${theme === "dark" 
                  ? "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200" 
                  : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"}`}
              title="Toggle Dark / Light Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-violet-600" />}
            </button>

            {/* Sound toggle */}
            <button
              id="btn_sound_toggle"
              onClick={() => { setSoundEnabled(!soundEnabled); playBeep(700, 0.1); }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-300 cursor-pointer
                ${theme === "dark" 
                  ? "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200" 
                  : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"}`}
              title="Toggle Audio Feedback"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Interactive WhatsApp Direct Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playBeep(880)}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-bold transition-all cursor-pointer bg-gradient-to-r from-emerald-500/10 to-teal-500/5 hover:from-emerald-500/20 text-emerald-500 border-emerald-500/20"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>

          {/* Tactical Live status indicator */}
          <div className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 border shadow-inner transition-colors duration-300
            ${theme === "dark" ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">ONLINE</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => { playBeep(400); setIsMobileMenuOpen(!isMobileMenuOpen); }}
            className={`flex md:hidden h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300
              ${theme === "dark" 
                ? "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200" 
                : "border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"}`}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden overflow-hidden border-t transition-colors duration-300
                ${theme === "dark" ? "border-slate-900 bg-slate-950" : "border-slate-200 bg-white"}`}
            >
              <div className="flex flex-col gap-1 p-4">
                {[
                  { id: "home", label: "Home Base" },
                  { id: "sandbox", label: "Game Sandbox" },
                  { id: "proposal", label: "Proposal Builder" },
                  { id: "companion", label: "AI Companion" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { 
                      playBeep(640); 
                      setActiveTab(tab.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 font-sans text-sm font-bold transition-all border
                      ${activeTab === tab.id 
                        ? "bg-indigo-600/10 text-indigo-500 border-indigo-500/20" 
                        : "bg-transparent text-slate-400 border-transparent hover:text-slate-200"}`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40" />}
                  </button>
                ))}
                
                {/* Mobile WhatsApp Link */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { playBeep(880); setIsMobileMenuOpen(false); }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold transition-all bg-gradient-to-r from-emerald-500/10 to-teal-500/5 text-emerald-500 border-emerald-500/20"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>WhatsApp Contact</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-8 flex-1 flex flex-col">

        {/* Tab Page 1: Home base of SkipScape Bento Content */}
        {activeTab === "home" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 flex-1 flex flex-col"
          >
            {/* Hero Profile panel */}
            <div 
              className={`relative border-b pb-10 transition-colors duration-300
                ${theme === "dark" ? "border-slate-900" : "border-slate-200"}`}
            >
              <div className="hero-indicator absolute right-0 top-0 hidden lg:block text-right font-mono text-[10px] text-slate-500 space-y-1 select-none">
                <div>GEO-LOC: ASIA_PACIFIC_ONLINE</div>
                <div>SYSTEM_EPOCH: 1778239084</div>
                <div className="text-teal-500">TYPESCRIPT MATRIX INITIALIZED</div>
              </div>

              <div className="max-w-3xl" ref={heroRef}>
                <h2 
                  className="font-orbitron text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-indigo-400 to-rose-400 leading-none drop-shadow-sm select-none hero-name"
                >
                  AALIYAN
                </h2>
                <h3 
                  className="font-orbitron text-xl sm:text-2xl font-bold text-slate-400 tracking-[0.3em] mt-4 flex items-center gap-6 uppercase select-none hero-subtitle"
                >
                  SkipScape <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent max-w-[150px]" />
                </h3>
                <p 
                  className="mt-6 font-sans text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed hero-desc"
                >
                  I construct robust full-stack web architectures using modern <strong>TypeScript, Next.js, Django</strong>, and robust databases like <strong>Supabase</strong> & <strong>Firebase Firestore Security</strong>. Behind the screens, I research Artificial Intelligence paradigms and build retro physics templates natively with the <strong>Godot</strong> game engine.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playBeep(620)}
                    className="hero-btn flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 font-orbitron text-xs font-bold tracking-wider text-white shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <PhoneCall className="h-4 w-4" /> Whatsapp: +92 370 537 5016
                  </a>

                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playBeep(640)}
                    className={`hero-btn flex items-center gap-2 rounded-xl px-5 py-2.5 font-orbitron text-xs font-bold tracking-wider border transition-all active:scale-95 cursor-pointer
                      ${theme === "dark" 
                        ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800" 
                        : "bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm"}`}
                  >
                    <Github className="h-4 w-4" /> Github: @SkipScaped
                  </a>
                </div>
              </div>
            </div>

            {/* PROJECTS SHOWCASE MATRICES (CRITICAL SUB-TASK ADDITION) */}
            <div>
              <div className="mb-6">
                <span className="font-mono text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                  Active Deployments
                </span>
                <h3 className={`font-orbitron text-xl font-bold tracking-wider mt-1
                  ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}
                >
                  Featured Code Showcases
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {showcaseProjects.map((proj, idx) => (
                  <ThreeDCard
                    key={idx}
                    className="project-card h-full"
                  >
                    <div
                      className={`h-full rounded-2xl p-8 transition-all duration-500 flex flex-col justify-between glass-card group
                        ${theme === "dark" 
                          ? "" 
                          : "text-slate-800"}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b pb-3 border-white/5">
                          <span className="font-mono text-[11px] font-bold text-teal-500 uppercase flex items-center gap-1.5">
                            <Blocks className="h-3.5 w-3.5" /> Project {idx + 1}
                          </span>
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playBeep(700)}
                            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 text-[10px] font-mono transition-all"
                          >
                            <span>VISIT_LIVE</span> <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        <h4 className={`font-orbitron text-lg font-bold tracking-wide mb-2
                          ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}
                        >
                          {proj.title}
                        </h4>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed mb-4">
                          {proj.desc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                        {proj.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`font-mono text-[9px] px-2.5 py-1 rounded-full
                              ${theme === "dark" 
                                ? "bg-white/5 text-slate-400 border border-white/5" 
                                : "bg-slate-100 text-slate-600 border border-slate-200"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>
            </div>

            {/* Immersive 3D Bento Grid and Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1: Interactive Technology HUD with TypeScript included! */}
              <div className="bento-card">
                <ThreeDCard id="card_skills">
                  <div className={`h-full rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 glass-card
                    ${theme === "dark" 
                      ? "" 
                      : "text-slate-800"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-900/60">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-teal-500" />
                          <h4 className="font-orbitron text-xs font-bold tracking-widest">
                            COMPILER SKILLS
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-teal-500 font-bold uppercase">Active Dev</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {skillsData.slice(0, 10).map((skill, idx) => (
                          <div 
                            key={idx}
                            onMouseEnter={() => playBeep(500 + idx * 25, 0.04)}
                            className={`rounded-lg border p-2 text-left transition-all select-none
                              ${theme === "dark" 
                                ? "bg-slate-900/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900" 
                                : "bg-slate-100 hover:bg-slate-200/50 border-slate-200 hover:border-slate-300 text-slate-800"}`}
                          >
                            <span className="block font-sans text-[10px] font-bold">
                              {skill.name}
                            </span>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="font-mono text-[9px] text-slate-500 uppercase">
                                {skill.category}
                              </span>
                              <span className="font-mono text-[9px] text-indigo-500 font-bold">
                                {skill.level}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/10 dark:border-slate-900/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                      <span>TYPESCRIPT INT_MATRIX</span>
                      <span>14_STACK_MODS</span>
                    </div>
                  </div>
                </ThreeDCard>
              </div>

              {/* Card 2: Interactive Godot Sandbox Access */}
              <div className="bento-card">
                <ThreeDCard id="card_arcade">
                  <div className={`h-full rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 glass-card
                    ${theme === "dark" 
                      ? "" 
                      : "text-slate-800"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-900/60">
                        <div className="flex items-center gap-2">
                          <Gamepad className="h-4 w-4 text-indigo-500" />
                          <h4 className="font-orbitron text-xs font-bold tracking-widest">
                            ENGINE HOBBY
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-indigo-500 font-bold">GODOT 3D</span>
                      </div>

                      <div className={`relative rounded-xl p-4 shadow-inner border
                        ${theme === "dark" ? "bg-slate-950 border-slate-900" : "bg-slate-50 border-slate-200"}`}
                      >
                        <h5 className="font-orbitron text-xs font-bold tracking-wide text-indigo-500">
                          Isometric 3D Platformer
                        </h5>
                        <p className="font-sans text-[11px] text-slate-400 mt-1">
                          Aaliyan natively crafts physical vectors with direct emulated script parameters in Godot engine. Experience the isometric action build!
                        </p>
                        
                        <div className="mt-4 space-y-1.5 font-mono text-[9px]">
                          <div className="flex justify-between text-slate-500 font-bold">
                            <span>WASMBIND CORE</span>
                            <span className="text-indigo-500">SYNCHRONIZED</span>
                          </div>
                          <div className="h-1 w-full rounded bg-slate-900 overflow-hidden">
                            <div className="h-full w-[95%] bg-indigo-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn_arcade_goto"
                      onClick={() => { playBeep(600); setActiveTab("sandbox"); }}
                      className={`mt-6 flex w-full items-center justify-between rounded-xl px-4 py-2.5 font-sans text-xs font-bold transition-all border group cursor-pointer
                        ${theme === "dark" 
                          ? "bg-slate-900 hover:bg-indigo-600/10 border-slate-800 hover:border-indigo-500/20 text-slate-300 hover:text-indigo-400" 
                          : "bg-slate-150 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 border-slate-300"}`}
                    >
                      <span>Launch 3D Grid Game</span>
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-500 group-hover:text-indigo-500" />
                    </button>
                  </div>
                </ThreeDCard>
              </div>

              {/* Card 3: Database & ABAC Security info */}
              <div className="bento-card">
                <ThreeDCard id="card_database">
                  <div className={`h-full rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 glass-card
                    ${theme === "dark" 
                      ? "" 
                      : "text-slate-800"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-900/60">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-rose-500" />
                          <h4 className="font-orbitron text-xs font-bold tracking-widest">
                            SECURE DATABASES
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-rose-500 font-bold uppercase">ABAC Sec</span>
                      </div>

                      <div className="p-1 space-y-3.5">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="font-sans text-xs text-slate-400">
                            <strong>Active Supabase DB</strong>: Advanced real-time PostgreSQL listeners, relational structural models, and Row Level Security permissions.
                          </p>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="font-sans text-xs text-slate-400">
                            <strong>Hardened Firebase Rules</strong>: Direct NoSQL collections protected by solid security rules wrapping update transitions airtight.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/10 dark:border-slate-900/60 font-mono text-[10px] text-slate-500 flex justify-between">
                      <span>SEC_METRIC: STABLE</span>
                      <span>POSTGRES_FIRESTORE</span>
                    </div>
                  </div>
                </ThreeDCard>
              </div>

              {/* Card 4: Services Rendered */}
              <div className="bento-card">
                <ThreeDCard id="card_services">
                  <div className={`h-full rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 glass-card
                    ${theme === "dark" 
                      ? "" 
                      : "text-slate-800"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-900/60">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-amber-500" />
                          <h4 className="font-orbitron text-xs font-bold tracking-widest">
                            SERVICES OFF_SET
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-amber-500 font-bold">RESOLVED</span>
                      </div>

                      <ul className="space-y-3 text-xs font-sans text-slate-400">
                        <li className="flex items-center justify-between border-b border-dashed border-slate-800/10 pb-1 dark:border-slate-900/30">
                          <span className="font-bold text-slate-300 dark:text-slate-700">🛒 Full Scale E-Commerce</span>
                          <span className="font-mono text-[9px] text-slate-500 uppercase">Operational</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-dashed border-slate-800/10 pb-1 dark:border-slate-900/30">
                          <span className="font-bold text-slate-300 dark:text-slate-700">🎨 Premium Portfolios</span>
                          <span className="font-mono text-[9px] text-slate-500 uppercase">Interactive</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-dashed border-slate-800/10 pb-1 dark:border-slate-900/30">
                          <span className="font-bold text-slate-300 dark:text-slate-700">🏢 Corporate Agency Webs</span>
                          <span className="font-mono text-[9px] text-slate-500 uppercase">High Scaled</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-bold text-slate-300 dark:text-slate-700">⚡ High Conversion designing</span>
                          <span className="font-mono text-[9px] text-slate-500 uppercase">SEO light</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      id="btn_proposal_goto"
                      onClick={() => { playBeep(600); setActiveTab("proposal"); }}
                      className={`mt-6 flex w-full items-center justify-between rounded-xl px-4 py-2.5 font-sans text-xs font-bold transition-all border group cursor-pointer
                        ${theme === "dark" 
                          ? "bg-slate-900 hover:bg-amber-600/10 border-slate-800 hover:border-amber-500/20 text-slate-300 hover:text-amber-500" 
                          : "bg-slate-150 hover:bg-amber-50 hover:border-amber-200 text-slate-700 hover:text-amber-600 border-slate-300"}`}
                    >
                      <span>Direct Rates Calculator</span>
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-500 group-hover:text-amber-500" />
                    </button>
                  </div>
                </ThreeDCard>
              </div>

              {/* Card 5: AI Companion Link */}
              <div className="bento-card">
                <ThreeDCard id="card_companion">
                  <div className={`h-full rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 glass-card
                    ${theme === "dark" 
                      ? "" 
                      : "text-slate-800"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-900/60">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-emerald-500" />
                          <h4 className="font-orbitron text-xs font-bold tracking-widest">
                            AI CORP CLONE
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-emerald-500 font-bold uppercase">Clone Core</span>
                      </div>

                      <div className={`rounded-xl p-3 border transition-colors duration-300
                        ${theme === "dark" ? "bg-slate-900/50 border-slate-900" : "bg-slate-100 border-slate-200"}`}
                      >
                        <p className="font-sans text-xs text-slate-400">
                          Converse directly with Aaliyan's virtual hologram clone fueled by @google/genai. Request contract outlines or test database schemas natively in real time!
                        </p>
                        
                        <div className="mt-3.5 flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="font-mono text-[9px] text-emerald-500 font-bold">
                            AI CLONE CONTEXT READY
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      id="btn_companion_goto"
                      onClick={() => { playBeep(600); setActiveTab("companion"); }}
                      className={`mt-6 flex w-full items-center justify-between rounded-xl px-4 py-2.5 font-sans text-xs font-bold transition-all border group cursor-pointer
                        ${theme === "dark" 
                          ? "bg-slate-900 hover:bg-emerald-600/10 border-slate-800 hover:border-emerald-500/20 text-slate-300 hover:text-emerald-500" 
                          : "bg-slate-150 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700 hover:text-emerald-600 border-slate-300"}`}
                    >
                      <span>Connect Companion Clone</span>
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-slate-500 group-hover:text-emerald-500" />
                    </button>
                  </div>
                </ThreeDCard>
              </div>

              {/* Card 6: AI / ML Goals */}
              <div className="bento-card">
                <ThreeDCard id="card_future">
                  <div className={`h-full rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 glass-card
                    ${theme === "dark" 
                      ? "" 
                      : "text-slate-800"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-800/10 dark:border-slate-900/60">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-purple-500" />
                          <h4 className="font-orbitron text-xs font-bold tracking-widest">
                            FUTURE MILESTONE
                          </h4>
                        </div>
                        <span className="font-mono text-[9px] text-purple-500 font-bold">EXPLORING</span>
                      </div>

                      <div className="space-y-3 font-sans text-xs text-slate-400">
                        <p>
                          Aaliyan is deeply geared towards merging responsive templates with custom Artificial Intelligence:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-[11px]">
                          <li>In-browser neural networks with TensorFlow.js.</li>
                          <li>Intelligent agentic chat systems for e-commerce sites.</li>
                          <li>Automated document schema analyzers running on fast servers.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/10 dark:border-slate-900/60 font-mono text-[9px] text-slate-500 flex justify-between">
                      <span>AIM AREA</span>
                      <span>AI_AND_ML_AIM</span>
                    </div>
                  </div>
                </ThreeDCard>
              </div>
            </div>

            {/* Direct Contact segment detailing WhatsApp and Github details */}
            <div className={`rounded-3xl p-8 transition-colors duration-300 space-y-4 glass-card
              ${theme === "dark" ? "" : ""}`}
            >
              <h4 className={`font-orbitron text-sm font-bold tracking-wider flex items-center gap-2
                ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}
              >
                <Laptop className="h-4 w-4 text-emerald-500" /> Let's Build Your Vision
              </h4>
              <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-3xl">
                Ready to construct highly responsive portfolio systems, corporate agency webs, or full scale e-commerce checkout platforms? Tap any card below to establish direct, immediate links.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(520)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 px-4 py-2 text-xs font-bold font-mono transition-all"
                >
                  <PhoneCall className="h-4 w-4" /> Whatsapp: +92 370 537 5016
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(560)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono border transition-all
                    ${theme === "dark" 
                      ? "bg-slate-900/60 hover:bg-slate-900 text-slate-300 border-slate-800" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"}`}
                >
                  <Github className="h-4 w-4" /> Github: @SkipScaped
                </a>

                <a
                  href="https://www.fiverr.com/s/5rY9RAz"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(580)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono border transition-all
                    ${theme === "dark"
                      ? "bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 border-slate-800 hover:border-emerald-500/30"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-slate-200 hover:border-emerald-300"}`}
                >
                  <Globe className="h-4 w-4 text-[#1dbf73]" /> Fiverr: @Aaliyan
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Page 2: Game Sandbox emulator */}
        {activeTab === "sandbox" && (
          <div className="active-panel-view space-y-8 flex-1 flex flex-col justify-center py-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start w-full">
              <GameSandbox />
              <BabylonSandbox theme={theme} />
            </div>
          </div>
        )}

        {/* Tab Page 3: Tailored Proposal Pricing calculator */}
        {activeTab === "proposal" && (
          <div className="active-panel-view space-y-6 flex-1 flex flex-col justify-center py-4">
            <ProposalBuilder theme={theme} />
          </div>
        )}

        {/* Tab Page 4: Gemini-powered AI clone companion */}
        {activeTab === "companion" && (
          <div className="active-panel-view space-y-6 flex-1 flex flex-col justify-center py-4">
            <AICompanion theme={theme} />
          </div>
        )}
      </main>

      {/* 🚀 IMMERSIVE FOOTER SYSTEMS */}
      <footer className="mt-12 border-t pt-6 px-4 md:px-8 text-center select-none font-mono text-[10px] text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-bold">
            <Github className="h-3.5 w-3.5 text-indigo-500" />
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              skip_scape // github.codebase
            </a>
          </div>
          <div>
            <span>SYSTEM MATRIX: {currentDateString} 2026 // ALL CORE CHANNELS SECURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
