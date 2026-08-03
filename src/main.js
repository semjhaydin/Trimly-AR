/* ==========================================================================
   TRIMLY.AR - Production Main Controller
   ========================================================================== */

import { BEARD_STYLES } from './beardStyles.js';
import { FaceTracker } from './faceTracker.js';
import { ARRenderer } from './arRenderer.js';
import { AudioCoach } from './audioCoach.js';

class TrimlyApp {
  constructor() {
    this.video = document.getElementById('webcamVideo');
    this.canvas = document.getElementById('arCanvas');

    this.audioCoach = new AudioCoach();
    this.renderer = new ARRenderer(this.canvas, this.video);
    this.faceTracker = new FaceTracker(this.video, (results) => this.onFaceResults(results));

    this.recommendedStyle = 'goatee';
    this.hasAnalyzedFace = false;

    this.initUI();
    this.initEvents();
  }

  initUI() {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Build Beard Style Cards if carousel element exists
    const carousel = document.getElementById('styleCarousel');
    if (carousel) {
      carousel.innerHTML = '';
      BEARD_STYLES.forEach((style) => {
        const card = document.createElement('div');
        card.className = `style-card ${style.id === this.renderer.currentStyleId ? 'active' : ''}`;
        card.dataset.id = style.id;

        card.innerHTML = `
          <div class="style-icon">
            <i data-lucide="${style.icon || 'scissors'}"></i>
          </div>
          <span class="style-name">${style.name}</span>
        `;

        card.addEventListener('click', () => {
          this.selectBeardStyle(style.id);
          this.audioCoach.playClick();
        });

        carousel.appendChild(card);
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  selectBeardStyle(styleId) {
    this.renderer.currentStyleId = styleId;
    document.querySelectorAll('.style-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.id === styleId);
    });

    const activeStyle = BEARD_STYLES.find((s) => s.id === styleId);
    if (activeStyle) {
      this.showToast(`Stil: ${activeStyle.name}`);
    }
  }

  initEvents() {
    // Start Camera
    const btnStartCamera = document.getElementById('btnStartCamera');
    if (btnStartCamera) {
      btnStartCamera.addEventListener('click', async () => {
        this.audioCoach.playClick();
        const startOverlay = document.getElementById('cameraStartOverlay');
        const hudOverlay = document.getElementById('hudOverlay');
        const scanLaser = document.getElementById('scanLaser');

        if (startOverlay) startOverlay.classList.add('hidden');
        if (hudOverlay) hudOverlay.classList.remove('hidden');
        if (scanLaser) scanLaser.classList.add('active');

        const success = await this.faceTracker.start();
        if (!success) {
          this.showToast("Kamera açılamadı, Demo Modu aktif.");
        }
      });
    }

    // Demo Mode
    const btnDemoMode = document.getElementById('btnDemoMode');
    if (btnDemoMode) {
      btnDemoMode.addEventListener('click', () => {
        this.audioCoach.playClick();
        const startOverlay = document.getElementById('cameraStartOverlay');
        const hudOverlay = document.getElementById('hudOverlay');
        const scanLaser = document.getElementById('scanLaser');

        if (startOverlay) startOverlay.classList.add('hidden');
        if (hudOverlay) hudOverlay.classList.remove('hidden');
        if (scanLaser) scanLaser.classList.add('active');

        this.faceTracker.startDemoMode();
        this.showToast("Demo Modu Aktif");
      });
    }

    // Lock / Köpük Modu Button
    const btnLock = document.getElementById('btnToggleLock');
    const lockBtnText = document.getElementById('lockBtnText');
    const lockStatusDot = document.getElementById('lockStatusDot');

    if (btnLock) {
      btnLock.addEventListener('click', () => {
        const isLocked = this.renderer.toggleLock();
        btnLock.classList.toggle('locked', isLocked);
        if (lockStatusDot) lockStatusDot.classList.toggle('locked', isLocked);

        if (isLocked) {
          this.audioCoach.playLockSound();
          if (lockBtnText) lockBtnText.textContent = '🔒 Kilitli (Köpük Modu)';
          this.showToast("❄️ Çizgiler Ekrana Kilitlendi!");
        } else {
          this.audioCoach.playUnlockSound();
          if (lockBtnText) lockBtnText.textContent = 'Köpük Modu (Kilitle)';
          this.showToast("Canlı Takip Aktif");
        }
      });
    }

    // Ring Light Button
    const btnRingLight = document.getElementById('btnToggleRingLight');
    if (btnRingLight) {
      btnRingLight.addEventListener('click', () => {
        this.audioCoach.playClick();
        const ringLight = document.getElementById('ringLightOverlay');
        if (ringLight) {
          const isActive = ringLight.classList.toggle('hidden');
          btnRingLight.classList.toggle('active', !isActive);
          this.showToast(!isActive ? "💡 Halka Işık Açıldı" : "Işık Kapalı");
        }
      });
    }

    // Mirror Button
    const btnMirror = document.getElementById('btnToggleMirror');
    if (btnMirror) {
      btnMirror.addEventListener('click', () => {
        this.audioCoach.playClick();
        this.renderer.isMirror = !this.renderer.isMirror;
        btnMirror.classList.toggle('active', this.renderer.isMirror);

        const video = document.getElementById('webcamVideo');
        if (video) {
          video.style.transform = this.renderer.isMirror ? 'scaleX(-1)' : 'scaleX(1)';
        }
        this.showToast(this.renderer.isMirror ? "🪞 Ayna Modu (Yatay Çevrildi)" : "Normal Görünüm");
      });
    }

    // Zone Mode Button (Optional)
    const btnZoneMode = document.getElementById('btnToggleZoneMode');
    if (btnZoneMode) {
      btnZoneMode.addEventListener('click', () => {
        this.audioCoach.playClick();
        this.renderer.zoneMode = !this.renderer.zoneMode;
        btnZoneMode.classList.toggle('active', this.renderer.zoneMode);
        this.showToast(this.renderer.zoneMode ? "🟢 Harita Açık" : "Çizgi Modu");
      });
    }

    // Snapshot Button
    const btnCaptureSnapshot = document.getElementById('btnCaptureSnapshot');
    if (btnCaptureSnapshot) {
      btnCaptureSnapshot.addEventListener('click', () => {
        this.audioCoach.playShutterSound();
        const dataUrl = this.renderer.captureSnapshot();
        const snapshotImg = document.getElementById('snapshotImg');
        const btnDownloadSnapshot = document.getElementById('btnDownloadSnapshot');
        const snapshotModal = document.getElementById('snapshotModal');

        if (snapshotImg) snapshotImg.src = dataUrl;
        if (btnDownloadSnapshot) btnDownloadSnapshot.href = dataUrl;
        if (snapshotModal) snapshotModal.classList.remove('hidden');
      });
    }

    // Snapshot Modal Close
    const btnCloseSnapshot = document.getElementById('btnCloseSnapshot');
    if (btnCloseSnapshot) {
      btnCloseSnapshot.addEventListener('click', () => {
        const snapshotModal = document.getElementById('snapshotModal');
        if (snapshotModal) snapshotModal.classList.add('hidden');
      });
    }

    const btnCloseSnapshotBtn = document.getElementById('btnCloseSnapshotBtn');
    if (btnCloseSnapshotBtn) {
      btnCloseSnapshotBtn.addEventListener('click', () => {
        const snapshotModal = document.getElementById('snapshotModal');
        if (snapshotModal) snapshotModal.classList.add('hidden');
      });
    }

    // Face Scan Badge Click
    const faceScanBadge = document.getElementById('faceScanBadge');
    if (faceScanBadge) {
      faceScanBadge.addEventListener('click', () => {
        this.audioCoach.playClick();
        const analysisModal = document.getElementById('analysisModal');
        if (analysisModal) analysisModal.classList.remove('hidden');
      });
    }
  }

  onFaceResults(frameData) {
    this.renderer.render(frameData);

    if (frameData.analysis) {
      const { shape, ratio, jawType } = frameData.analysis;
      const faceShapeText = document.getElementById('faceShapeText');
      if (faceShapeText) {
        faceShapeText.textContent = `Yüz: ${shape}`;
      }

      if (!this.hasAnalyzedFace) {
        this.hasAnalyzedFace = true;
        this.applyFaceRecommendation(shape, ratio, jawType);

        setTimeout(() => {
          const scanLaser = document.getElementById('scanLaser');
          if (scanLaser) scanLaser.classList.remove('active');
        }, 2000);
      }
    }
  }

  applyFaceRecommendation(shape, ratio, jawType) {
    const modalFaceShape = document.getElementById('modalFaceShape');
    const modalFaceRatio = document.getElementById('modalFaceRatio');
    const modalJawType = document.getElementById('modalJawType');

    if (modalFaceShape) modalFaceShape.textContent = shape;
    if (modalFaceRatio) modalFaceRatio.textContent = ratio;
    if (modalJawType) modalJawType.textContent = jawType;

    this.showToast(`✨ Yüz Yapınız: ${shape}`);
  }

  showToast(message) {
    const tipText = document.getElementById('smartTipText');
    if (tipText) {
      tipText.textContent = message;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.trimlyApp = new TrimlyApp();
});
