class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }
  playTone(freq, type, duration, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }, delay * 1000);
  }
  playSuccess() {
    this.playTone(523.25, 'sine', 0.15, 0);
    this.playTone(659.25, 'sine', 0.2, 0.1);
    this.playTone(783.99, 'sine', 0.35, 0.2);
  }
  playStreakFlame() {
    this.playTone(440, 'triangle', 0.12, 0);
    this.playTone(554.37, 'triangle', 0.15, 0.08);
    this.playTone(659.25, 'triangle', 0.2, 0.16);
    this.playTone(880, 'triangle', 0.4, 0.24);
  }
  playFanfare() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.playTone(f, 'sine', 0.3, i * 0.12);
    });
  }
}

export const sfx = new SoundEffects();
