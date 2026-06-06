// Beautiful Procedural Cyber-Ambient Music Generator using standard Web Audio API
// Synthesizes soft, warm, futuristic liquid chords and LFO sweeps natively inside the browser

class ProceduralSynthEngine {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;
  private isRunning: boolean = false;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private loopTimeout: any = null;
  private tempoBpm: number = 54; // Relaxed cyberpunk slow heart-pulse tempo
  private volume: number = 0.05; // Default to ultra-low comforting background level (5%)

  constructor() {
    // Lazy loaded initialization
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      this.ctx = new AudioCtxClass();
      
      // Setup master output volume path
      this.primaryGain = this.ctx.createGain();
      this.primaryGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.primaryGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this frame environment.", e);
    }
  }

  // Set master soundtrack volume safely
  public setVolume(level: number) {
    this.volume = Math.max(0, Math.min(0.2, level)); // Hard cap at safe 20% max volume
    if (this.primaryGain && this.ctx) {
      this.primaryGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.4);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Prismatic retro progression notes (Chords in Amaj9 - G#min7 - C#min7 - Badd9)
  private chords = [
    [220.00, 277.18, 329.63, 415.30, 493.88], // Amaj9
    [207.65, 246.94, 311.13, 369.99, 415.30], // G#min7
    [130.81, 261.63, 329.63, 392.00, 493.88], // C#min7 / C#min9 base
    [246.94, 293.66, 369.99, 440.00, 587.33]  // Badd9 / D# relative
  ];

  private currentChordIndex = 0;

  // Triggers one lush dynamic chord with low-pass filtered warmth
  private playNextChord() {
    if (!this.ctx || !this.primaryGain || !this.isRunning) return;

    // Check if state was suspended by browser autoplays
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const chord = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    // Warm resonant filters to capture the retro liquid glass dreamscape
    const biquadFilter = this.ctx.createBiquadFilter();
    biquadFilter.type = "lowpass";
    
    // Wave sweeping frequency mimics a liquid glass container resonance
    biquadFilter.frequency.setValueAtTime(350, now);
    biquadFilter.frequency.linearRampToValueAtTime(700 + Math.random() * 200, now + 4.0);
    biquadFilter.frequency.exponentialRampToValueAtTime(300, now + 8.0);
    biquadFilter.Q.setValueAtTime(1.5, now);
    biquadFilter.connect(this.primaryGain);

    // Warm swell amplitude envelope
    chord.forEach((freq, index) => {
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      // Alternating soft waveforms
      osc.type = index % 2 === 0 ? "triangle" : "sine";
      
      // Dynamic frequency micro-tuning for a rich organic analog feeling
      const detune = (Math.random() - 0.5) * 8; // micro cents
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      // Volume envelope for the individual note
      gainNode.gain.setValueAtTime(0, now);
      const attack = 1.8 + Math.random() * 0.8;
      const sustain = 4.2 + Math.random() * 0.6;
      const release = 2.0;

      // Note swell
      gainNode.gain.linearRampToValueAtTime(0.08 / chord.length, now + attack);
      gainNode.gain.setValueAtTime(0.08 / chord.length, now + attack + sustain);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + sustain + release);

      osc.connect(gainNode);
      gainNode.connect(biquadFilter);
      osc.start(now);
      osc.stop(now + attack + sustain + release);

      const activeObj = { osc, gain: gainNode };
      this.activeOscillators.push(activeObj);

      // Purge finished nodes
      setTimeout(() => {
        this.activeOscillators = this.activeOscillators.filter(item => item !== activeObj);
      }, (attack + sustain + release) * 1000 + 500);
    });

    // Schedule the next chord transition harmoniously
    const chordLengthMs = 8000; // Each beautiful chord lasts 8 seconds for slow breathing
    this.loopTimeout = setTimeout(() => {
      this.playNextChord();
    }, chordLengthMs);
  }

  // Starts the background music sequence safely
  public start() {
    this.init();
    if (this.isRunning) return;
    this.isRunning = true;
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.playNextChord();
  }

  // Pauses background music sequence
  public stop() {
    this.isRunning = false;
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
    // Fade out any active oscillator nodes gracefully
    this.activeOscillators.forEach(item => {
      try {
        item.gain.gain.setValueAtTime(item.gain.gain.value, this.ctx?.currentTime || 0);
        item.gain.gain.exponentialRampToValueAtTime(0.001, (this.ctx?.currentTime || 0) + 0.4);
        setTimeout(() => {
          try {
            item.osc.stop();
          } catch(e) {}
        }, 500);
      } catch(e) {}
    });
    this.activeOscillators = [];
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const musicEngine = new ProceduralSynthEngine();
