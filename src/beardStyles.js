/* ==========================================================================
   TRIMLY.AR - Ultra-Stilize, Keskin ve Basit Berber Çizgi Engine'i
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Sıfır titreme ile cilde tam oturan yüksek görünürlüklü sade keçi sakalı kılavuzu.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const nostrilL = lm[102] || lm[49];
      const nostrilR = lm[331] || lm[279];
      const mouthL = lm[61];
      const mouthR = lm[291];
      const nBase = lm[2];
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];

      if (!nostrilL || !nostrilR || !mouthL || !mouthR) return;

      const mouthWidth = Math.abs(mouthR.x - mouthL.x);
      const margin = Math.max(16, mouthWidth * 0.32);

      const topLeftX = Math.min(nostrilL.x, mouthL.x - margin * 0.5);
      const topRightX = Math.max(nostrilR.x, mouthR.x + margin * 0.5);
      const midLeftX = mouthL.x - margin;
      const midRightX = mouthR.x + margin;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. ANA KEÇİ SAKALI ÇİZGİSİ (Yüksek Görünürlüklü Berber Altını)
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = '#FFD700'; // Yüksek Görünürlüklü Parlak Altın

      ctx.beginPath();
      // Bıyık Üst Çizgisi
      ctx.moveTo(topLeftX, nBase.y - 2);
      ctx.lineTo(topRightX, nBase.y - 2);

      // Sağ Yanak İnişi
      ctx.quadraticCurveTo(midRightX, mouthR.y, jawR.x, jawR.y);

      // Çene Altı Kavis Birleşimi
      ctx.quadraticCurveTo(chin.x, chin.y + 10, jawL.x, jawL.y);

      // Sol Yanak Yükselişi
      ctx.quadraticCurveTo(midLeftX, mouthL.y, topLeftX, nBase.y - 2);
      ctx.closePath();
      ctx.stroke();

      // 2. TEMİZ BOYUN ÇİZGİSİ (Yüksek Kontrastlı Beyaz Hat)
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      const vecX = (chin.x - lm[10].x) * 0.14;
      const vecY = (chin.y - lm[10].y) * 0.14;

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#FFFFFF'; // Keskin Net Beyaz

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
