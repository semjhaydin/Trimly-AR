/* ==========================================================================
   TRIMLY.AR - AR Canvas Render Engine
   ========================================================================== */

import { BEARD_STYLES } from './beardStyles.js';

export class ARRenderer {
  constructor(canvasElement, videoElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.video = videoElement;

    // Render Options State
    this.currentStyleId = 'goatee';
    this.isLocked = false; // Köpük / Sabitleme Modu
    this.isMirror = true;
    this.zoneMode = true;
    this.lineWidth = 3;
    this.cheekOffset = 0;
    this.opacity = 0.85;

    this.lockedPixelLandmarks = null;
    this.currentFrameData = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || window.innerWidth;
      this.canvas.height = parent.clientHeight || window.innerHeight;
    }
  }

  render(frameData) {
    if (!this.canvas.width || !this.canvas.height) this.resizeCanvas();
    const ctx = this.ctx;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    // Calculate exact aspect ratio scaling for cover mode
    let videoWidth = this.video.videoWidth || 1280;
    let videoHeight = this.video.videoHeight || 720;
    const videoAspect = videoWidth / videoHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasAspect > videoAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / videoAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * videoAspect;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    // Mirror Flip Transform if enabled
    if (this.isMirror) {
      ctx.translate(canvasWidth, 0);
      ctx.scale(-1, 1);
    }

    // Draw Video Stream aligned to calculated bounds
    if (this.video && this.video.readyState >= 2) {
      ctx.drawImage(this.video, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      const grad = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 50, canvasWidth / 2, canvasHeight / 2, canvasWidth / 2);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(1, '#07090E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Determine Landmarks with EMA Jitter-Reduction Filter
    let pixelLandmarks = null;

    if (this.isLocked && this.lockedPixelLandmarks) {
      pixelLandmarks = this.lockedPixelLandmarks;
    } else if (frameData && frameData.landmarks) {
      const rawLandmarks = frameData.landmarks.map((pt) => ({
        x: offsetX + pt.x * drawWidth,
        y: offsetY + pt.y * drawHeight,
        z: (pt.z || 0) * drawWidth
      }));

      // Apply Exponential Moving Average (EMA) Stabilizer Filter
      if (!this.smoothedLandmarks || this.smoothedLandmarks.length !== rawLandmarks.length) {
        this.smoothedLandmarks = rawLandmarks;
      } else {
        const alpha = 0.38; // Ultra-stable smoothing factor
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

    // Render AR Guidelines
    if (pixelLandmarks) {
      ctx.save();
      ctx.globalAlpha = 1.0; // 100% solid skin-attached line
      ctx.shadowBlur = 0;

      const activeStyle = BEARD_STYLES.find((s) => s.id === this.currentStyleId) || BEARD_STYLES[0];
      
      activeStyle.drawGuide(ctx, pixelLandmarks, {
        zoneMode: this.zoneMode,
        lineWidth: this.lineWidth,
        cheekOffset: this.cheekOffset,
        isLocked: this.isLocked
      });

      ctx.restore();
    }

    ctx.restore();
    this.currentFrameData = frameData;
  }

  drawSymmetryAxis(ctx, landmarks) {
    const noseTop = landmarks[10] || landmarks[1];
    const chin = landmarks[152];

    if (!noseTop || !chin) return;

    ctx.save();
    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(noseTop.x, noseTop.y - 40);
    ctx.lineTo(chin.x, chin.y + 60);
    ctx.stroke();

    ctx.restore();
  }

  toggleLock() {
    this.isLocked = !this.isLocked;
    return this.isLocked;
  }

  captureSnapshot() {
    return this.canvas.toDataURL('image/png');
  }
}
