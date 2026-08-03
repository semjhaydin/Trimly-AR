/* ==========================================================================
   TRIMLY.AR - Exact Ray-Traced A -> B -> C Goatee Line Algorithm
   A = Nose Edge (lm[102]/[331])
   B = Lip Edge Outer Margin (lm[61]/[291])
   C = Chin Level Extended Ray
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Burun kenarı (A), dudak kenarı (B) ve çene (C) doğrusal ışın algoritmalı profesyonel keçi sakalı.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const nostrilL = lm[102] || lm[49];   // Point A Left
      const nostrilR = lm[331] || lm[279];  // Point A Right
      const mouthL = lm[61];               // Point B Left base
      const mouthR = lm[291];              // Point B Right base
      const chin = lm[152];                // Point C Chin level
      const forehead = lm[10];             // Forehead top

      if (!nostrilL || !nostrilR || !mouthL || !mouthR || !chin || !forehead) return;

      const isGold = options.colorMode === 'gold';
      const strokeColor = isGold ? '#FFD700' : '#000000';
      const lw = options.lineWidth || 4.5;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = lw;
      ctx.strokeStyle = strokeColor;

      // ----------------------------------------------------------------------
      // 1. EXACT A -> B -> C RAY MATHEMATICS
      // ----------------------------------------------------------------------
      const mouthWidth = Math.abs(mouthR.x - mouthL.x);
      const outerMargin = mouthWidth * 0.35; // Ensures B is comfortably OUTSIDE lips for a full beard width

      // Point A: Nose Outer Edges
      const Ax_L = nostrilL.x;
      const Ay_L = nostrilL.y;
      const Ax_R = nostrilR.x;
      const Ay_R = nostrilR.y;

      // Point B: Lips Outer Edges
      const Bx_L = mouthL.x - outerMargin;
      const By_L = mouthL.y;
      const Bx_R = mouthR.x + outerMargin;
      const By_R = mouthR.y;

      // Ray Vectors from A to B
      const Vx_L = Bx_L - Ax_L;
      const Vy_L = By_L - Ay_L || 1;
      const Vx_R = Bx_R - Ax_R;
      const Vy_R = By_R - Ay_R || 1;

      // Point C: Ray Extended Down to Chin Level (y = chin.y)
      const t_L = (chin.y - Ay_L) / Vy_L;
      const Cx_L = Ax_L + t_L * Vx_L;
      const Cy_L = chin.y;

      const t_R = (chin.y - Ay_R) / Vy_R;
      const Cx_R = Ax_R + t_R * Vx_R;
      const Cy_R = chin.y;

      // ----------------------------------------------------------------------
      // 2. DRAW GOATEE OUTLINE (A -> B -> C -> Chin Center -> C -> B -> A)
      // ----------------------------------------------------------------------
      ctx.beginPath();
      // Mustache top bar connecting A_Left to A_Right
      ctx.moveTo(Ax_L, Ay_L);
      ctx.lineTo(Ax_R, Ay_R);

      // Right Straight Ray: A_Right -> B_Right -> C_Right
      ctx.lineTo(Bx_R, By_R);
      ctx.lineTo(Cx_R, Cy_R);

      // Chin bottom curve: C_Right -> Chin tip -> C_Left
      ctx.quadraticCurveTo(chin.x, chin.y + 10, Cx_L, Cy_L);

      // Left Straight Ray: C_Left -> B_Left -> A_Left
      ctx.lineTo(Bx_L, By_L);
      ctx.lineTo(Ax_L, Ay_L);

      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 3. TILT-SAFE 3D NECK ARC
      // ----------------------------------------------------------------------
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const faceLen = Math.hypot(dx, dy) || 1;

      const unitDirX = dx / faceLen;
      const unitDirY = dy / faceLen;
      const neckDist = faceLen * 0.15;

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.lineWidth = Math.max(3, lw * 0.85);
      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        const px = pt.x + unitDirX * neckDist;
        const py = pt.y + unitDirY * neckDist;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.restore();
    }
  }
];
