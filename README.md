# ✂️ Trimly.ar — WebAR Beard Shaving Guide & Smart Mirror

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WebAR](https://img.shields.io/badge/WebAR-60FPS-00F5A0.svg)](#)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.net/)

**Trimly.ar** is a web-based, zero-installation Augmented Reality (AR) beard shaving guide and smart mirror. It performs 3D face mesh scanning in real-time, calculates facial proportions to recommend the ideal beard style, and draws precision-fitted AR guide boundaries onto the user's face.

---

## 🌟 Key Features

- **🎯 Aspect-Ratio Aligned 3D Face Tracking**: Leverages MediaPipe Face Mesh (468 3D landmarks) with exact video aspect-ratio scaling for zero-lag pixel-perfect attachment.
- **📐 5-Step Master Goatee Algorithm**:
  1. *Nostril Outer Vertical Reference Lines [A]* (~0.8cm outside mouth corners)
  2. *Adam's Apple 2-Finger Neck Line Rule [C]*
  3. *Face-Shape Adaptive Cheek Contour* (Soft concave curves for square jaws, sharp straight lines for round faces)
  4. *Soul Patch Lip Boundary [B]*
  5. *3-Way Symmetry Indicator*
- **💈 Luxury Minimalist Barber Shop Aesthetic**: Warm Gold (`#D4AF37`), Leather Brass (`#C8963E`), and Cream White (`#F7F4EB`) palette.
- **❄️ Foam / Lock Mode (`Lock Mode`)**: Locks guide lines to screen so tracking remains steady even when shaving cream obscures face landmarks.
- **💡 Screen Ring Light**: Illuminates user's face in dark or dimly lit bathrooms.
- **🪞 True Mirror Mode**: Horizontal mirror flip for natural hand-eye coordination.
- **📸 High-Res Snapshot Capture**: Save before/after trimming photos with active AR guidelines.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), Custom CSS3 Glassmorphism
- **Build Tool**: Vite 5
- **AR Engine**: MediaPipe Face Mesh & HTML5 Canvas 2D Engine
- **Audio Feedback**: Web Audio API

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/semjhaydin/Trimly-AR.git
cd Trimly-AR
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
