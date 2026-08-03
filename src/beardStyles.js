/* ==========================================================================
   TRIMLY.AR - Extended Trimming Guide Lines (Zero Floating Top Bar)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Çenenin altına kadar uzanan kesim kılavuz çizgileri ve Adem elması boyun kavisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const nostrilL = lm[102] || lm[49];   // Point A Left
      const nostrilR = lm[331] || lm[279];  // Point A Right
      const mouthL = lm[61];               // Point B Left
      const mouthR = lm[291];              // Point B Right
      const lowerLip = lm[17];             // Lower lip bottom
      const chin = lm[152];                // Point C Chin tip
      const forehead = lm[10];             // Forehead top

      if (!nostrilL || !nostrilR || !mouthL || !mouthR || !chin || !forehead || !lowerLip) return;

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
      // 1. EXTENDED RAY COMPUTATION (Extends past chin for trimming accuracy)
      // ----------------------------------------------------------------------
      const edgeMargin = 8 * (window.devicePixelRatio || 1);
      // Extend lines past chin level by 35% of chin height so user doesn't miss the line
      const chinExtension = Math.abs(chin.y - lowerLip.y) * 0.45;
      const targetChinY = chin.y + chinExtension;

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

      // Point C: Extended past chin level (y = targetChinY)
      const t_L = (targetChinY - Ay_L) / Vy_L;
      const Cx_L = Ax_L + t_L * Vx_L;
      const Cy_L = targetChinY;

      const t_R = (targetChinY - Ay_R) / Vy_R;
      const Cx_R = Ax_R + t_R * Vx_R;
      const Cy_R = targetChinY;

      // ----------------------------------------------------------------------
      // 2. DRAW LEFT & RIGHT SIDE RAYS (No top bar over nose!)
      // ----------------------------------------------------------------------
      // Sol Dikey Işın: A_Left -> B_Left -> C_Left (Çene altını geçer)
      ctx.beginPath();
      ctx.moveTo(Ax_L, Ay_L);
      ctx.lineTo(Bx_L, By_L);
      ctx.lineTo(Cx_L, Cy_L);
      ctx.stroke();

      // Sağ Dikey Işın: A_Right -> B_Right -> C_Right (Çene altını geçer)
      ctx.beginPath();
      ctx.moveTo(Ax_R, Ay_R);
      ctx.lineTo(Bx_R, By_R);
      ctx.lineTo(Cx_R, Cy_R);
      ctx.stroke();

      // Alt Yatay Çene Sınır Çizgisi: C_Left -> C_Right
      ctx.beginPath();
      ctx.moveTo(Cx_L, Cy_L);
      ctx.lineTo(Cx_R, Cy_R);
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 3. BOYUN KAVİS ÇİZGİSİ (Adem Elması Üstü 3B Kilitli)
      // ----------------------------------------------------------------------
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const faceLen = Math.hypot(dx, dy) || 1;

      const unitDirX = dx / faceLen;
      const unitDirY = dy / faceLen;
      const neckDist = faceLen * 0.16;

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
