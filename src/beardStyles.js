/* ==========================================================================
   TRIMLY.AR - Doğal Genişlikte Ray-Traced Sakal Engine'i
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Ağız kenarlarını sıkıştırmayan, burun kanadından çeneye doğal genişleyen simetrik sakal.',
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

      // ----------------------------------------------------------------------
      // 1. AĞIZ KENARLARININ DIŞINA DOĞAL GENİŞLEYEN IŞIN HESABI (No Pinching!)
      // ----------------------------------------------------------------------
      const mouthWidth = Math.abs(mouthR.x - mouthL.x);
      const outerMargin = Math.max(18, mouthWidth * 0.35); // Ağız dışı rahat marj

      // Bıyık Üst Sol / Sağ Sınır Noktaları (Burun Kanadının Dışında)
      const topLeftX = Math.min(nostrilL.x, mouthL.x - outerMargin * 0.6);
      const topRightX = Math.max(nostrilR.x, mouthR.x + outerMargin * 0.6);

      // Yanak İniş Noktaları (Ağız kenarlarının rahatça DIŞINDA)
      const midLeftX = mouthL.x - outerMargin;
      const midRightX = mouthR.x + outerMargin;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 2. REFERANS KESİK HİZALAMA ÇİZGİLERİ [A]
      // ----------------------------------------------------------------------
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(247, 244, 235, 0.45)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(topLeftX, nostrilL.y);
      ctx.lineTo(midLeftX, chin.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(topRightX, nostrilR.y);
      ctx.lineTo(midRightX, chin.y);
      ctx.stroke();
      ctx.restore();

      // ----------------------------------------------------------------------
      // 3. KEÇİ SAKALI KONTUR HATTI (Dudakları Daraltmayan Rahat Form)
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37'; // Mat Berber Altını

      ctx.beginPath();
      // Bıyık Üst Çizgisi
      ctx.moveTo(topLeftX, nBase.y - 2);
      ctx.lineTo(topRightX, nBase.y - 2);

      // Sağ Yanak İnişi (Ağız Kenarının Dışından Çene Kemiğine)
      ctx.quadraticCurveTo(midRightX, mouthR.y, jawR.x, jawR.y);

      // Çene Altı Kavis Birleşimi
      ctx.quadraticCurveTo(chin.x, chin.y + 10, jawL.x, jawL.y);

      // Sol Yanak Yükselişi (Çene Kemiğinden Ağız Kenarının Dışına)
      ctx.quadraticCurveTo(midLeftX, mouthL.y, topLeftX, nBase.y - 2);
      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 4. ADEM ELMASI ÜSTÜ BOYUN KAVİSİ (Çenenin Tam Altında)
      // ----------------------------------------------------------------------
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const vecX = (chin.x - lm[10].x) * 0.14;
      const vecY = (chin.y - lm[10].y) * 0.14;

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F7F4EB';
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
  },
  {
    id: 'stubble',
    name: 'Kirli Sakal (Stubble)',
    description: 'Yüz kemiklerine oturan doğal yanak ve boyun çizgisi.',
    icon: 'sparkles',
    drawGuide: (ctx, lm, options) => {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      const leftCheekIndices = [234, 93, 132, 58, 172, 136, 150, 61];
      draw3DMeshPath(ctx, lm, leftCheekIndices, false);
      ctx.stroke();

      const rightCheekIndices = [454, 323, 361, 288, 397, 365, 379, 291];
      draw3DMeshPath(ctx, lm, rightCheekIndices, false);
      ctx.stroke();

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const vecX = (lm[152].x - lm[10].x) * 0.12;
      const vecY = (lm[152].y - lm[10].y) * 0.12;

      ctx.strokeStyle = '#F7F4EB';
      ctx.lineWidth = 2.5;
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
  },
  {
    id: 'fullbeard',
    name: 'Full Sakal Çizgisi',
    description: 'Yanak ve alt boyun sınır rehberi.',
    icon: 'user-check',
    drawGuide: (ctx, lm, options) => {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#F7F4EB';

      const leftCheek = [234, 116, 117, 118, 100, 186, 57, 61];
      const rightCheek = [454, 345, 346, 347, 329, 410, 287, 291];

      draw3DMeshPath(ctx, lm, leftCheek, false);
      ctx.stroke();
      draw3DMeshPath(ctx, lm, rightCheek, false);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'balbo',
    name: 'Balbo & Bıyık',
    description: 'Çene ve bıyık ayrım hatları.',
    icon: 'scissors',
    drawGuide: (ctx, lm, options) => {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      const mustache = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
      draw3DMeshPath(ctx, lm, mustache, false);
      ctx.stroke();

      const chinT = [186, 57, 148, 176, 152, 378, 377, 287, 410];
      draw3DMeshPath(ctx, lm, chinT, false);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'chinstrap',
    name: 'Çene Şeridi',
    description: 'Çene kemiğine oturan bant.',
    icon: 'shield',
    drawGuide: (ctx, lm, options) => {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      const chinstrap = [234, 172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397, 454];
      draw3DMeshPath(ctx, lm, chinstrap, false);
      ctx.stroke();

      ctx.restore();
    }
  }
];

function draw3DMeshPath(ctx, lm, indices, isClosed = false) {
  ctx.beginPath();
  let started = false;

  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const pt = lm[idx];
    if (!pt) continue;

    if (!started) {
      ctx.moveTo(pt.x, pt.y);
      started = true;
    } else {
      ctx.lineTo(pt.x, pt.y);
    }
  }

  if (isClosed) {
    ctx.closePath();
  }
}
