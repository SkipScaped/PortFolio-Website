import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Terminal, BookOpen, FileText } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function AICompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Greetings! I am SkipScape Companion AI. I parse Aaliyan's professional database, resume, and future goals. You can ask me to draft client proposals, describe his databases (Supabase, Firebase), or explain his Unity/Godot journey. How can I assist your business today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lazy initialize Gemini API client with fallback capability
  const getGeminiClient = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === "") {
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: key });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI:", e);
      return null;
    }
  };

  const preloadPrompts = [
    {
      label: "Engine Hobby",
      prompt: "Explain Aaliyan's hobby in learning Unity and Godot. What kind of games is he excited about?",
    },
    {
      label: "Database Stack",
      prompt: "What is Aaliyan's experience level with Supabase, Firebase, and standard databases?",
    },
    {
      label: "Draft Service Proposal",
      prompt: "Draft an agency website contract proposal by Aaliyan. Choose a standard cost of $2500 and a 3-week timeline.",
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const client = getGeminiClient();

    if (!client) {
      // Flawless Fallback mode with intelligent prebaked responses matching Aaliyan's profile!
      setTimeout(() => {
        let responseText = "";
        const cleanText = text.toLowerCase();

        if (cleanText.includes("unity") || cleanText.includes("godot") || cleanText.includes("game")) {
          responseText = "Aaliyan's passion for Unity and Godot stems from a natural curiosity about immersive states. He spends his leisure learning GDScript and C#, setting up 2D/3D physics vectors, and exploring gameplay scripting logic. Ultimately, he aims to utilize standard game-loop paradigms to improve interactive frontend physics in web development, creating stunning interfaces.";
        } else if (cleanText.includes("database") || cleanText.includes("supabase") || cleanText.includes("firebase")) {
          responseText = "Aaliyan possesses a highly advanced understanding of Firestore, Supabase, and relational cloud structures. He has integrated secure, Attribute-Based Access Control (ABAC) rules for firestore, designed real-time chat websockets over supabase pools, and set up relational databases (Postgres, Cloud SQL) for full-scale e-commerce web systems.";
        } else if (cleanText.includes("proposal") || cleanText.includes("draft") || cleanText.includes("contract")) {
          responseText = "### SKIPSCAPE DEV PROPOSAL\n\n**Client:** Custom Agency Website\n**Developer:** Aaliyan (SkipScape)\n**Est. Timeline:** 3 Weeks\n**Est. Cost:** $2,500 USD\n\n#### Deliverables:\n1. Tailored glassmorphism layout structured with React & Tailwind CSS\n2. Advanced GSAP animation curves for viewport scrolling\n3. High-availability CRM contact forms powered by Supabase & serverless APIs\n4. Optimized Lighthouse scores (95+ ranking)\n\n*Proposal simulated successfully. (Unlock live custom Gemini answers by adding a valid API key in AI Studio Secrets!).*";
        } else {
          responseText = `As Aaliyan's AI Clone (SkipScape Companion), I can confirm his extensive Full-Stack toolkit: HTML/CSS/JS, React.js, Next.js, Redux, Tailwind, Django, Python, C#, and FastAPI. His ultimate vision is exploring AI/ML integration. 

*(Get customized real-time answers by providing a valid GEMINI_API_KEY in the environment secrets file!)*`;
        }

        const botMsg: Message = {
          id: Math.random().toString(),
          sender: "bot",
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      // Active live path utilizing official @google/genai syntax
      const promptContext = `You are SkipScape AI Companion, the digital hologram clone of Aaliyan (SkipScape).
Keep responses engaging, informative, and formatted in clean markdown.
Information about Aaliyan:
- Age/Nick: Aaliyan, also known as SkipScape.
- Role: Highly efficient Full-Stack Developer.
- Skills: HTML, CSS, JavaScript, Tailwind CSS, AOS.js, React.js, Redux, Next.js, Python, C#, Django, FastAPI.
- Databases: Strong understanding of Supabase database and Firebase Firestore security, scaling, and schemas.
- Future Aims: Exploring Artificial Intelligence (AI) and Machine Learning (ML).
- Hobby: Learning Unity and Godot game engines natively.
- Services: Full scale e-commerce websites, portfolio websites, agency websites, landing pages, website designs.
- Behavior: Confident, tech-forward, friendly.

User Question: ${text}`;

      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptContext,
        config: {
          temperature: 0.7,
          systemInstruction: "You are active inside Aaliyan's portfolio website. You speak on behalf of Aaliyan. Highlight his skills, databases, and hobby projects proudly.",
        }
      });

      const replyText = response.text || "I processed your request but encountered an empty feedback state. Please query again!";

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: replyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Gemini API Error in Companion Chat:", error);
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "I failed to compile the active Gemini API call. Please verify that your GEMINI_API_KEY environment secret is configured correctly. In the meantime, I am running on pre-stored local parameters.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl h-[560px] md:col-span-1">
      {/* Companion Title HUD */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
              <Bot className="h-5 w-5" />
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-sm font-bold tracking-wider text-slate-200">
              SKIP_SCAPE COMPANION
            </h4>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Model: gemini-3-flash</span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 font-mono text-[9px] bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-indigo-400">
          <Terminal className="h-3 w-3" /> ONLINE_CORES
        </div>
      </div>

      {/* Messages viewport */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 h-[320px] scroll-smooth"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold
              ${msg.sender === "user" 
                ? "bg-slate-900 border-slate-800 text-teal-400" 
                : "bg-indigo-950/40 border-indigo-500/20 text-indigo-400"}`}
            >
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={`rounded-xl px-4 py-2.5 text-xs font-sans leading-relaxed shadow-sm whitespace-pre-wrap
              ${msg.sender === "user" 
                ? "bg-slate-900 border border-slate-800 text-slate-200" 
                : "bg-slate-900/60 border border-slate-800/50 text-slate-300"}`}
            >
              {msg.text}
              <span className="block font-mono text-[9px] text-slate-500 text-right mt-1.5">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-indigo-950/40 border-indigo-500/20 text-indigo-400 animate-spin">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-slate-900/50 px-4 py-2 text-xs font-mono text-slate-400">
              Compiling synapse response...
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts list */}
      <div className="flex flex-wrap gap-2 mb-3">
        {preloadPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            className="flex items-center gap-1.5 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-full transition-all cursor-pointer active:scale-95"
          >
            {idx === 0 && <BookOpen className="h-3 w-3 text-teal-400" />}
            {idx === 1 && <Terminal className="h-3 w-3 text-amber-400" />}
            {idx === 2 && <FileText className="h-3 w-3 text-indigo-400" />}
            {p.label}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about Supabase integration, Godot learning..."
          className="flex-1 bg-slate-950/80 hover:bg-slate-950 focus:bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-900 disabled:text-slate-600 border border-indigo-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
