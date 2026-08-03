/* ==========================================================================
   TRIMLY.AR - High-Precision 60FPS AR Render Engine
   ========================================================================== */

import { BEARD_STYLES } from './beardStyles.js';

export class ARRenderer {
  constructor(canvasElement, videoElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.video = videoElement;

    // Render Settings
    this.currentStyleId = 'goatee';
    this.isLocked = false;
    this.isMirror = true;
    this.lineColorMode = 'black'; // 'black' or 'gold'
    this.zoneMode = false;
    this.lineWidth = 4;
    this.cheekOffset = 0;
    this.opacity = 1.0;

    this.smoothedLandmarks = null;
    this.lockedPixelLandmarks = null;
    this.currentFrameData = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const dpr = window.devicePixelRatio || 1;
      const displayW = parent.clientWidth || window.innerWidth;
      const displayH = parent.clientHeight || window.innerHeight;

      this.canvas.width = displayW * dpr;
      this.canvas.height = displayH * dpr;
      this.canvas.style.width = displayW + 'px';
      this.canvas.style.height = displayH + 'px';
    }
  }

  render(frameData) {
    if (!this.canvas.width || !this.canvas.height) this.resizeCanvas();

    const ctx = this.ctx;
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.save();

    // ----------------------------------------------------------------------
    // 1. EXACT ASPECT RATIO COVER-FIT COMPUTATION (Zero-Sliding Alignment)
    // ----------------------------------------------------------------------
    const videoW = this.video.videoWidth || 1280;
    const videoH = this.video.videoHeight || 720;

    const videoAspect = videoW / videoH;
    const canvasAspect = canvasW / canvasH;

    let renderW, renderH, offsetX, offsetY;

    if (canvasAspect > videoAspect) {
      renderW = canvasW;
      renderH = canvasW / videoAspect;
      offsetX = 0;
      offsetY = (canvasH - renderH) / 2;
    } else {
      renderW = canvasH * videoAspect;
      renderH = canvasH;
      offsetX = (canvasW - renderW) / 2;
      offsetY = 0;
    }

    // Mirror Flip Transform if enabled
    if (this.isMirror) {
      ctx.translate(canvasW, 0);
      ctx.scale(-1, 1);
    }

    // Draw Video Feed
    if (this.video && this.video.readyState >= 2) {
      ctx.drawImage(this.video, offsetX, offsetY, renderW, renderH);
    } else {
      const grad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, 50, canvasW / 2, canvasH / 2, canvasW / 2);
      grad.addColorStop(0, '#1A1C23');
      grad.addColorStop(1, '#0A0B0E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // ----------------------------------------------------------------------
    // 2. PIXEL-PERFECT LANDMARK TRANSFORMATION & EMA STABILIZER
    // ----------------------------------------------------------------------
    let pixelLandmarks = null;

    if (this.isLocked && this.lockedPixelLandmarks) {
      pixelLandmarks = this.lockedPixelLandmarks;
    } else if (frameData && frameData.landmarks) {
      const rawLandmarks = frameData.landmarks.map((pt) => ({
        x: offsetX + pt.x * renderW,
        y: offsetY + pt.y * renderH,
        z: (pt.z || 0) * renderW
      }));

      // EMA Jitter Reduction Filter (Smooths out hand micro-tremors)
      if (!this.smoothedLandmarks || this.smoothedLandmarks.length !== rawLandmarks.length) {
        this.smoothedLandmarks = rawLandmarks;
      } else {
        const alpha = 0.35; // Optimal balance between zero latency & zero jitter
        this.smoothedLandmarks = rawLandmarks.map((pt, i) => {
          const prev = this.smoothedLandmarks[i];
          return {
            x: prev.x * (1 - alpha) + pt.x * alpha,
            y: prev.y * (1 - alpha) + pt.y * alpha,
            z: prev.z * (1 - alpha) + pt.z * alpha
          };
        });
      }

      pixelLandmarks = this.smoothedLandmarks;
      this.lockedPixelLandmarks = pixelLandmarks;
    }

    // ----------------------------------------------------------------------
    // 3. RENDER AR BEARD GUIDELINES
    // ----------------------------------------------------------------------
    if (pixelLandmarks) {
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      const activeStyle = BEARD_STYLES.find((s) => s.id === this.currentStyleId) || BEARD_STYLES[0];

      activeStyle.drawGuide(ctx, pixelLandmarks, {
        colorMode: this.lineColorMode,
        zoneMode: this.zoneMode,
        lineWidth: (this.lineWidth || 4) * (window.devicePixelRatio || 1),
        cheekOffset: this.cheekOffset,
        isLocked: this.isLocked
      });

      ctx.restore();
    }

    ctx.restore();
    this.currentFrameData = frameData;
  }

  toggleLock() {
    this.isLocked = !this.isLocked;
    return this.isLocked;
  }

  captureSnapshot() {
    return this.canvas.toDataURL('image/png');
  }
}
