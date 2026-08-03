/* ==========================================================================
   TRIMLY.AR - Sadece Siyah Çizgili Mükemmel Keçi Sakalı Rehberi
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Burun kanadından inen dikey siyah ışınlar ve çene altı siyah boyun kuralı.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const nostrilL = lm[102] || lm[49];  // Sol Burun Kanadı
      const nostrilR = lm[331] || lm[279]; // Sağ Burun Kanadı
      const mouthL = lm[61];               // Sol Dudak Kenarı
      const mouthR = lm[291];              // Sağ Dudak Kenarı
      const nBase = lm[2];                 // Burun Tabanı
      const chin = lm[152];                // Çene Ucu
      const jawL = lm[148];                // Sol Çene Noktası
      const jawR = lm[377];                // Sağ Çene Noktası

      if (!nostrilL || !nostrilR || !mouthL || !mouthR) return;

      const mouthWidth = Math.abs(mouthR.x - mouthL.x);
      const outerFlaring = mouthWidth * 0.38;

      const topLeftX = nostrilL.x;
      const topRightX = nostrilR.x;
      const outerCheekLeftX = mouthL.x - outerFlaring;
      const outerCheekRightX = mouthR.x + outerFlaring;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 1. DİKEY BAKIŞ VE YANAK KILAVUZ SİYAH ÇİZGİLERİ [A]
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#000000'; // Net Siyah Çizgi

      // Sol Siyah Işın
      ctx.beginPath();
      ctx.moveTo(topLeftX, nostrilL.y);
      ctx.lineTo(outerCheekLeftX, chin.y);
      ctx.stroke();

      // Sağ Siyah Işın
      ctx.beginPath();
      ctx.moveTo(topRightX, nostrilR.y);
      ctx.lineTo(outerCheekRightX, chin.y);
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 2. ADEM ELMASI ÜSTÜ SİYAH BOYUN KAVİSİ [C]
      // ----------------------------------------------------------------------
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const vecX = (chin.x - lm[10].x) * 0.14;
      const vecY = (chin.y - lm[10].y) * 0.14;

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#000000'; // Net Siyah Çizgi

      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        if (i === 0) ctx.moveTo(pt.x + vecX, pt.y + vecY);
        else ctx.lineTo(pt.x + vecX, pt.y + vecY);
      });
      ctx.stroke();

      ctx.restore();
    }
  }
];
