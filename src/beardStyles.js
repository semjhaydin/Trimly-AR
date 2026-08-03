/* ==========================================================================
   TRIMLY.AR - Burun Kanadından Dudak Kenarına Işın İzleme (Ray Tracing) Sakal Engine'i
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Ray-Traced Master Goatee)',
    description: 'Burun kanadından dudak kenarlarına uzanan ışınların çenede birleşmesiyle oluşan kusursuz simetrik keçi sakalı.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // ----------------------------------------------------------------------
      // 1. BURUN KANADINDAN DUDAK KENARINA IŞIN (RAY TRACING) GEOMETRİSİ
      // ----------------------------------------------------------------------
      const nostrilL = lm[102] || lm[49];  // Sol Burun Kanadı
      const nostrilR = lm[331] || lm[279]; // Sağ Burun Kanadı
      const mouthL = lm[61];               // Sol Dudak Kenarı
      const mouthR = lm[291];              // Sağ Dudak Kenarı
      const nBase = lm[2];                 // Burun Tabanı
      const chin = lm[152];                // Çene Ucu

      if (!nostrilL || !nostrilR || !mouthL || !mouthR) return;

      // Sol Işın Vektörü (Burun Kanadından Dudak Kenarına Doğru İnen Işın)
      const rayLVectorX = mouthL.x - nostrilL.x;
      const rayLVectorY = mouthL.y - nostrilL.y;

      // Sağ Işın Vektörü
      const rayRVectorX = mouthR.x - nostrilR.x;
      const rayRVectorY = mouthR.y - nostrilR.y;

      // Işınların Devam Ederek Çeneye İnen Kesim Noktaları (Ray Extension to Jaw)
      const rayExtendScale = 1.75; // Işının çene hattına kadar uzama katsayısı
      const jawIntersectL = {
        x: nostrilL.x + rayLVectorX * rayExtendScale,
        y: nostrilL.y + rayLVectorY * rayExtendScale
      };
      const jawIntersectR = {
        x: nostrilR.x + rayRVectorX * rayExtendScale,
        y: nostrilR.y + rayRVectorY * rayExtendScale
      };

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 2. REFERANS IŞIN ÇİZGİLERİ (Nostril -> Mouth -> Jaw Ray Visualizers)
      // ----------------------------------------------------------------------
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(247, 244, 235, 0.45)';
      ctx.lineWidth = 1.5;

      // Sol Işın
      ctx.beginPath();
      ctx.moveTo(nostrilL.x, nostrilL.y);
      ctx.lineTo(jawIntersectL.x, jawIntersectL.y);
      ctx.stroke();

      // Sağ Işın
      ctx.beginPath();
      ctx.moveTo(nostrilR.x, nostrilR.y);
      ctx.lineTo(jawIntersectR.x, jawIntersectR.y);
      ctx.stroke();
      ctx.restore();

      // ----------------------------------------------------------------------
      // 3. IŞINLARIN ÇENEDE OLUŞTURDUĞU MÜKEMMEL GOATEE ÇİZGİSİ
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37'; // Mat Berber Altını

      ctx.beginPath();
      // Burun altından Bıyık Üst Sınırı boyunca başla
      ctx.moveTo(nostrilL.x, nBase.y - 2);
      ctx.lineTo(nostrilR.x, nBase.y - 2);

      // Sağ Işın Hattını Takip Et (Burun Kanadı -> Dudak Kenarı -> Çene Noktası)
      ctx.lineTo(mouthR.x + (mouthR.x - nostrilR.x) * 0.2, mouthR.y);
      ctx.lineTo(jawIntersectR.x, jawIntersectR.y);

      // Çenede Işınların Birleştiği Alt Kavis (Çene Altı Birleşimi)
      ctx.quadraticCurveTo(chin.x, chin.y + 6, jawIntersectL.x, jawIntersectL.y);

      // Sol Işın Hattını Takip Et (Çene Noktası -> Dudak Kenarı -> Burun Kanadı)
      ctx.lineTo(mouthL.x - (nostrilL.x - mouthL.x) * 0.2, mouthL.y);
      ctx.lineTo(nostrilL.x, nBase.y - 2);
      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 4. ADEM ELMASI ÜSTÜ BOYUN KAVİSİ (3B Dönüş Uyumlu)
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
