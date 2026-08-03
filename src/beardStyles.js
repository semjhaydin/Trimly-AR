/* ==========================================================================
   TRIMLY.AR - Real Simple Classic Goatee (KISS Principle)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Klasik Keçi Sakalı (Classic Goatee)',
    description: 'Sadece temiz, sade ve zarif keçi sakalı konturu ve boyun çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const mL = lm[61];   // Sol dudak kenarı
      const mR = lm[291];  // Sağ dudak kenarı
      const nBase = lm[2]; // Burun altı / Bıyık üstü
      const chin = lm[152];// Çene ucu
      const jawL = lm[148];// Sol çene kemiği
      const jawR = lm[377];// Sağ çene kemiği

      if (!mL || !mR || !nBase || !chin || !jawL || !jawR) return;

      const isGold = options.colorMode === 'gold';
      const strokeColor = isGold ? '#FFD700' : '#000000';
      const lw = options.lineWidth || 4;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 1. TEMİZ VE SADE KEÇİ SAKALI KONTURU (Simple Elegant Loop)
      // ----------------------------------------------------------------------
      ctx.lineWidth = lw;
      ctx.strokeStyle = strokeColor;

      const mouthWidth = Math.abs(mR.x - mL.x);
      const outerOffset = Math.max(14, mouthWidth * 0.3);

      ctx.beginPath();
      // Bıyık Üstü
      ctx.moveTo(mL.x - outerOffset * 0.5, nBase.y);
      ctx.lineTo(mR.x + outerOffset * 0.5, nBase.y);
      // Sağ Yanak İnişi
      ctx.quadraticCurveTo(mR.x + outerOffset, mR.y, jawR.x, jawR.y);
      // Çene Altı Kavis
      ctx.quadraticCurveTo(chin.x, chin.y + 10, jawL.x, jawL.y);
      // Sol Yanak Yükselişi
      ctx.quadraticCurveTo(mL.x - outerOffset, mL.y, mL.x - outerOffset * 0.5, nBase.y);
      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 2. TEMİZ BOYUN ÇİZGİSİ (Simple Neck Arc)
      // ----------------------------------------------------------------------
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const neckOffset = Math.abs(chin.y - lm[10].y) * 0.14;

      ctx.lineWidth = Math.max(3, lw * 0.85);
      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        if (i === 0) ctx.moveTo(pt.x, pt.y + neckOffset);
        else ctx.lineTo(pt.x, pt.y + neckOffset);
      });
      ctx.stroke();

      ctx.restore();
    }
  }
];
