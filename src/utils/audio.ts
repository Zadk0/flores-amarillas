// Generador de música romántica ambiental mediante Web Audio API
class RomanticAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private onStateChange: ((playing: boolean) => void) | null = null;

  public init(callback?: (playing: boolean) => void) {
    this.onStateChange = callback || null;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange(true);

      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25];
      const chords = [
        [notes[0], notes[2], notes[4]], // C
        [notes[3], notes[1], notes[4]], // G
        [notes[4], notes[0], notes[2]], // Am
        [notes[0], notes[3], notes[5]]  // F
      ];

      let chordIdx = 0;
      const playStep = () => {
        if (!this.isPlaying || !this.ctx) return;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(750, this.ctx.currentTime);

          osc.type = 'sine';
          const startTime = this.ctx.currentTime + i * 0.28;
          osc.frequency.setValueAtTime(freq, startTime);

          const duration = 2.6;

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.065, startTime + 0.35);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
      };

      playStep();
      this.intervalId = setInterval(playStep, 2800);
    } catch (e) {
      console.warn("Audio Context no disponible:", e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.onStateChange) this.onStateChange(false);
  }
}

export const romanticAudio = new RomanticAudioPlayer();
