/* ==========================================================================
   TRIMLY.AR - Face Landmark Tracker & Geometric Analysis Engine
   ========================================================================== */

export class FaceTracker {
  constructor(videoElement, onResultsCallback) {
    this.video = videoElement;
    this.onResults = onResultsCallback;
    this.faceMesh = null;
    this.camera = null;
    this.isTracking = false;
    this.isDemoMode = false;
    this.demoAnimId = null;
    this.lastLandmarks = null;
    this.faceAnalysis = {
      shape: 'Oval',
      ratio: 1.25,
      jawType: 'Dengeli',
      symmetryScore: 98,
      tiltAngle: 0
    };
  }

  async start() {
    try {
      if (window.FaceMesh) {
        this.faceMesh = new window.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });

        this.faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        this.faceMesh.onResults((results) => this.handleResults(results));
      }

      // Initialize Webcam Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      this.video.srcObject = stream;
      await this.video.play();

      if (window.Camera && this.faceMesh) {
        this.camera = new window.Camera(this.video, {
          onFrame: async () => {
            if (this.isTracking && !this.isDemoMode) {
              await this.faceMesh.send({ image: this.video });
            }
          },
          width: 1280,
          height: 720
        });
        this.camera.start();
      } else {
        // Fallback camera loop
        this.startFallbackLoop();
      }

      this.isTracking = true;
      return true;
    } catch (err) {
      console.warn("Kamera başlatılamadı veya izin verilmedi, Demo moduna geçiliyor:", err);
      this.startDemoMode();
      return false;
    }
  }

  startFallbackLoop() {
    const processFrame = async () => {
      if (this.isTracking && !this.isDemoMode && this.video.readyState >= 2) {
        if (this.faceMesh) {
          await this.faceMesh.send({ image: this.video });
        } else {
          // Internal geometry estimator
          this.generateSyntheticFrame();
        }
      }
      if (this.isTracking) {
        requestAnimationFrame(processFrame);
      }
    };
    requestAnimationFrame(processFrame);
  }

  handleResults(results) {
    if (this.isDemoMode) return;

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const rawLandmarks = results.multiFaceLandmarks[0];
      this.lastLandmarks = rawLandmarks;
      
      // Calculate Geometric Analysis & Symmetry
      this.analyzeFaceGeometry(rawLandmarks);

      if (this.onResults) {
        this.onResults({
          landmarks: rawLandmarks,
          analysis: this.faceAnalysis,
          image: results.image
        });
      }
    } else if (this.lastLandmarks) {
      // Return last known pose if temporary frame drop occurs
      if (this.onResults) {
        this.onResults({
          landmarks: this.lastLandmarks,
          analysis: this.faceAnalysis,
          image: results.image
        });
      }
    }
  }

  analyzeFaceGeometry(landmarks) {
    if (!landmarks || landmarks.length < 454) return;

    // Landmark 10: Forehead Top, 152: Chin Bottom
    // Landmark 234: Left Cheek, 454: Right Cheek
    // Landmark 132: Left Jaw Angle, 361: Right Jaw Angle

    const forehead = landmarks[10];
    const chin = landmarks[152];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    const leftJaw = landmarks[132];
    const rightJaw = landmarks[361];
    const noseBridge = landmarks[1];

    const faceLength = Math.hypot(chin.x - forehead.x, chin.y - forehead.y);
    const faceWidth = Math.hypot(rightCheek.x - leftCheek.x, rightCheek.y - leftCheek.y);
    const jawWidth = Math.hypot(rightJaw.x - leftJaw.x, rightJaw.y - leftJaw.y);

    const ratio = faceLength / (faceWidth || 1);
    this.faceAnalysis.ratio = parseFloat(ratio.toFixed(2));

    // Face Shape Classifier
    if (ratio < 1.18 && jawWidth / faceWidth > 0.85) {
      this.faceAnalysis.shape = 'Kare';
      this.faceAnalysis.jawType = 'Keskin & Geniş';
    } else if (ratio > 1.35) {
      this.faceAnalysis.shape = 'Dikdörtgen';
      this.faceAnalysis.jawType = 'Uzun & Belirgin';
    } else if (ratio < 1.15) {
      this.faceAnalysis.shape = 'Yuvarlak';
      this.faceAnalysis.jawType = 'Yumuşak Kavisli';
    } else if (jawWidth / faceWidth < 0.75) {
      this.faceAnalysis.shape = 'Kalp / Elmas';
      this.faceAnalysis.jawType = 'İnce & V-Line';
    } else {
      this.faceAnalysis.shape = 'Oval';
      this.faceAnalysis.jawType = 'Ideal Dengeli';
    }

    // Symmetry Score Calculation (Left vs Right distance to nose bridge)
    const leftDist = Math.hypot(leftCheek.x - noseBridge.x, leftCheek.y - noseBridge.y);
    const rightDist = Math.hypot(rightCheek.x - noseBridge.x, rightCheek.y - noseBridge.y);
    const diff = Math.abs(leftDist - rightDist);
    const maxDist = Math.max(leftDist, rightDist) || 1;
    const symmetry = Math.max(70, Math.min(100, Math.round((1 - diff / maxDist) * 100)));
    this.faceAnalysis.symmetryScore = symmetry;

    // Tilt Angle
    const deltaY = rightCheek.y - leftCheek.y;
    const deltaX = rightCheek.x - leftCheek.x;
    this.faceAnalysis.tiltAngle = Math.round(Math.atan2(deltaY, deltaX) * (180 / Math.PI));
  }

  startDemoMode() {
    this.isDemoMode = true;
    this.isTracking = true;
    let angle = 0;

    const renderDemoFrame = () => {
      if (!this.isDemoMode) return;
      angle += 0.03;
      const headShiftX = Math.sin(angle) * 0.02;
      const headShiftY = Math.cos(angle * 0.8) * 0.01;

      // Create synthetic normalized 468 landmark points
      const syntheticLandmarks = [];
      const centerX = 0.5 + headShiftX;
      const centerY = 0.45 + headShiftY;

      for (let i = 0; i < 468; i++) {
        syntheticLandmarks.push({ x: centerX, y: centerY, z: 0 });
      }

      // Map key points
      syntheticLandmarks[10] = { x: centerX, y: centerY - 0.25, z: 0 }; // Forehead
      syntheticLandmarks[152] = { x: centerX, y: centerY + 0.28, z: 0 }; // Chin
      syntheticLandmarks[234] = { x: centerX - 0.22, y: centerY, z: 0 }; // Left cheek
      syntheticLandmarks[454] = { x: centerX + 0.22, y: centerY, z: 0 }; // Right cheek
      syntheticLandmarks[1] = { x: centerX, y: centerY, z: 0 }; // Nose tip
      syntheticLandmarks[2] = { x: centerX, y: centerY + 0.08, z: 0 }; // Nose base
      syntheticLandmarks[0] = { x: centerX, y: centerY + 0.12, z: 0 }; // Upper lip
      syntheticLandmarks[17] = { x: centerX, y: centerY + 0.16, z: 0 }; // Lower lip
      syntheticLandmarks[61] = { x: centerX - 0.08, y: centerY + 0.14, z: 0 }; // Mouth left
      syntheticLandmarks[291] = { x: centerX + 0.08, y: centerY + 0.14, z: 0 }; // Mouth right
      syntheticLandmarks[148] = { x: centerX - 0.15, y: centerY + 0.24, z: 0 }; // Left jaw
      syntheticLandmarks[377] = { x: centerX + 0.15, y: centerY + 0.24, z: 0 }; // Right jaw
      syntheticLandmarks[172] = { x: centerX - 0.14, y: centerY + 0.32, z: 0 }; // Neck left
      syntheticLandmarks[397] = { x: centerX + 0.14, y: centerY + 0.32, z: 0 }; // Neck right
      syntheticLandmarks[132] = { x: centerX - 0.18, y: centerY + 0.15, z: 0 };
      syntheticLandmarks[361] = { x: centerX + 0.18, y: centerY + 0.15, z: 0 };

      this.analyzeFaceGeometry(syntheticLandmarks);

      if (this.onResults) {
        this.onResults({
          landmarks: syntheticLandmarks,
          analysis: this.faceAnalysis,
          isSynthetic: true
        });
      }

      this.demoAnimId = requestAnimationFrame(renderDemoFrame);
    };

    renderDemoFrame();
  }

  stopDemoMode() {
    this.isDemoMode = false;
    if (this.demoAnimId) {
      cancelAnimationFrame(this.demoAnimId);
      this.demoAnimId = null;
    }
  }
}
