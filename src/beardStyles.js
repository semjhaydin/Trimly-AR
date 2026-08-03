/* ==========================================================================
   TRIMLY.AR - Anatomik Doğru Keçi Sakalı (Dar Üst, Geniş Çene Tabanı)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Bıyıkta dar başlayan, çeneye doğru genişleyen %100 anatomik keçi sakalı.',
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
      // 1. ANATOMİK HİZALAMA: Üstte Dar (Burun Genişliği), Aşağıda Geniş Çene
      // ----------------------------------------------------------------------
      const mouthWidth = Math.abs(mouthR.x - mouthL.x);
      const outerFlaring = mouthWidth * 0.38; // Çeneye doğru dışa genişleme marjı

      // Bıyık Üstü (Burun Hizası - Dar ve Düzenli)
      const topLeftX = nostrilL.x;
      const topRightX = nostrilR.x;

      // Ağız Kenarı ve Çene Tabanı (Dışa Doğru Genişleyen Doğal Sakal Alanı)
      const outerCheekLeftX = mouthL.x - outerFlaring;
      const outerCheekRightX = mouthR.x + outerFlaring;
      const chinBaseLeftX = jawL.x;
      const chinBaseRightX = jawR.x;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 2. MANTIKSAL BEYAZ KESİK REFERANS IŞINLARI [A]
      // ----------------------------------------------------------------------
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;

      // Sol Referans Işını
      ctx.beginPath();
      ctx.moveTo(topLeftX, nostrilL.y);
      ctx.lineTo(outerCheekLeftX, chin.y);
      ctx.stroke();

      // Sağ Referans Işını
      ctx.beginPath();
      ctx.moveTo(topRightX, nostrilR.y);
      ctx.lineTo(outerCheekRightX, chin.y);
      ctx.stroke();
      ctx.restore();

      // ----------------------------------------------------------------------
      // 3. KEÇİ SAKALI KONTUR HATI (Üstte Dar Bıyık -> Aşağıda Geniş Çene)
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = '#FFD700'; // Parlak Berber Altını

      ctx.beginPath();
      // Bıyık Üst Çizgisi (Burun genişliğinde dar)
      ctx.moveTo(topLeftX, nBase.y - 2);
      ctx.lineTo(topRightX, nBase.y - 2);

      // Sağ Yanak İnişi (Dışa doğru genişleyerek dudak kenarından çeneye iner)
      ctx.quadraticCurveTo(outerCheekRightX, mouthR.y, chinBaseRightX, jawR.y);

      // Çene Altı Kavis Birleşimi (Geniş çene tabanı)
      ctx.quadraticCurveTo(chin.x, chin.y + 10, chinBaseLeftX, jawL.y);

      // Sol Yanak Yükselişi (Dışa geniş çeneden bıyık üstüne tırmanış)
      ctx.quadraticCurveTo(outerCheekLeftX, mouthL.y, topLeftX, nBase.y - 2);
      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 4. BOYUN TEMİZLEME ÇİZGİSİ (Net Beyaz Hat)
      // ----------------------------------------------------------------------
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const vecX = (chin.x - lm[10].x) * 0.14;
      const vecY = (chin.y - lm[10].y) * 0.14;

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#FFFFFF';

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
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = '#FFD700';

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 8);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 14 + options.cheekOffset, mL.x - 6, mL.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 8);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 14 + options.cheekOffset, mR.x + 6, mR.y);
      ctx.stroke();

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const vecX = (chin.x - lm[10].x) * 0.12;
      const vecY = (chin.y - lm[10].y) * 0.12;

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.5;
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
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = '#FFFFFF';

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
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = '#FFD700';

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
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = '#FFD700';

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
