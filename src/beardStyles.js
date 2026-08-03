/* ==========================================================================
   TRIMLY.AR - 3B Yüz Dönüşüne %100 Uyumlu AR Çizgi Motoru (3D Mesh Snapped)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Kafanın 3B dönme ve eğilme hareketlerine %100 yapışan, ağzı kapatmayan gerçekçi berber çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // MediaPipe 3D Landmark Indices
      // Bıyık üstü: 164, 0, 37, 39, 267, 269
      // Sol bıyık & yanak: 61, 186, 57, 216, 148
      // Sağ bıyık & yanak: 291, 410, 287, 436, 377
      // Çene ucu: 152, 175, 200
      // Çene kemiği halkası: 172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 1. KEÇİ SAKALI DIŞ KONTUR HATTI (3B Nokta Nokta Yüze Yapışan Çizgi)
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37'; // Mat Berber Altını

      // Bıyık Üst Sınırı + Sol/Sağ Yanak İnişi + Çene Altı Birleşimi
      const goateeIndices = [
        61, 186, 57, 216, 148, 176, 152, 378, 377, 436, 287, 410, 291, 0, 164
      ];

      draw3DMeshPath(ctx, lm, goateeIndices, true);
      ctx.stroke();

      // Bıyık Üst Çizgisi
      const mustacheTopIndices = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#D4AF37';
      draw3DMeshPath(ctx, lm, mustacheTopIndices, false);
      ctx.stroke();

      // 2. ADEM ELMASI ÜSTÜ BOYUN ÇİZGİSİ (Kafa Dönüşüne Tam Uyumlu 3B Kavis)
      // Çene kemiği landmark'larını başın yönüne göre aşağı offsetleyerek çiziyoruz
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];
      
      // Kafa eğim ve uzaklık vektörü
      const forehead = lm[10];
      const chin = lm[152];
      const vecX = (chin.x - forehead.x) * 0.14;
      const vecY = (chin.y - forehead.y) * 0.14;

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F7F4EB'; // Krem Beyaz Net Boyun Hattı

      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;
        const px = pt.x + vecX;
        const py = pt.y + vecY;
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
    description: 'Yüz kemiklerine oturan doğal yanak ve boyun çizgisi.',
    icon: 'sparkles',
    drawGuide: (ctx, lm, options) => {
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      // Sol Yanak 3B Çizgisi (Kulağın yanından ağız kenarına)
      const leftCheekIndices = [234, 93, 132, 58, 172, 136, 150, 61];
      draw3DMeshPath(ctx, lm, leftCheekIndices, false);
      ctx.stroke();

      // Sağ Yanak 3B Çizgisi
      const rightCheekIndices = [454, 323, 361, 288, 397, 365, 379, 291];
      draw3DMeshPath(ctx, lm, rightCheekIndices, false);
      ctx.stroke();

      // Boyun Çizgisi
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

// Helper: MediaPipe 3D Landmark Noktalarını Birleştirip Path Çizen Fonksiyon
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
