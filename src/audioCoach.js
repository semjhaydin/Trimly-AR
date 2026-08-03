/* ==========================================================================
   TRIMLY.AR - Web Audio API Audio Coach & Haptic Feedback Engine
   ========================================================================== */

export class AudioCoach {
  constructor() {
    this.ctx = null;
    this.isEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.isEnabled) return;
    this.init();
    this.playTone(800, 'sine', 0.05, 0.1);
  }

  playLockSound() {
    if (!this.isEnabled) return;
    this.init();
    // Two-tone rising chime
    this.playTone(523.25, 'sine', 0.1, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.2), 100); // E5
  }

  playUnlockSound() {
    if (!this.isEnabled) return;
    this.init();
    this.playTone(659.25, 'sine', 0.1, 0.15);
    setTimeout(() => this.playTone(523.25, 'sine', 0.15, 0.2), 100);
  }

  playShutterSound() {
    if (!this.isEnabled) return;
    this.init();
    this.playTone(1200, 'triangle', 0.04, 0.3);
    setTimeout(() => this.playTone(400, 'sine', 0.08, 0.2), 40);
  }

  playSymmetryWarning() {
    if (!this.isEnabled) return;
    this.init();
    this.playTone(300, 'sawtooth', 0.12, 0.1);
  }

  playTone(freq, type, duration, gainVal = 0.1) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio feedback error:", e);
    }
  }
}
