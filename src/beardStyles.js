/* ==========================================================================
   TRIMLY.AR - Precise Fitted A -> B -> C Goatee Line Algorithm
   A = Nostril Outer Edge (lm[102]/[331])
   B = Lip Corner Precision Edge (lm[61]/[291] + 8px)
   C = Extended Chin Point
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Dudak kenarlarına hassas oturan A -> B -> C doğrusal keçi sakalı ve boyun kavis çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const nostrilL = lm[102] || lm[49];   // Point A Left
      const nostrilR = lm[331] || lm[279];  // Point A Right
      const mouthL = lm[61];               // Point B Left
      const mouthR = lm[291];              // Point B Right
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
      // 1. PRECISE A -> B -> C RAY CALCULATION (Exact lip edge margin ~8px)
      // ----------------------------------------------------------------------
      const edgeMargin = 8 * (window.devicePixelRatio || 1); // Precise ~0.5cm lip clearance

      // Point A: Nostril Outer Edges
      const Ax_L = nostrilL.x;
      const Ay_L = nostrilL.y;
      const Ax_R = nostrilR.x;
      const Ay_R = nostrilR.y;

      // Point B: Lip Outer Corners (+ 8px edge margin)
      const Bx_L = mouthL.x - edgeMargin;
      const By_L = mouthL.y;
      const Bx_R = mouthR.x + edgeMargin;
      const By_R = mouthR.y;

      // Ray Vectors from A through B
      const Vx_L = Bx_L - Ax_L;
      const Vy_L = By_L - Ay_L || 1;
      const Vx_R = Bx_R - Ax_R;
      const Vy_R = By_R - Ay_R || 1;

      // Point C: Ray Extended Down to Chin Level (y = chin.y - 10px)
      const targetChinY = chin.y - 10;
      const t_L = (targetChinY - Ay_L) / Vy_L;
      const Cx_L = Ax_L + t_L * Vx_L;
      const Cy_L = targetChinY;

      const t_R = (targetChinY - Ay_R) / Vy_R;
      const Cx_R = Ax_R + t_R * Vx_R;
      const Cy_R = targetChinY;

      // ----------------------------------------------------------------------
      // 2. DRAW HASSAS KEÇİ SAKALI ÇERÇEVESİ (A -> B -> C -> Bottom Bar)
      // ----------------------------------------------------------------------
      ctx.beginPath();
      // Bıyık üstü yatay çizgi (A_Left -> A_Right)
      ctx.moveTo(Ax_L, Ay_L);
      ctx.lineTo(Ax_R, Ay_R);

      // Sağ Dikey Işın: A_Right -> B_Right -> C_Right
      ctx.lineTo(Bx_R, By_R);
      ctx.lineTo(Cx_R, Cy_R);

      // Alt Yatay Bağlantı Çizgisi: C_Right -> C_Left
      ctx.lineTo(Cx_L, Cy_L);

      // Sol Dikey Işın: C_Left -> B_Left -> A_Left
      ctx.lineTo(Bx_L, By_L);
      ctx.lineTo(Ax_L, Ay_L);

      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 3. BOYUN KAVİS ÇİZGİSİ (Adem Elması Üstü 3B Kilitli)
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
