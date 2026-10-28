# Implementation Plan: 3D Particle Vortex & Neural Network Constellation

Integrate a high-performance, immersive 3D Particle Vortex and interactive Neural Network Constellation using Three.js / React Three Fiber. The effects will float continuously across all page sections, reacting to cursor movement, scroll depth, and theme changes (Cyber Dark and Champagne Glass Light mode).

---

## 1. Architecture & Design Overview

- **3D Particle Vortex**:
  - A helical logarithmic vortex of 1,200+ luminous particles with inward gravitational velocity, rotating along multi-axis curves.
  - Interactive mouse deflection: cursor movement creates dynamic centrifugal disturbances and light ripples.
  - Blending mode adapts to theme: glowing cyan/violet additive blending in Cyber Dark mode; refractive golden amber and prism crystal dots in Light mode.

- **Neural Network Constellation**:
  - 80+ dynamic floating synaptic nodes distributed throughout 3D space.
  - Real-time dynamic connection lines: computed using a high-efficiency distance threshold buffer (`LineSegments` with dynamic position attributes) that draws glowing synapses between nodes within proximity.
  - Periodic synaptic pulse waves travel along network edges, symbolizing Aaliyan's AI/ML engineering, biocomputing, and automation focus.

- **Whole-Page Continuum**:
  - Configured in the background canvas layer to span across the entire document viewport without occluding interactive elements or breaking responsiveness.
  - Camera depth gently tracks user scroll position to create a sense of flying through the neural vortex as they explore projects, skills, and experience.

---

## 2. Proposed Changes

### `src/components/ThreeBackground.tsx`
- **Add `ParticleVortex` component**:
  - Generates logarithmic spiral coordinates using parametric math.
  - Updates particle angles, radii, and vertical vortex drift per frame with exponential damping.
  - Incorporates mouse gravity well that pulls and swirls particles around cursor position.
- **Add `NeuralConstellation` component**:
  - Maintains 80 floating synaptic nodes with individual 3D velocity vectors bounded in a toroidal volume.
  - Computes inter-node Euclidean distances in the render loop with zero per-frame garbage collection (pre-allocated typed arrays).
  - Updates `LineSegments` buffer geometry with line vertices connecting node pairs within distance threshold (<= 1.8 units).
  - Applies glowing node point sprites with pulse animations.
- **Theme & Mode Harmonization**:
  - Cyber Dark: Cyan (`#06b6d4`), Electric Indigo (`#6366f1`), and Neon Violet (`#a855f7`) with additive blending.
  - Golden/Champagne Light: Deep Amber (`#d97706`), Frosted Sapphire (`#2563eb`), and Crystal Rose with crisp alpha blending.

### `src/App.tsx`
- Ensure all bento cards and liquid glass containers retain high-clarity translucency (`backdrop-blur-md` with refined borders) so the 3D vortex and neural network remain visible and immersive throughout all page sections.
- Add an interactive HUD control pill in the bottom dock or navbar to adjust particle vortex turbulence (e.g. "Ambient", "Surge", "Hyper-drive").

---

## 3. Verification Plan

### Automated Compilation & Linting
- Run `npm run lint` (`lint_applet`) to verify TypeScript types, imports, and syntax.
- Run `compile_applet` to verify that the Vite production build succeeds without any bundle warnings or errors.

### Visual & Functional Testing
- Verify smooth 60 FPS performance on both standard GPUs and low-power devices.
- Verify that the neural constellation and particle vortex float continuously across all sections (Hero, About, Enigmatix Internship, OverDrive / LevinoAuthin Projects, Skills, Roadmap, and Contact).
- Verify interactive cursor reactivity: hovering and moving the mouse disturbs the particle vortex and pulls nearby constellation nodes.
- Test both **Cyber Dark Mode** (default) and **Champagne Light Mode** to guarantee high contrast, zero washed-out text, and visual appeal.
- Ensure audio player, 3D tilt cards, and navbar links remain fully functional.
