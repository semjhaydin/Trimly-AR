/* ==========================================================================
   TRIMLY.AR - Keçi Sakalı: 2 Bağımsız Işın + Boyun Kavis
   Burun Kanadı -> Dudak Kenarı -> Çene -> devam
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: '2 bağımsız siyah ışın + adem elması boyun kavis çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // Temel Yüz Noktaları
      const nostrilL = lm[102];  // Sol burun kanadı dış kenarı
      const nostrilR = lm[331];  // Sağ burun kanadı dış kenarı
      const mouthL   = lm[61];   // Sol dudak kenarı
      const mouthR   = lm[291];  // Sağ dudak kenarı
      const jawL     = lm[172];  // Sol alt çene
      const jawR     = lm[397];  // Sağ alt çene
      const forehead = lm[10];
      const chin     = lm[152];

      if (!nostrilL || !nostrilR || !mouthL || !mouthR || !jawL || !jawR || !forehead || !chin) return;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap    = 'round';
      ctx.lineJoin   = 'round';
      ctx.lineWidth  = options.lineWidth || 4.5;
      ctx.strokeStyle = '#000000';

      // -----------------------------------------------------------------------
      // 1. SOL IŞIN: Burun Kanadı → Dudak Kenarı → Çene (tek kesintisiz çizgi)
      // -----------------------------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(nostrilL.x, nostrilL.y);   // Burun kanadı
      ctx.lineTo(mouthL.x,   mouthL.y);    // Dudak sol kenarı
      ctx.lineTo(jawL.x,     jawL.y);      // Çene sol köşesi
      ctx.stroke();

      // -----------------------------------------------------------------------
      // 2. SAĞ IŞIN: Burun Kanadı → Dudak Kenarı → Çene (tek kesintisiz çizgi)
      // -----------------------------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(nostrilR.x, nostrilR.y);   // Burun kanadı
      ctx.lineTo(mouthR.x,   mouthR.y);    // Dudak sağ kenarı
      ctx.lineTo(jawR.x,     jawR.y);      // Çene sağ köşesi
      ctx.stroke();

      // -----------------------------------------------------------------------
      // 3. BOYUN KAVİS ÇİZGİSİ (Adem Elması Üstü — 3B Kafa Vektörü ile Kilitli)
      // -----------------------------------------------------------------------
      const faceLen = Math.hypot(chin.x - forehead.x, chin.y - forehead.y) || 1;
      const unitDirX = (chin.x - forehead.x) / faceLen;
      const unitDirY = (chin.y - forehead.y) / faceLen;
      const neckDist = faceLen * 0.15; // Çene altına ~2 parmak mesafe

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.lineWidth = options.lineWidth || 4.5;
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
