import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, Github, Cpu, Layers, Globe, Sparkles, Code, Database, 
  Gamepad, Award, Volume2, VolumeX, Mail, ArrowUpRight, CheckCircle2,
  Sun, Moon, PhoneCall, ExternalLink, Blocks, HeartHandshake, Laptop,
  Menu, X, Zap, Workflow, Server, Box, Wrench, ChevronRight, Eye, ShieldCheck,
  Flame, Bot, Dna, BrainCircuit, Smartphone, Building2, Briefcase, Calendar,
  Code2, GitFork, Compass, ArrowRight, Stars, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import ThreeDCard from "./components/ThreeDCard";
import GameSandbox from "./components/GameSandbox";
import BabylonSandbox from "./components/BabylonSandbox";
import AICompanion from "./components/AICompanion";
import ProposalBuilder from "./components/ProposalBuilder";
import CustomCursor from "./components/CustomCursor";
import ThreeBackground from "./components/ThreeBackground";
import HiddenYouTubeAudio from "./components/HiddenYouTubeAudio";

gsap.registerPlugin(ScrollTrigger);

interface ProjectItem {
  title: string;
  badge: string;
  role?: string;
  desc: string;
  link: string;
  featured?: boolean;
  highlightColor: "cyan" | "indigo" | "emerald" | "amber" | "rose" | "purple";
  tags: string[];
}

interface ToolItem {
  name: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
  highlightColor: "cyan" | "indigo" | "emerald" | "amber" | "rose" | "purple";
}

interface SkillItem {
  name: string;
  level: string;
  category: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "sandbox" | "proposal" | "companion">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  // Default is ALWAYS Dark Mode!
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [is3DActive, setIs3DActive] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [currentDateString, setCurrentDateString] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize fast, punchy AOS animations and set body theme
  useEffect(() => {
    AOS.init({
      duration: 450, // Fast, punchy animations
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 35,
    });

    document.body.className = theme;
  }, [theme]);

  // Handle active tab change and refresh layout
  useEffect(() => {
    const date = new Date();
    setCurrentDateString(date.toLocaleDateString([], { month: "short", day: "numeric" }));

    AOS.refresh();

    const ctx = gsap.context(() => {
      const timer = setTimeout(() => {
        if (activeTab === "home") {
          gsap.fromTo(".hero-title-anim", 
            { y: 50, opacity: 0, scale: 0.94 },
            { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
          );

          gsap.fromTo([".hero-badge-anim", ".hero-desc-anim", ".hero-cta-anim"],
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.05 }
          );
        } else {
          gsap.fromTo(".active-panel-view",
            { opacity: 0, y: 20, scale: 0.99 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }
          );
        }
      }, 30);

      return () => clearTimeout(timer);
    });

    return () => ctx.revert();
  }, [activeTab]);

  const playBeep = (freq = 600, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        audioCtxRef.current = new AudioCtx();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio permissions ignored
    }
  };

  const whatsappUrl = "https://api.whatsapp.com/send/?phone=923705375016&text&type=phone_number&app_absent=0";
  const githubUrl = "http://github.com/SkipScaped";
  const levinoAuthinUrl = "https://levinoauthin.ai.studio/";
  const overdriveUrl = "https://overdrive-568529096082.us-west1.run.app/";

  // Skills with Dedicated Icons
  const skillsData: SkillItem[] = [
    { name: "n8n Templates & Automation", level: "96%", category: "Workflow Automation", icon: <Workflow className="h-4 w-4 text-rose-400" />, highlight: true },
    { name: "GSAP & Timeline Animations", level: "94%", category: "Motion Engine", icon: <Zap className="h-4 w-4 text-amber-400" />, highlight: true },
    { name: "Three.js & WebGL 3D", level: "93%", category: "3D Spatial Graphics", icon: <Box className="h-4 w-4 text-teal-400" />, highlight: true },
    { name: "AOS.js (Scroll FX)", level: "95%", category: "Micro-Animations", icon: <Flame className="h-4 w-4 text-orange-400" />, highlight: true },
    { name: "TypeScript", level: "95%", category: "Core Language", icon: <Code2 className="h-4 w-4 text-blue-400" />, highlight: true },
    { name: "React.js & Next.js", level: "94%", category: "Frontend Frameworks", icon: <Layers className="h-4 w-4 text-cyan-400" />, highlight: true },
    { name: "Tailwind CSS & Liquid Glass", level: "98%", category: "UI & Shaders", icon: <Sparkles className="h-4 w-4 text-indigo-400" /> },
    { name: "Supabase DB & Realtime", level: "92%", category: "Database & Auth", icon: <Database className="h-4 w-4 text-emerald-400" /> },
    { name: "Firebase (ABAC Rules)", level: "94%", category: "Hardened Security", icon: <ShieldCheck className="h-4 w-4 text-amber-500" /> },
    { name: "Python & FastAPI", level: "88%", category: "Backend Architecture", icon: <Server className="h-4 w-4 text-teal-300" /> },
    { name: "Django Framework", level: "85%", category: "Enterprise Web Systems", icon: <Globe className="h-4 w-4 text-emerald-500" /> },
    { name: "Godot 3D Game Engine", level: "89%", category: "Interactive Physics", icon: <Gamepad className="h-4 w-4 text-purple-400" /> }
  ];

  // Dedicated Developer Tools with Icons
  const toolsData: ToolItem[] = [
    {
      name: "GitHub",
      category: "Version Control & Open Source",
      desc: "Primary source of repositories, issue tracking, CI/CD automated actions, and open collaboration (@SkipScaped).",
      icon: <Github className="h-5 w-5 text-teal-400" />,
      highlightColor: "cyan"
    },
    {
      name: "GitLab",
      category: "Enterprise CI/CD Pipelines",
      desc: "DevOps automation, continuous integration, Docker image registries, and private repository orchestrations.",
      icon: <GitFork className="h-5 w-5 text-orange-400" />,
      highlightColor: "amber"
    },
    {
      name: "Postman",
      category: "API Testing & Verification",
      desc: "Designing, validating, mocking, and stress-testing complex RESTful, WebSocket, and GraphQL web endpoints.",
      icon: <Compass className="h-5 w-5 text-amber-400" />,
      highlightColor: "amber"
    },
    {
      name: "Claude",
      category: "Architectural Reasoning",
      desc: "Complex algorithmic problem solving, prompt engineering, high-level system design, and code optimization.",
      icon: <BrainCircuit className="h-5 w-5 text-rose-400" />,
      highlightColor: "rose"
    },
    {
      name: "Google AI Studio",
      category: "Gemini Model Ecosystem",
      desc: "Multimodal Gemini prototyping, live interactive agents, system prompt tuning, and high-speed token generation.",
      icon: <Sparkles className="h-5 w-5 text-teal-400" />,
      highlightColor: "cyan"
    },
    {
      name: "shadcn/ui",
      category: "Component Primitives",
      desc: "Accessible, zero-bloat Radix-powered UI design system primitives with tailored Tailwind tokens and themes.",
      icon: <Layers className="h-5 w-5 text-indigo-400" />,
      highlightColor: "indigo"
    },
    {
      name: "Zed Code Editor",
      category: "GPU-Accelerated IDE",
      desc: "Next-generation high-speed multiplayer code editor engineered in Rust for ultra-responsive typing and zero lag.",
      icon: <Code className="h-5 w-5 text-emerald-400" />,
      highlightColor: "emerald"
    },
    {
      name: "n8n Automation",
      category: "Autonomous Workflows",
      desc: "Self-hosted node workflows connecting webhooks, multi-step business logic, data transformers, and autonomous agents.",
      icon: <Workflow className="h-5 w-5 text-purple-400" />,
      highlightColor: "purple"
    }
  ];

  // Future Roadmap Plans
  const futurePlans = [
    {
      title: "Wetware Biocomputing",
      badge: "RESEARCH FRONTIER",
      icon: <Dna className="h-6 w-6 text-teal-400" />,
      desc: "Exploring biological neural substrates, DNA-based storage matrices, and synthetic organic computing logic gates interfacing with digital microcontrollers.",
      color: "cyan",
      focus: ["Synthetic Biology Logic", "DNA Data Storage", "Neural Substrates", "Bio-Digital Bridges"]
    },
    {
      title: "Advanced AI & ML Engineering",
      badge: "SYSTEMS COGNITION",
      icon: <BrainCircuit className="h-6 w-6 text-indigo-400" />,
      desc: "Building autonomous multi-agent reasoning graphs, fine-tuning specialized LLMs, and architecting real-time neural inference pipelines on edge hardware.",
      color: "indigo",
      focus: ["Autonomous Agent Swarms", "Fine-Tuned LLMs", "Vector Embeddings", "Neural Graphs"]
    },
    {
      title: "iOS App Development (Swift & SwiftUI)",
      badge: "NATIVE ECOSYSTEM",
      icon: <Smartphone className="h-6 w-6 text-rose-400" />,
      desc: "Engineering high-performance native iOS & iPadOS applications using Swift, SwiftUI, Metal 3D hardware shaders, and spatial computing architectures.",
      color: "rose",
      focus: ["Swift 6 & SwiftUI", "Metal 3D Shaders", "CoreML On-Device", "Spatial Computing"]
    }
  ];

  // Showcase Projects
  const showcaseProjects: ProjectItem[] = [
    {
      title: "OverDrive — Italian Energy Powder & Drink Co.",
      badge: "STARTUP IN PRODUCTION",
      role: "Lead Developer",
      desc: "Italian energy powder and drink company startup. Engineered high-voltage 3D interactive product web experience, dynamic brand storytelling, fluid cart checkout configurations, and ultra-fast global edge delivery.",
      link: overdriveUrl,
      featured: true,
      highlightColor: "amber",
      tags: ["Lead Developer", "Italian Startup", "Energy Powder & Drink", "Three.js 3D", "Next.js", "High Voltage"]
    },
    {
      title: "LevinoAuthin — Software Solutions Agency",
      badge: "AGENCY C.E.O & FOUNDER",
      role: "C.E.O & Principal Architect",
      desc: "High-tier Software Solutions agency founded and directed by Aaliyan. Delivering modern full-stack web architectures, enterprise n8n workflow automations, custom AI companion systems, and high-conversion client platforms.",
      link: levinoAuthinUrl,
      featured: true,
      highlightColor: "cyan",
      tags: ["C.E.O", "Software Solutions Agency", "n8n Automation", "TypeScript", "Full-Stack", "Client Systems"]
    },
    {
      title: "Weather Flow Pro",
      badge: "ATMOSPHERIC PLATFORM",
      role: "Creator",
      desc: "High-performance meteorology dashboard with procedural atmospheric visualizations, dynamic live weather stream mapping, and liquid glass spatial telemetry.",
      link: "https://weather-flow-app-pro.vercel.app/",
      highlightColor: "indigo",
      tags: ["React", "Motion", "Vite", "API Integration", "Meteorology"]
    },
    {
      title: "Green Loop Shop",
      badge: "ECO E-COMMERCE",
      role: "Full-Stack Engineer",
      desc: "Full-scale eco-friendly e-commerce engine with modular green lifestyle product listings, dynamic slide-out cart modules, and real-time checkout configurations.",
      link: "https://green-loop-shop.vercel.app/",
      highlightColor: "emerald",
      tags: ["Next.js", "Tailwind CSS", "Redux.js", "Supabase DB"]
    },
    {
      title: "Private Java SMP",
      badge: "GAMING ECOSYSTEM",
      role: "Systems Architect",
      desc: "Prismatic, highly-optimized interactive dashboard and gaming system interface for a premium Java Minecraft multiplayer community with integrated live server feeds.",
      link: "http://private-java-smp.vercel.app/",
      highlightColor: "purple",
      tags: ["React.js", "Tailwind CSS", "TypeScript", "Realtime Web Interface"]
    }
  ];

  return (
    <div className={`tech-grid min-h-screen font-sans flex flex-col pb-16 selection:bg-teal-400 selection:text-slate-950 relative cursor-none ${theme}
      ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}
    >
      <CustomCursor />
      
      {/* 🌌 IMMERSIVE THREE.JS 3D CANVAS */}
      <ThreeBackground theme={theme} activeTab={activeTab} is3DActive={is3DActive} setIs3DActive={setIs3DActive} />
      
      {/* 🎵 BACKGROUND AUDIO STREAM WITH ADVANCED LIQUID CONTROLS */}
      <HiddenYouTubeAudio isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} />
      
      {/* 🔮 MESH FLUID LIQUID BACKGROUND ORBS */}
      <div className="mesh-container">
        <div className="mesh-orb orb-1" />
        <div className="mesh-orb orb-2" />
        <div className="mesh-orb orb-3" />
        <div className="mesh-orb orb-4" />
      </div>

      {/* 🚀 HIGH-TECH LIQUID GLASS STICKY HEADER */}
      <header className="sticky top-0 z-40 w-full glass-nav px-4 py-3 sm:px-8 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <div 
            onClick={() => { playBeep(520); setActiveTab("home"); }}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-rose-400 p-[2px] shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className={`flex h-full w-full items-center justify-center rounded-[14px] transition-colors duration-300
                ${theme === "dark" ? "bg-slate-950" : "bg-white"}`}
              >
                <span className="font-orbitron text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-indigo-400 to-rose-400">
                  A//S
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-orbitron text-sm sm:text-base font-black tracking-widest transition-colors duration-300
                  ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}
                >
                  AALIYAN
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  SKIP_SCAPE
                </span>
              </div>
              <span className="font-mono text-[9px] text-indigo-400 tracking-wider font-semibold block">
                C.E.O @ LEVINOAUTHIN // LEAD DEV @ OVERDRIVE
              </span>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 liquid-glass rounded-2xl border border-white/10">
            {[
              { id: "home", label: "Home Base" },
              { id: "sandbox", label: "3D Game Sandbox" },
              { id: "proposal", label: "Proposal Calculator" },
              { id: "companion", label: "AI Clone Companion" }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => { playBeep(640); setActiveTab(tab.id as any); }}
                className={`rounded-xl px-4 py-2 font-sans text-xs font-bold transition-all duration-300 cursor-pointer border
                  ${activeTab === tab.id 
                    ? "bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-purple-500/20 text-teal-300 border-teal-500/40 shadow-sm" 
                    : theme === "dark" 
                      ? "bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
                      : "bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/50"}`}
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
              className={`flex items-center gap-1.5 h-10 px-3 rounded-xl border transition-all duration-300 cursor-pointer font-bold font-orbitron text-[10px] tracking-widest
                ${is3DActive 
                  ? "bg-gradient-to-r from-teal-500/25 via-indigo-500/25 to-pink-500/25 text-teal-300 border-teal-400/50 shadow-lg shadow-teal-500/20 animate-pulse" 
                  : theme === "dark" 
                    ? "border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-slate-700" 
                    : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-sm"}`}
              title="Toggle Fullscreen 3D Space Laboratory"
            >
              <Blocks className="h-4 w-4 text-teal-400 animate-spin-slow" />
              <span className="hidden xl:inline">{is3DActive ? "3D LAB: ON" : "3D LAB"}</span>
            </button>

            {/* Dark & Light mode toggle */}
            <button
              id="btn_theme_toggle"
              onClick={() => { 
                const nextTheme = theme === "dark" ? "light" : "dark";
                playBeep(nextTheme === "dark" ? 780 : 540); 
                setTheme(nextTheme); 
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer
                ${theme === "dark" 
                  ? "border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-slate-700" 
                  : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-sm"}`}
              title="Toggle Theme (Default: Cyber Dark)"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-violet-600" />}
            </button>

            {/* Sound FX Toggle */}
            <button
              id="btn_sound_toggle"
              onClick={() => { setSoundEnabled(!soundEnabled); playBeep(700, 0.1); }}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer
                ${theme === "dark" 
                  ? "border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white hover:border-slate-700" 
                  : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-sm"}`}
              title="Toggle SFX Beeps"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-teal-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
            </button>

            {/* Direct GitHub Link */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playBeep(640)}
              className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-xl border font-mono text-[11px] font-bold transition-all duration-300 cursor-pointer bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-teal-500/40"
              title="Explore Aaliyan's GitHub Projects"
            >
              <Github className="h-4 w-4 text-teal-400" />
              <span className="hidden md:inline">@SkipScaped</span>
            </a>

            {/* WhatsApp Quick CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playBeep(880)}
              className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-xl border font-bold transition-all duration-300 cursor-pointer bg-gradient-to-r from-emerald-500/15 to-teal-500/10 hover:from-emerald-500/25 text-emerald-400 border-emerald-500/30 text-[11px]"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Menu Button with Animated Spring */}
            <button
              onClick={() => { playBeep(400); setIsMobileMenuOpen(!isMobileMenuOpen); }}
              className={`flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer
                ${theme === "dark" 
                  ? "border-slate-800 bg-slate-950/60 text-slate-300 hover:text-white" 
                  : "border-slate-300 bg-white text-slate-700 hover:text-slate-900 shadow-sm"}`}
              title="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-teal-400" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Liquid Glass Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden overflow-hidden mt-3 liquid-glass rounded-2xl border border-white/20 p-4 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                {[
                  { id: "home", label: "Home Base" },
                  { id: "sandbox", label: "3D Game Sandbox" },
                  { id: "proposal", label: "Proposal Calculator" },
                  { id: "companion", label: "AI Clone Companion" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { 
                      playBeep(640); 
                      setActiveTab(tab.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 font-sans text-xs font-bold transition-all border
                      ${activeTab === tab.id 
                        ? "bg-teal-500/15 text-teal-300 border-teal-500/30" 
                        : "bg-transparent text-slate-300 border-transparent hover:bg-white/5"}`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <div className="h-2 w-2 rounded-full bg-teal-400 shadow-lg shadow-teal-500/50" />}
                  </button>
                ))}

                <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { playBeep(640); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-bold text-xs bg-white/5 text-slate-200 border-white/10"
                  >
                    <Github className="h-4 w-4 text-teal-400" />
                    <span>GitHub: @SkipScaped (See Projects)</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { playBeep(880); setIsMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-bold text-xs bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-400 border-emerald-500/30"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>WhatsApp Direct: +92 370 537 5016</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 🌟 MAIN APP CONTAINER */}
      <main className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-8 flex-1 flex flex-col">

        {/* Tab Page 1: Home Base */}
        {activeTab === "home" && (
          <div className="space-y-12 flex-1 flex flex-col">
            
            {/* 💎 HERO SECTION */}
            <section 
              ref={heroRef}
              data-aos="fade-up"
              className="relative pt-3 pb-10 border-b border-white/10"
            >
              {/* Corner Telemetry HUD */}
              <div className="hidden lg:block absolute right-0 top-1 text-right font-mono text-[10px] text-slate-500 space-y-1 select-none">
                <div className="flex items-center justify-end gap-1.5 text-teal-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
                  <span>SYSTEM ONLINE // ACTIVE MATRIX</span>
                </div>
                <div>IDENTITY: AALIYAN (SKIP_SCAPE)</div>
                <div>ROLE: C.E.O @ LEVINOAUTHIN</div>
                <div className="text-amber-400">LEAD DEV @ OVERDRIVE STARTUP</div>
                <div className="text-indigo-400">EX-INTERN @ ENIGMATIX (6 MOS)</div>
              </div>

              {/* Bio Pill Badges */}
              <div className="flex flex-wrap gap-2.5 mb-5 hero-badge-anim">
                <a 
                  href={levinoAuthinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold liquid-glass text-teal-300 border border-teal-500/30 hover:border-teal-400 transition-colors"
                >
                  <Award className="h-3.5 w-3.5 text-teal-400" /> C.E.O Of LevinoAuthin Agency
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a 
                  href={overdriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold liquid-glass text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-colors"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-400" /> Lead Dev @ OverDrive Energy Drink Co.
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold liquid-glass text-indigo-300 border border-indigo-500/30">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" /> 6-Month Intern @ Enigmatix
                </div>
              </div>

              {/* Giant Name Headline */}
              <h2 className="hero-title-anim font-orbitron text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-indigo-400 to-rose-400 leading-none select-none drop-shadow-lg">
                AALIYAN
              </h2>

              <div className="flex items-center gap-4 mt-3">
                <h3 className="font-orbitron text-xl sm:text-2xl font-black text-slate-400 tracking-[0.25em] uppercase select-none">
                  SkipScape
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-700 via-teal-500/40 to-transparent max-w-sm" />
              </div>

              {/* Bio Description */}
              <p className="hero-desc-anim mt-5 font-sans text-base sm:text-lg text-slate-300 dark:text-slate-300 max-w-3xl leading-relaxed">
                Software engineer, <strong>C.E.O of LevinoAuthin</strong> (Software Solutions agency), and <strong>Lead Developer of OverDrive</strong> (Italian energy drink startup). Built production software systems during a <strong>6-month software engineering internship at Enigmatix</strong>. Crafting fluid interactive experiences with <strong>Liquid Glass 3D cards</strong>, orchestrating <strong>n8n automation workflows</strong>, engineering timeline motion with <strong>GSAP & AOS.js</strong>, and rendering spatial worlds in <strong>Three.js</strong>.
              </p>

              {/* Action Buttons */}
              <div className="hero-cta-anim mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={levinoAuthinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(680)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 px-6 py-3.5 font-orbitron text-xs font-black tracking-wider text-slate-950 shadow-xl shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Award className="h-4 w-4" /> LevinoAuthin Agency
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={overdriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(720)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-6 py-3.5 font-orbitron text-xs font-black tracking-wider text-slate-950 shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="h-4 w-4" /> OverDrive Energy Co.
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(640)}
                  className="flex items-center gap-2 rounded-2xl px-6 py-3.5 font-orbitron text-xs font-bold tracking-wider liquid-glass text-slate-100 hover:text-teal-300 border border-white/20 hover:border-teal-400/50 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Github className="h-4 w-4 text-teal-400" /> GitHub: @SkipScaped
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playBeep(880)}
                  className="flex items-center gap-2 rounded-2xl px-5 py-3.5 font-orbitron text-xs font-bold tracking-wider bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  <PhoneCall className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </section>

            {/* 🏢 6-MONTH INTERNSHIP EXPERIENCE AT ENIGMATIX */}
            <section data-aos="fade-up" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs text-indigo-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-indigo-400" /> Professional Experience
                  </span>
                  <h3 className="font-orbitron text-2xl font-black tracking-wide mt-1">
                    Software Company Internship
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  Enigmatix Software • 6 Months Completed
                </span>
              </div>

              <ThreeDCard glowColor="indigo">
                <div className="liquid-glass p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden bg-gradient-to-r from-slate-900/80 via-indigo-950/20 to-slate-900/80">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                        <Building2 className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            6-MONTH INTERNSHIP
                          </span>
                          <span className="font-mono text-xs text-teal-400 font-bold">
                            ENIGMATIX SOFTWARE
                          </span>
                        </div>
                        <h4 className="font-orbitron text-xl sm:text-2xl font-black text-white">
                          Software Engineering Intern
                        </h4>
                        <p className="font-sans text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                          Worked as a software engineering intern for 6 months at <strong>Enigmatix</strong>, contributing to commercial software development, API endpoints, backend architectures, performance profiling, and scalable UI modular design.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                      {["Full-Stack Engineering", "API Microservices", "Performance Profiling", "Team Code Audits"].map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-300 px-3 py-1 rounded-xl bg-white/5 border border-white/10">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            </section>

            {/* 🧬 FUTURE PLANS: WETWARE BIOCOMPUTING, AI/ML, IOS APP DEVELOPMENT */}
            <section data-aos="fade-up" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs text-teal-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Stars className="h-4 w-4 text-teal-400" /> Future Research & Engineering Horizon
                  </span>
                  <h3 className="font-orbitron text-2xl font-black tracking-wide mt-1">
                    Future Plans & Deep Tech Vision
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  Wetware • AI/ML • iOS Native
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {futurePlans.map((plan, idx) => (
                  <ThreeDCard 
                    key={idx}
                    glowColor={plan.color as any}
                    className="h-full"
                  >
                    <div 
                      data-aos="fade-up"
                      data-aos-delay={idx * 60}
                      className="liquid-glass h-full p-7 rounded-3xl flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
                            {plan.icon}
                          </div>
                          <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                            {plan.badge}
                          </span>
                        </div>

                        <h4 className="font-orbitron text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors mb-2.5">
                          {plan.title}
                        </h4>

                        <p className="font-sans text-xs text-slate-300 leading-relaxed mb-6">
                          {plan.desc}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-white/10">
                        {plan.focus.map((item, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                            <div className="h-1 w-1 rounded-full bg-teal-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>
            </section>

            {/* 🔥 FLAGSHIP VENTURES: LEVINOAUTHIN & OVERDRIVE */}
            <section data-aos="fade-up" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs text-teal-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Core Leadership Deployments
                  </span>
                  <h3 className="font-orbitron text-2xl font-black tracking-wide mt-1">
                    Agency & Startup Ventures
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  C.E.O @ LevinoAuthin • Lead Dev @ OverDrive
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* ⚡ CARD 1: OverDrive — Italian Energy Powder & Drink Startup */}
                <ThreeDCard glowColor="amber" className="h-full">
                  <div className="liquid-glass h-full p-8 flex flex-col justify-between rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-amber-500/20 via-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Zap className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-amber-400 font-black tracking-wider uppercase block">
                              STARTUP IN PRODUCTION
                            </span>
                            <span className="font-orbitron text-xs font-bold text-slate-300">
                              ROLE: LEAD DEVELOPER
                            </span>
                          </div>
                        </div>

                        <a
                          href={overdriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playBeep(700)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all hover:scale-105"
                        >
                          <span>VISIT_LIVE</span> <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <h4 className="font-orbitron text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 mb-2">
                        OverDrive
                      </h4>
                      <p className="font-mono text-xs text-amber-400/90 font-bold mb-2">
                        Italian Energy Powder & Drink Company Startup
                      </p>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                        As <strong>Lead Developer</strong>, engineered the digital platform for OverDrive, an Italian energy powder and drink startup. Featuring high-voltage visual assets, immersive product showcase physics, responsive cart checkout, and optimized edge delivery.
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        {["Lead Developer", "Italian Startup", "Energy Powder & Drink", "Three.js 3D", "Next.js", "Edge Fast"].map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between font-mono text-[10px] text-slate-400">
                        <span>LIVE URL: overdrive-568529096082.us-west1.run.app</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                </ThreeDCard>

                {/* 🚀 CARD 2: LevinoAuthin — Software Solutions Agency */}
                <ThreeDCard glowColor="cyan" className="h-full">
                  <div className="liquid-glass h-full p-8 flex flex-col justify-between rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-teal-500/20 via-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[10px] text-teal-400 font-black tracking-wider uppercase block">
                              SOFTWARE SOLUTIONS AGENCY
                            </span>
                            <span className="font-orbitron text-xs font-bold text-slate-300">
                              ROLE: C.E.O & FOUNDER
                            </span>
                          </div>
                        </div>

                        <a
                          href={levinoAuthinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playBeep(700)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 transition-all hover:scale-105"
                        >
                          <span>VISIT_AGENCY</span> <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <h4 className="font-orbitron text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-indigo-400 mb-2">
                        LevinoAuthin
                      </h4>
                      <p className="font-mono text-xs text-teal-400/90 font-bold mb-2">
                        Premium Software Solutions & Enterprise Automation Agency
                      </p>
                      <p className="font-sans text-sm text-slate-300 leading-relaxed mb-6">
                        Founded and directed by Aaliyan as <strong>C.E.O</strong>, LevinoAuthin delivers full-stack web platforms, automated <strong>n8n workflow pipelines</strong>, custom AI integrations, and high-conversion client systems.
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        {["C.E.O", "Software Solutions", "n8n Automation", "TypeScript", "Next.js", "AI Integration"].map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between font-mono text-[10px] text-slate-400">
                        <span>LIVE URL: levinoauthin.ai.studio</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </div>
            </section>

            {/* ⭐ GITHUB CALLOUT BANNER: CLICK TO SEE MORE PROJECTS */}
            <section data-aos="zoom-in" className="relative">
              <ThreeDCard glowColor="purple">
                <div className="liquid-glass p-8 rounded-3xl border-2 border-indigo-500/40 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/60 shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-indigo-600 p-[2px] shadow-xl shrink-0">
                        <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                          <Github className="h-8 w-8 text-teal-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            OPEN SOURCE ECOSYSTEM
                          </span>
                          <span className="text-xs font-mono text-teal-400 font-bold">20+ Public Repos</span>
                        </div>
                        <h4 className="font-orbitron text-xl sm:text-2xl font-black text-white">
                          Click on my GitHub to see more of my projects!
                        </h4>
                        <p className="font-sans text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                          Discover experimental 3D WebGL shaders, full-stack Next.js boilers, Godot game physics templates, n8n automation blueprints, and open-source contributions.
                        </p>
                      </div>
                    </div>

                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playBeep(740)}
                      className="shrink-0 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 via-indigo-500 to-rose-500 hover:opacity-90 px-7 py-4 font-orbitron text-xs font-black tracking-widest text-slate-950 shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Github className="h-5 w-5 text-slate-950" />
                      <span>EXPLORE GITHUB @SkipScaped</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-950" />
                    </a>
                  </div>
                </div>
              </ThreeDCard>
            </section>

            {/* 🛠️ TOOLS I USE WITH DEDICATED ICONS */}
            <section data-aos="fade-up" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs text-indigo-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Wrench className="h-4 w-4" /> Core Developer Toolkit
                  </span>
                  <h3 className="font-orbitron text-2xl font-black tracking-wide mt-1">
                    Tools & Technologies I Use
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  Dedicated Stack & Utilities
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {toolsData.map((tool, idx) => (
                  <ThreeDCard 
                    key={idx} 
                    glowColor={tool.highlightColor}
                    className="h-full"
                  >
                    <div 
                      data-aos="fade-up"
                      data-aos-delay={idx * 40}
                      className="liquid-glass h-full p-6 rounded-2xl flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                            {tool.icon}
                          </div>
                          <span className="font-mono text-[9px] text-teal-400 font-bold uppercase tracking-wider">
                            {tool.category}
                          </span>
                        </div>

                        <h4 className="font-orbitron text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors mb-2">
                          {tool.name}
                        </h4>
                        
                        <p className="font-sans text-xs text-slate-300 leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-slate-400">
                        <span>TOOL_STATUS</span>
                        <span className="text-teal-400 font-bold">ACTIVE_DAILY</span>
                      </div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>
            </section>

            {/* 💻 FEATURED PROJECTS MATRIX */}
            <section data-aos="fade-up" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs text-teal-400 font-bold tracking-widest uppercase">
                    Live Web Applications
                  </span>
                  <h3 className="font-orbitron text-2xl font-black tracking-wide mt-1">
                    Featured Project Portfolio
                  </h3>
                </div>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>See 20+ more on GitHub</span> <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showcaseProjects.map((proj, idx) => (
                  <ThreeDCard
                    key={idx}
                    glowColor={proj.highlightColor}
                    className="h-full"
                  >
                    <div 
                      data-aos="fade-up"
                      data-aos-delay={idx * 50}
                      className="liquid-glass h-full p-7 rounded-3xl flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                          <span className="font-mono text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                            {proj.badge}
                          </span>
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playBeep(700)}
                            className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] font-mono transition-all"
                          >
                            <span>LIVE_VIEW</span> <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        <h4 className="font-orbitron text-lg font-bold tracking-wide text-slate-100 group-hover:text-teal-300 transition-colors mb-2">
                          {proj.title}
                        </h4>
                        
                        <p className="font-sans text-xs text-slate-300 leading-relaxed mb-5">
                          {proj.desc}
                        </p>
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                          {proj.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-mono text-[9px] px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>
            </section>

            {/* ⚡ SKILLS MATRIX WITH DEDICATED ICONS */}
            <section data-aos="fade-up" className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-xs text-indigo-400 font-bold tracking-widest uppercase flex items-center gap-2">
                    <Terminal className="h-4 w-4" /> Technical Proficiency
                  </span>
                  <h3 className="font-orbitron text-2xl font-black tracking-wide mt-1">
                    Skills, Automations & Graphics
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  TypeScript • n8n • GSAP • Three.js • AOS.js
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {skillsData.map((skill, idx) => (
                  <ThreeDCard
                    key={idx}
                    glowColor={skill.highlight ? "cyan" : "indigo"}
                  >
                    <div
                      data-aos="fade-up"
                      data-aos-delay={idx * 30}
                      onMouseEnter={() => playBeep(520 + idx * 25, 0.04)}
                      className={`liquid-glass p-5 rounded-2xl flex flex-col justify-between transition-all select-none
                        ${skill.highlight ? "border-teal-500/40 shadow-teal-500/10" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                            {skill.icon}
                          </div>
                          <span className="font-sans text-xs font-bold text-slate-200">
                            {skill.name}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-teal-400 font-bold">
                          {skill.level}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden my-2">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
                          style={{ width: skill.level }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span>{skill.category}</span>
                        <span className="text-indigo-400 font-semibold">VERIFIED</span>
                      </div>
                    </div>
                  </ThreeDCard>
                ))}
              </div>
            </section>

            {/* 🎮 INTERACTIVE LAB CARD PORTALS */}
            <section data-aos="fade-up" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Game Sandbox Card */}
              <ThreeDCard glowColor="indigo">
                <div className="liquid-glass p-6 rounded-3xl h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Gamepad className="h-5 w-5 text-indigo-400" />
                        <h4 className="font-orbitron text-xs font-bold tracking-widest text-slate-200">
                          3D GAME SANDBOX
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-indigo-400 font-bold uppercase">PHYSICS</span>
                    </div>

                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                      Experience isometric vector physics and Babylon.js 3D spatial models directly in your browser.
                    </p>
                  </div>

                  <button
                    onClick={() => { playBeep(640); setActiveTab("sandbox"); }}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-orbitron transition-all cursor-pointer"
                  >
                    <span>Launch Sandbox</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </ThreeDCard>

              {/* Proposal Builder Card */}
              <ThreeDCard glowColor="amber">
                <div className="liquid-glass p-6 rounded-3xl h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-amber-400" />
                        <h4 className="font-orbitron text-xs font-bold tracking-widest text-slate-200">
                          PROPOSAL BUILDER
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-amber-400 font-bold uppercase">CALCULATOR</span>
                    </div>

                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                      Direct rate calculator for full-scale e-commerce, portfolios, agency sites, and custom n8n automations.
                    </p>
                  </div>

                  <button
                    onClick={() => { playBeep(640); setActiveTab("proposal"); }}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold font-orbitron transition-all cursor-pointer"
                  >
                    <span>Calculate Rates</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </ThreeDCard>

              {/* AI Clone Companion Card */}
              <ThreeDCard glowColor="emerald">
                <div className="liquid-glass p-6 rounded-3xl h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-emerald-400" />
                        <h4 className="font-orbitron text-xs font-bold tracking-widest text-slate-200">
                          AI CLONE COMPANION
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">GEMINI AI</span>
                    </div>

                    <p className="font-sans text-xs text-slate-300 leading-relaxed mb-4">
                      Chat directly with Aaliyan's virtual hologram clone driven by Google AI Studio Gemini API models.
                    </p>
                  </div>

                  <button
                    onClick={() => { playBeep(640); setActiveTab("companion"); }}
                    className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-orbitron transition-all cursor-pointer"
                  >
                    <span>Connect Clone</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </ThreeDCard>
            </section>

            {/* 📞 DIRECT CONTACT & OUTREACH */}
            <section data-aos="fade-up" className="relative">
              <ThreeDCard glowColor="cyan">
                <div className="liquid-glass p-8 sm:p-10 rounded-3xl space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-orbitron text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                        <Laptop className="h-6 w-6 text-teal-400" /> Let's Build Your Vision
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                        Need full-stack web applications, custom 3D liquid glass design systems, enterprise n8n workflow automations, or high-conversion e-commerce engines? Reach out directly.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playBeep(520)}
                        className="flex items-center gap-2 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-5 py-3 text-xs font-bold font-mono transition-all hover:scale-105"
                      >
                        <PhoneCall className="h-4 w-4" /> WhatsApp: +92 370 537 5016
                      </a>

                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playBeep(560)}
                        className="flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-5 py-3 text-xs font-bold font-mono transition-all hover:scale-105"
                      >
                        <Github className="h-4 w-4 text-teal-400" /> GitHub: @SkipScaped
                      </a>

                      <a
                        href="https://www.fiverr.com/s/5rY9RAz"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playBeep(580)}
                        className="flex items-center gap-2 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 px-5 py-3 text-xs font-bold font-mono transition-all hover:scale-105"
                      >
                        <Globe className="h-4 w-4 text-[#1dbf73]" /> Fiverr: @Aaliyan
                      </a>
                    </div>
                  </div>
                </div>
              </ThreeDCard>
            </section>
          </div>
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

      {/* 🚀 HIGH-TECH LIQUID GLASS FOOTER */}
      <footer className="mt-16 border-t border-white/10 pt-8 px-4 sm:px-8 select-none font-mono text-[11px] text-slate-400">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-bold">
            <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <Github className="h-4 w-4 text-teal-400" />
            </div>
            <div>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 hover:underline">
                github.com/SkipScaped (Click to see more projects)
              </a>
              <div className="text-[9px] text-slate-500">
                Aaliyan • C.E.O LevinoAuthin & Lead Dev OverDrive • Ex-Intern Enigmatix
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <a href={levinoAuthinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-teal-300">
              LevinoAuthin Agency
            </a>
            <span>•</span>
            <a href={overdriveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-300">
              OverDrive Energy Co.
            </a>
            <span>•</span>
            <span className="text-slate-500">
              SYSTEM MATRIX: {currentDateString} 2026 // ALL CORES ONLINE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
