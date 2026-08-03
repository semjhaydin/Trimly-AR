/* ==========================================================================
   TRIMLY.AR - Anatomik Doğru 3B Sakal Kılavuz Engine'i (Full Goatee Volume)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Dudakları boğmayan, tam çene hacmini kaplayan, Adem elması boyun kurallı profesyonel keçi sakalı.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const forehead = lm[10];
      const nBase = lm[2];
      const nostrilL = lm[102] || lm[49];
      const nostrilR = lm[331] || lm[279];
      const mouthL = lm[61];
      const mouthR = lm[291];
      const jawL = lm[148];
      const jawR = lm[377];
      const chin = lm[152];

      if (!forehead || !nBase || !mouthL || !mouthR || !jawL || !jawR || !chin) return;

      // Color palette selection based on user preference
      const isBlack = options.colorMode === 'black';
      const mainColor = isBlack ? '#000000' : '#FFD700';
      const secColor = isBlack ? '#000000' : '#FFFFFF';

      // ----------------------------------------------------------------------
      // 1. ANATOMİK DOKU VE HACİM HESAPLAMASI (Geniş Çene & Rahat Dudak Marjı)
      // ----------------------------------------------------------------------
      const mouthWidth = Math.abs(mouthR.x - mouthL.x);
      const outerMargin = Math.max(18, mouthWidth * 0.38); // Ağız kenarlarından dışa rahat mesafe

      // Bıyık Üst Sınırı (Burun tabanı hizası)
      const mustacheLeftX = Math.min(nostrilL.x, mouthL.x - outerMargin * 0.6);
      const mustacheRightX = Math.max(nostrilR.x, mouthR.x + outerMargin * 0.6);

      // Yanak Dış Kontur Noktaları
      const cheekOuterLeftX = mouthL.x - outerMargin;
      const cheekOuterRightX = mouthR.x + outerMargin;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 2. REFERANS KESİK HİZALAMA IŞINLARI [A] (Nostril -> Mouth -> Jaw Alignment)
      // ----------------------------------------------------------------------
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = isBlack ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = Math.max(1.5, (options.lineWidth || 4) * 0.4);

      ctx.beginPath();
      ctx.moveTo(mustacheLeftX, nostrilL.y);
      ctx.lineTo(cheekOuterLeftX, chin.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mustacheRightX, nostrilR.y);
      ctx.lineTo(cheekOuterRightX, chin.y);
      ctx.stroke();
      ctx.restore();

      // ----------------------------------------------------------------------
      // 3. RENK KODLU KESİM HARİTASI (İsteğe Bağlı Bölge Modu)
      // ----------------------------------------------------------------------
      if (options.zoneMode) {
        ctx.fillStyle = isBlack ? 'rgba(0, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.15)';
        ctx.beginPath();
        ctx.moveTo(mustacheLeftX, nBase.y - 2);
        ctx.lineTo(mustacheRightX, nBase.y - 2);
        ctx.quadraticCurveTo(cheekOuterRightX, mouthR.y, jawR.x, jawR.y);
        ctx.quadraticCurveTo(chin.x, chin.y + 12, jawL.x, jawL.y);
        ctx.quadraticCurveTo(cheekOuterLeftX, mouthL.y, mustacheLeftX, nBase.y - 2);
        ctx.closePath();
        ctx.fill();
      }

      // ----------------------------------------------------------------------
      // 4. MÜKEMMEL KEÇİ SAKALI ANA KONTUR HATI (Geniş Çene Gövdesi)
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = mainColor;

      ctx.beginPath();
      // Bıyık Üst Çizgisi
      ctx.moveTo(mustacheLeftX, nBase.y - 2);
      ctx.lineTo(mustacheRightX, nBase.y - 2);

      // Sağ Yanak İnişi (Dudak kenarının dışından genişçe geçer)
      ctx.quadraticCurveTo(cheekOuterRightX, mouthR.y, jawR.x, jawR.y);

      // Çene Altı Dolgun Kavis Birleşimi (Tüm çene genişliğini kaplar)
      ctx.quadraticCurveTo(chin.x, chin.y + 12, jawL.x, jawL.y);

      // Sol Yanak Yükselişi
      ctx.quadraticCurveTo(cheekOuterLeftX, mouthL.y, mustacheLeftX, nBase.y - 2);
      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 5. ADEM ELMASI ÜSTÜ 3B BOYUN ÇİZGİSİ [C] (3B Kafa Yönelimli Vektör)
      // ----------------------------------------------------------------------
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const faceLen = Math.hypot(dx, dy) || 1;

      const unitDirX = dx / faceLen;
      const unitDirY = dy / faceLen;
      const neckOffsetDist = faceLen * 0.15; // Adem elmasının 2 parmak yukarısı

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.lineWidth = Math.max(3, (options.lineWidth || 4) * 0.85);
      ctx.strokeStyle = secColor;

      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        const px = pt.x + unitDirX * neckOffsetDist;
        const py = pt.y + unitDirY * neckOffsetDist;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'stubble',
    name: 'Kirli Sakal (Stubble)',
    description: 'Yanak kemiği ve boyun kavis hattını vurgulayan doğal berber çizgisi.',
    icon: 'sparkles',
    drawGuide: (ctx, lm, options) => {
      const isBlack = options.colorMode === 'black';
      const mainColor = isBlack ? '#000000' : '#FFD700';
      const secColor = isBlack ? '#000000' : '#FFFFFF';

      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const forehead = lm[10];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = mainColor;

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 8);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 14 + options.cheekOffset, mL.x - 6, mL.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 8);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 14 + options.cheekOffset, mR.x + 6, mR.y);
      ctx.stroke();

      // 3D Neck Projection
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const faceLen = Math.hypot(dx, dy) || 1;
      const unitDirX = dx / faceLen;
      const unitDirY = dy / faceLen;
      const neckOffsetDist = faceLen * 0.13;

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.strokeStyle = secColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        const px = pt.x + unitDirX * neckOffsetDist;
        const py = pt.y + unitDirY * neckOffsetDist;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
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
      const isBlack = options.colorMode === 'black';
      const mainColor = isBlack ? '#000000' : '#FFFFFF';

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = mainColor;

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
      const isBlack = options.colorMode === 'black';
      const mainColor = isBlack ? '#000000' : '#FFD700';

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = mainColor;

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
      const isBlack = options.colorMode === 'black';
      const mainColor = isBlack ? '#000000' : '#FFD700';

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 4;
      ctx.strokeStyle = mainColor;

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
