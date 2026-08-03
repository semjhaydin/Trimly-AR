/* ==========================================================================
   TRIMLY.AR - Birebir Kullanıcı Çizimi 3-Parça Siyah Tıraş Rehberi
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Sadece 3 net siyah çizgi: Sol ışın, sağ ışın ve adem elması boyun çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const nostrilL = lm[102] || lm[49];  // Sol Burun Kanadı
      const nostrilR = lm[331] || lm[279]; // Sağ Burun Kanadı
      const mouthL = lm[61];               // Sol Dudak Kenarı
      const mouthR = lm[291];              // Sağ Dudak Kenarı
      const jawL = lm[148];                // Sol Çene Noktası
      const jawR = lm[377];                // Sağ Çene Noktası
      const chin = lm[152];                // Çene Ucu

      if (!nostrilL || !nostrilR || !mouthL || !mouthR || !jawL || !jawR) return;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = options.lineWidth || 4.5;
      ctx.strokeStyle = '#000000'; // Net Siyah Çizgi

      // ----------------------------------------------------------------------
      // 1. SOL IŞIN ÇİZGİSİ: Sol Burun Kanadı -> Sol Ağız Kenarı -> Sol Çene
      // ----------------------------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(nostrilL.x, nostrilL.y);
      ctx.lineTo(mouthL.x - Math.abs(nostrilL.x - mouthL.x) * 0.25, mouthL.y);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 2. SAĞ IŞIN ÇİZGİSİ: Sağ Burun Kanadı -> Sağ Ağız Kenarı -> Sağ Çene
      // ----------------------------------------------------------------------
      ctx.beginPath();
      ctx.moveTo(nostrilR.x, nostrilR.y);
      ctx.lineTo(mouthR.x + Math.abs(nostrilR.x - mouthR.x) * 0.25, mouthR.y);
      ctx.lineTo(jawR.x, jawR.y);
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 3. BOYUN KAVİS ÇİZGİSİ: Adem Elması Üstü Kavis (Çene Altı Boyun Alanı)
      // ----------------------------------------------------------------------
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const faceLength = Math.abs(chin.y - lm[10].y);
      const neckOffset = faceLength * 0.13; // Çene altına oturan boyun mesafesi

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
