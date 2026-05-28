# Aaliyans | Portfolio (SkipScape)

An immersive, high-performance, interactive full-stack creative portfolio designed and coded for **Aaliyan (SkipScape)**. Built with cutting-edge technologies including **React**, **Three.js**, **GSAP**, and **motion**.

---

## 🚀 Live Demos
*   **Development Preview:** [ais-dev-24nlt3ybvqf7nclndbsy5y-344089842823.asia-east1.run.app](https://ais-dev-24nlt3ybvqf7nclndbsy5y-344089842823.asia-east1.run.app)
*   **Production Build:** [ais-pre-24nlt3ybvqf7nclndbsy5y-344089842823.asia-east1.run.app](https://ais-pre-24nlt3ybvqf7nclndbsy5y-344089842823.asia-east1.run.app)

---

## ✨ Features & Experiences

### 🌌 Immersive 3D Space & Interactive Atmosphere
*   **Three.js Starfield Engine:** A custom physics-inspired particle background containing thousands of stars processing dynamically based on user pointer interactions and hover coordinate changes.
*   **Adaptive Theme Synchronization:** The background immediately shifts colors and rendering attributes when toggling between Dark Mode and Light Mode.
*   **Custom Low-Latency Cursor:** Accelerated CSS-blended pointer system optimized via GSAP engine `quickTo` commands to eliminate latency and create an elegant, responsive tactile workspace.

### 🤖 Clone Companion & Artificial Intelligence Sandbox
*   **Interactive AI Chat Clone:** Connect directly with Aaliyan’s digital clone, answering queries about core full-stack programming tools (TypeScript, Python, Godot engine, Next.js, and Supabase integration schemas).
*   **Gemini Core Architecture:** Capable of running live server-side smart-replies based on the powerful `@google/genai` TypeScript SDK.

### 📐 Dynamic Proposals Calculator
*   **Procedural Agreement Builder:** A real-time client contract builder matching estimates and tech selections directly. 
*   **Adaptive Pricing Models:** Instantly calculate timelines, costs, and software stack attributes (e.g., Supabase vs Firestore or complex API configurations).

### ☀️ Responsive Dual Theme Design
*   **Slate Dark Mode:** High-contrast ambient deep cosmic interface emphasizing technical telemetry graphics and neo-brutalist grids.
*   **Paper Light Mode:** Clean, eyesafe high-contrast interface leveraging minimal off-white backdrops, beautiful typography pairings, and elegant charcoal glyphs.

---

## 🛠️ Technological Stack

*   **Runtime/Framework:** Vite + React (v19) + TypeScript (v5)
*   **Aesthetics & Styles:** Tailwind CSS (v4)
*   **Fluid Visual Systems:** GSAP (ScrollTrigger, quickTo) & motion/react
*   **3D Elements:** Three.js (BufferGeometries, PointsMaterial)
*   **AI Integration:** @google/genai SDK (server-ready proxy integration)
*   **Icons Framework:** lucide-react

---

## 🏁 Quick Start & Installation

To run this platform locally:

1. **Clone the project files & navigate into directory:**
   ```bash
   npm install
   ```

2. **Configure Development Environment:**
   For local development of the dynamic AI clone queries, create a `.env` or check `.env.example` in the directory root:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

3. **Launch Local Server:**
   This starts Vite on port `3000`:
   ```bash
   npm run dev
   ```

4. **Build Production Artifacts:**
   Creates highly optimized client assets inside `/dist`:
   ```bash
   npm run build
   ```

5. **Local Lint & Validate Types:**
   ```bash
   npm run lint
   ```

---

## 🎨 Creative Architecture Note

This environment departs from conventional grid-and-box visual layout formats. Elements utilize modern structural principles, combining high-contrast geometric typography (**Space Grotesk** & **JetBrains Mono**) with glowing glassmorphic components (`glass-card` system) to deliver an optimized experience for desktop displays and responsive mobile touch targets (44px target standard sizes).
