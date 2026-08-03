/* ==========================================================================
   TRIMLY.AR - Main Controller (Minimal & High Performance)
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

    // Build Beard Style Cards
    const carousel = document.getElementById('styleCarousel');
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
    document.getElementById('btnStartCamera').addEventListener('click', async () => {
      this.audioCoach.playClick();
      document.getElementById('cameraStartOverlay').classList.add('hidden');
      document.getElementById('hudOverlay').classList.remove('hidden');
      document.getElementById('scanLaser').classList.add('active');

      const success = await this.faceTracker.start();
      if (!success) {
        this.showToast("Kamera açılamadı, Demo Modu aktif.");
      }
    });

    // Demo Mode
    document.getElementById('btnDemoMode').addEventListener('click', () => {
      this.audioCoach.playClick();
      document.getElementById('cameraStartOverlay').classList.add('hidden');
      document.getElementById('hudOverlay').classList.remove('hidden');
      document.getElementById('scanLaser').classList.add('active');

      this.faceTracker.startDemoMode();
      this.showToast("Demo Modu Aktif");
    });

    // Lock / Köpük Modu Button
    const btnLock = document.getElementById('btnToggleLock');
    const lockBtnText = document.getElementById('lockBtnText');
    const lockStatusDot = document.getElementById('lockStatusDot');

    btnLock.addEventListener('click', () => {
      const isLocked = this.renderer.toggleLock();
      btnLock.classList.toggle('locked', isLocked);
      lockStatusDot.classList.toggle('locked', isLocked);

      if (isLocked) {
        this.audioCoach.playLockSound();
        lockBtnText.textContent = '🔒 Kilitli (Köpük Modu)';
        this.showToast("❄️ Çizgiler Ekrana Kilitlendi!");
      } else {
        this.audioCoach.playUnlockSound();
        lockBtnText.textContent = 'Köpük Modu (Kilitle)';
        this.showToast("Canlı Takip Aktif");
      }
    });

    // Ring Light Button
    const btnRingLight = document.getElementById('btnToggleRingLight');
    btnRingLight.addEventListener('click', () => {
      this.audioCoach.playClick();
      const ringLight = document.getElementById('ringLightOverlay');
      const isActive = ringLight.classList.toggle('hidden');
      btnRingLight.classList.toggle('active', !isActive);
      this.showToast(!isActive ? "💡 Halka Işık Açıldı" : "Işık Kapalı");
    });

    // Mirror Button
    const btnMirror = document.getElementById('btnToggleMirror');
    btnMirror.addEventListener('click', () => {
      this.audioCoach.playClick();
      this.renderer.isMirror = !this.renderer.isMirror;
      btnMirror.classList.toggle('active', this.renderer.isMirror);

      const video = document.getElementById('webcamVideo');
      video.style.transform = this.renderer.isMirror ? 'scaleX(-1)' : 'scaleX(1)';
      this.showToast(this.renderer.isMirror ? "🪞 Ayna Modu (Yatay Çevrildi)" : "Normal Görünüm");
    });

    // Zone Mode Button
    const btnZoneMode = document.getElementById('btnToggleZoneMode');
    btnZoneMode.addEventListener('click', () => {
      this.audioCoach.playClick();
      this.renderer.zoneMode = !this.renderer.zoneMode;
      btnZoneMode.classList.toggle('active', this.renderer.zoneMode);
      this.showToast(this.renderer.zoneMode ? "🟢 Renk Kodlu Harita" : "Çizgi Modu");
    });

    // Snapshot Button
    document.getElementById('btnCaptureSnapshot').addEventListener('click', () => {
      this.audioCoach.playShutterSound();
      const dataUrl = this.renderer.captureSnapshot();
      document.getElementById('snapshotImg').src = dataUrl;
      document.getElementById('btnDownloadSnapshot').href = dataUrl;
      document.getElementById('snapshotModal').classList.remove('hidden');
    });

    // Snapshot Modal Close
    document.getElementById('btnCloseSnapshot').addEventListener('click', () => {
      document.getElementById('snapshotModal').classList.add('hidden');
    });
    document.getElementById('btnCloseSnapshotBtn').addEventListener('click', () => {
      document.getElementById('snapshotModal').classList.add('hidden');
    });

    // Face Scan Badge Click -> Modal
    document.getElementById('faceScanBadge').addEventListener('click', () => {
      this.audioCoach.playClick();
      document.getElementById('analysisModal').classList.remove('hidden');
    });

    // Analysis Modal Controls
    document.getElementById('btnCloseAnalysis').addEventListener('click', () => {
      document.getElementById('analysisModal').classList.add('hidden');
    });
    document.getElementById('btnApplyRecommendation').addEventListener('click', () => {
      this.audioCoach.playClick();
      this.selectBeardStyle(this.recommendedStyle);
      document.getElementById('analysisModal').classList.add('hidden');
    });
  }

  onFaceResults(frameData) {
    this.renderer.render(frameData);

    if (frameData.analysis) {
      const { shape, ratio, jawType } = frameData.analysis;
      document.getElementById('faceShapeText').textContent = `Yüz: ${shape}`;

      if (!this.hasAnalyzedFace) {
        this.hasAnalyzedFace = true;
        this.applyFaceRecommendation(shape, ratio, jawType);

        setTimeout(() => {
          document.getElementById('scanLaser').classList.remove('active');
        }, 2000);
      }
    }
  }

  applyFaceRecommendation(shape, ratio, jawType) {
    document.getElementById('modalFaceShape').textContent = shape;
    document.getElementById('modalFaceRatio').textContent = ratio;
    document.getElementById('modalJawType').textContent = jawType;

    let recStyle = 'goatee';
    let recText = '';

    if (shape === 'Kare') {
      recStyle = 'goatee';
      recText = `Yüz hatlarınız Kare. **Keçi Sakalı (Goatee)** çenenizin sertliğini yumuşatarak kusursuz bir simetri katar.`;
    } else if (shape === 'Oval') {
      recStyle = 'stubble';
      recText = `Oval yüz yapınız var. **Kirli Sakal (Stubble)** doğal karizmanızı öne çıkarır.`;
    } else if (shape === 'Yuvarlak') {
      recStyle = 'chinstrap';
      recText = `Yuvarlak yüz hatlarınız için **Çene Şeridi** yüzünüzü daha keskin ve uzun gösterir.`;
    } else {
      recStyle = 'fullbeard';
      recText = `Yüzünüz için **Full Sakal Çizgisi** mükemmel bir dengedir.`;
    }

    this.recommendedStyle = recStyle;
    document.getElementById('modalRecommendationText').innerHTML = recText;

    this.showToast(`✨ Yüzünüz ${shape}! Önerilen stili uygulamak için tıklayın.`);
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
