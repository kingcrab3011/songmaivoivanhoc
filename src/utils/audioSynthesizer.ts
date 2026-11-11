// Web Audio API Ambient Generative Synthesizer
// Provides offline-capable, royalty-free gentle ambient study chords and peaceful tone generator
// Acts as a resilient fallback if remote audio CDNs are blocked, offline, or experiencing latency

class AmbientSoundGenerator {
  private ctx: AudioContext | null = null;
  private isGenerating = false;
  private gainNode: GainNode | null = null;
  private timer: number | null = null;

  public start(volume: number = 0.5) {
    if (this.isGenerating) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.15)), this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
      this.isGenerating = true;

      // Play continuous calming chord sequence: F major - C major - D minor - Bb major (528Hz peaceful frequency)
      const chordFrequencies = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [130.81, 196.00, 261.63, 329.63], // Cmaj
        [146.83, 220.00, 261.63, 349.23], // Dm7
        [116.54, 174.61, 233.08, 293.66], // Bbmaj7
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!this.ctx || !this.gainNode || !this.isGenerating) return;
        const freqs = chordFrequencies[chordIndex % chordFrequencies.length];
        chordIndex++;

        freqs.forEach((freq) => {
          if (!this.ctx || !this.gainNode) return;
          const osc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          // Gentle attack and decay envelope
          noteGain.gain.setValueAtTime(0, this.ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 1.5);
          noteGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 6.0);

          osc.connect(noteGain);
          noteGain.connect(this.gainNode);

          osc.start(this.ctx.currentTime);
          osc.stop(this.ctx.currentTime + 6.2);
        });
      };

      playChord();
      this.timer = window.setInterval(playChord, 5000);
    } catch {
      // Audio context may be restricted by browser until user gesture
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol * 0.15)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.isGenerating = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }

  public isActive(): boolean {
    return this.isGenerating;
  }
}

export const ambientSynthesizer = new AmbientSoundGenerator();
