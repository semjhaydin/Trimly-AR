/* ==========================================================================
   TRIMLY.AR - Mükemmel Keçi Sakalı Algoritması (Kafa Yönelimli 3B U-Çerçeve)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Burun kanatlarından aşağı inen dikey ışınlar, alt dudak altı birleşimi ve Adem elması boyun kavisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // ── Essential Landmarks ─────────────────────────────────────────
      const nostrilL = lm[102] || lm[49];   // Sol burun kanadı dış kenarı
      const nostrilR = lm[331] || lm[279];  // Sağ burun kanadı dış kenarı
      const lowerLip = lm[17];              // Alt dudak alt noktası
      const chin     = lm[152];             // Çene ucu
      const forehead = lm[10];              // Alın noktası

      if (!nostrilL || !nostrilR || !lowerLip || !chin || !forehead) return;

      // ── Color Selection ─────────────────────────────────────────────
      const isGold = options.colorMode === 'gold';
      const strokeColor = isGold ? '#FFD700' : '#000000';
      const lw = options.lineWidth || 4.5;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = lw;
      ctx.strokeStyle = strokeColor;

      // ── Face Orientation Vector (Calculates head tilt angle) ────────
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const faceLen = Math.hypot(dx, dy) || 1;

      // Unit vector pointing straight down along the face vertical axis
      const dirX = dx / faceLen;
      const dirY = dy / faceLen;

      // Distance from nostril down to the bottom boundary (below lower lip)
      const goateeHeight = Math.abs(lowerLip.y - nostrilL.y) + Math.abs(chin.y - lowerLip.y) * 0.35;

      // Top-Left (Sol burun kanadı)
      const topLeftX = nostrilL.x;
      const topLeftY = nostrilL.y;

      // Bottom-Left (Sol çizgi sonu)
      const bottomLeftX = nostrilL.x + dirX * goateeHeight;
      const bottomLeftY = nostrilL.y + dirY * goateeHeight;

      // Top-Right (Sağ burun kanadı)
      const topRightX = nostrilR.x;
      const topRightY = nostrilR.y;

      // Bottom-Right (Sağ çizgi sonu)
      const bottomRightX = nostrilR.x + dirX * goateeHeight;
      const bottomRightY = nostrilR.y + dirY * goateeHeight;

      // ── [A] SOL DİKEY ÇİZGİ (Burun kanadından yüz aksı boyunca aşağı) ────
      ctx.beginPath();
      ctx.moveTo(topLeftX, topLeftY);
      ctx.lineTo(bottomLeftX, bottomLeftY);
      ctx.stroke();

      // ── [A] SAĞ DİKEY ÇİZGİ (Burun kanadından yüz aksı boyunca aşağı) ────
      ctx.beginPath();
      ctx.moveTo(topRightX, topRightY);
      ctx.lineTo(bottomRightX, bottomRightY);
      ctx.stroke();

      // ── [B] ALT YATAY ÇİZGİ (İki dikey halkanın alt uçlarını birleştirir) ──
      ctx.beginPath();
      ctx.moveTo(bottomLeftX, bottomLeftY);
      ctx.lineTo(bottomRightX, bottomRightY);
      ctx.stroke();

      // ── [C] BOYUN KAVİS ÇİZGİSİ (Adem Elmasının 2 Parmak Üstü) ─────────
      const neckDist = faceLen * 0.15;
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        const px = pt.x + dirX * neckDist;
        const py = pt.y + dirY * neckDist;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.restore();
    }
  }
];
