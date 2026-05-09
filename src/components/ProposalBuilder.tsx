import React, { useState } from "react";
import { Check, Copy, ShoppingBag, Briefcase, FilePlus, Sparkles, Database, CheckCircle, Flame } from "lucide-react";

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  estDays: number;
  description: string;
  icon: React.ReactNode;
}

export default function ProposalBuilder() {
  const [selectedServices, setSelectedServices] = useState<string[]>(["portfolio"]);
  const [databaseOption, setDatabaseOption] = useState<string>("supabase");
  const [customFeatures, setCustomFeatures] = useState<Record<string, boolean>>({
    secureRules: true,
    pwaReady: false,
    animations: true,
  });
  const [copied, setCopied] = useState(false);
  const [generatedCharter, setGeneratedCharter] = useState<string>("");

  const serviceCatalog: ServiceOption[] = [
    {
      id: "ecommerce",
      name: "Full-Scale E-Commerce",
      basePrice: 145,
      estDays: 14,
      description: "Scalable e-commerce engine with modular database structuring, Stripe setup, and solid checkout.",
      icon: <ShoppingBag className="h-4 w-4 text-emerald-400" />
    },
    {
      id: "portfolio",
      name: "Premium Portfolio Website",
      basePrice: 45,
      estDays: 5,
      description: "Interactive portfolio leveraging 3D card tilt transformations, GSAP layout transitions, and clean bento panels.",
      icon: <Sparkles className="h-4 w-4 text-indigo-400" />
    },
    {
      id: "agency",
      name: "Corporate Agency Website",
      basePrice: 85,
      estDays: 10,
      description: "Sophisticated corporate platform with high conversions, customer contact funnels, and CMS workflows.",
      icon: <Briefcase className="h-4 w-4 text-teal-400" />
    },
    {
      id: "landing",
      name: "High-Converting Landing Page",
      basePrice: 25,
      estDays: 3,
      description: "Ultra-lightweight, SEO optimized website designs with high speed rankings.",
      icon: <Flame className="h-4 w-4 text-rose-400" />
    },
  ];

  const handleToggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleFeature = (key: string) => {
    setCustomFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateTotal = () => {
    let basePrice = serviceCatalog
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, current) => sum + current.basePrice, 0);

    let multiplier = 1;
    if (databaseOption === "supabase") basePrice += 25;
    if (databaseOption === "firebase") basePrice += 25;

    if (customFeatures.secureRules) basePrice += 10;
    if (customFeatures.pwaReady) basePrice += 15;
    if (customFeatures.animations) basePrice += 12;

    return Math.round(basePrice * multiplier);
  };

  const calculateTotalDays = () => {
    let totalDays = serviceCatalog
      .filter(s => selectedServices.includes(s.id))
      .reduce((max, current) => Math.max(max, current.estDays), 0);

    if (databaseOption !== "none") totalDays += 3;
    if (customFeatures.pwaReady) totalDays += 2;
    if (customFeatures.animations) totalDays += 2;

    return totalDays;
  };

  const handleBuildCharter = () => {
    const totalCost = calculateTotal();
    const totalDays = calculateTotalDays();
    const activeServices = serviceCatalog.filter(s => selectedServices.includes(s.id));

    const charter = `### SKIPSCAPE DIGITAL SERVICES AGREEMENT

**Consultant:** Aaliyan (SkipScape) - Full Stack Engineering Core
**Date Compiled:** May 2026

#### 1. Scope of Development
You have selected the following tailored frameworks:
${activeServices.map(s => `- **${s.name}**: ${s.description}`).join("\n")}

#### 2. Selected Core Database Stack: ${databaseOption.toUpperCase()}
${databaseOption === "supabase" ? "- Real-time PostgreSQL schema with custom authentication pools and row-level security." : ""}
${databaseOption === "firebase" ? "- Cloud Firestore structural blueprint featuring highly secure, hardened rule validations." : ""}
${databaseOption === "none" ? "- Lightweight decoupled static JSON parameters (No database required)." : ""}

#### 3. Advanced Features & Optimization
${customFeatures.secureRules ? "- **Secure Security Rules Implementation**: Rigid data invariants matching the master relational gates." : ""}
${customFeatures.pwaReady ? "- **Progressive Web App (PWA)**: Support for offline caching, service workers, and standalone home setup." : ""}
${customFeatures.animations ? "- **Enhanced 3D and GSAP UI**: Immersive mouse-driven perspective animations for maximum viewer conversion." : ""}

#### 4. Cost and Phase Framework
- **Estimated Dev Duration:** ${totalDays} Business Days
- **Total Investment:** $${totalCost.toLocaleString()} USD
- **Licensing & Handover:** Complete ownership of full-scale GitHub repositories + production build files.

---
*Created dynamically. You can copy this agreement charter directly to paste in the AI Companion chat to ask for modifications!*`;

    setGeneratedCharter(charter);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCharter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel flex flex-col rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl md:col-span-2">
      <div className="mb-4">
        <h3 className="font-orbitron text-lg font-bold tracking-wider text-indigo-400">
          PROPOSAL CALCULATOR & CONTRACT BUILDER
        </h3>
        <p className="font-sans text-xs text-slate-400">
          Select digital structures to compile an instantaneous development charter by Aaliyan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column: Input Options */}
        <div className="space-y-4">
          <div>
            <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Step 1: Choose Service Categories
            </span>
            <div className="space-y-2">
              {serviceCatalog.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none
                      ${isSelected 
                        ? "bg-slate-900 border-indigo-500/40" 
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800"}`}
                  >
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-slate-950
                      ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-800 bg-slate-900"}`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white stroke-[3px]" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5 font-sans text-xs font-bold text-slate-200">
                          {service.icon}
                          {service.name}
                        </span>
                        <span className="font-mono text-xs text-indigo-400 font-semibold">
                          ${service.basePrice}+
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-slate-400 mt-1 lines-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Step 2: Database Options
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "supabase", label: "Supabase DB", desc: "+$25" },
                { id: "firebase", label: "Firebase NoSQL", desc: "+$25" },
                { id: "none", label: "Static JSON", desc: "+$0" },
              ].map((dbOpt) => (
                <button
                  key={dbOpt.id}
                  onClick={() => setDatabaseOption(dbOpt.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer select-none
                    ${databaseOption === dbOpt.id 
                      ? "bg-slate-900 border-teal-500/40 text-teal-300" 
                      : "bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800"}`}
                >
                  <Database className="h-4 w-4 mb-1" />
                  <span className="font-sans text-[11px] font-bold">{dbOpt.label}</span>
                  <span className="font-mono text-[9px] text-slate-500 mt-0.5">{dbOpt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block font-sans text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Step 3: Extra Scalability Boosters
            </span>
            <div className="space-y-2">
              {[
                { key: "secureRules", label: "Secure ABAC Rules / Firestore Safety Gates", desc: "+$10" },
                { key: "pwaReady", label: "PWA Application Setup (Service Workers, Offline Cache)", desc: "+$15" },
                { key: "animations", label: "Advanced 3D & Viewport Animation Curves (GSAP)", desc: "+$12" },
              ].map((feat) => {
                const isActive = customFeatures[feat.key];
                return (
                  <label
                    key={feat.key}
                    onClick={() => handleToggleFeature(feat.key)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none
                      ${isActive 
                        ? "bg-slate-900/60 border-slate-700/60" 
                        : "bg-slate-950/20 border-slate-900"}`}
                  >
                    <span className="font-sans text-[11px] text-slate-300">{feat.label}</span>
                    <span className="font-mono text-[10px] text-indigo-400 font-semibold">{feat.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Charter output */}
        <div className="flex flex-col rounded-xl bg-slate-950/80 p-5 border border-slate-900 h-full justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
              <span className="font-sans text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <FilePlus className="h-4 w-4 text-indigo-400 animate-pulse" /> Live Proposal Output
              </span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <span>EST:</span>
                <span className="text-teal-400 font-bold">{calculateTotalDays()} Days</span>
              </div>
            </div>

            {generatedCharter ? (
              <div className="h-64 overflow-y-auto space-y-2 rounded bg-black/40 p-4 border border-slate-900 font-mono text-[10px] text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                {generatedCharter}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center rounded border border-dashed border-slate-900 bg-slate-950/40 p-4">
                <CheckCircle className="h-8 w-8 text-slate-600 mb-2" />
                <p className="font-sans text-xs text-slate-400">
                  Fill in your custom categories on the left, then click build to generate your agreement charter.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-4">
            <div className="font-sans">
              <span className="block text-[10px] uppercase text-slate-500 font-medium font-mono">
                COMPUTED PRICE CORE:
              </span>
              <span className="font-orbitron font-extrabold text-2xl text-teal-400 tracking-wider">
                ${calculateTotal().toLocaleString()}
              </span>
            </div>

            <div className="flex gap-2">
              {generatedCharter && (
                <button
                  id="btn_proposal_copy"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-2 text-xs font-sans font-bold transition-all cursor-pointer active:scale-95"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? "COPIED" : "COPY"}
                </button>
              )}
              
              <button
                id="btn_proposal_generate"
                onClick={handleBuildCharter}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-sans font-bold transition-all cursor-pointer active:scale-95 border border-indigo-500/20"
              >
                COMPILE CHARTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
