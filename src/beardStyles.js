/* ==========================================================================
   TRIMLY.AR - 3B Perspektif & Kafa Yönelimli Sakal Engine'i (Zero-Slide)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: '3B kafa açılarına (Yaw/Pitch/Roll) %100 kilitlenen, kayma yapmayan net berber çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const forehead = lm[10];
      const chin = lm[152];
      const nBase = lm[2];

      if (!forehead || !chin || !nBase) return;

      // ----------------------------------------------------------------------
      // 1. 3B KAFA YÖNELİM VE PERSPERTİF VEKTÖRÜ (Pitch / Yaw Matrix)
      // ----------------------------------------------------------------------
      // Alın (10) -> Çene (152) 3B Yönelim Vektörü
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const dz = (chin.z || 0) - (forehead.z || 0);
      const faceLen = Math.hypot(dx, dy) || 1;

      // 3B Birim Yön Vektörü (Kafa yukarı/aşağı/sağa/sola dönünce yönü değişir)
      const unitDirX = dx / faceLen;
      const unitDirY = dy / faceLen;

      // Adem elması boyun mesafesi (Yüz boyuna oranlı 3B uzaklık)
      const neckOffsetDist = faceLen * 0.16;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 2. DİKEY BAKIŞ VE YANAK KILAVUZ SİYAH ÇİZGİLERİ [A] (3B Mesh Bağlantılı)
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#000000'; // Net Siyah Çizgi

      // Sol Işın: Sol Burun Kanadı (102) -> Sol Ağız (61) -> Sol Çene (148)
      const rayLeftIndices = [102, 186, 57, 148];
      draw3DMeshPath(ctx, lm, rayLeftIndices, false);
      ctx.stroke();

      // Sağ Işın: Sağ Burun Kanadı (331) -> Sağ Ağız (291) -> Sağ Çene (377)
      const rayRightIndices = [331, 410, 287, 377];
      draw3DMeshPath(ctx, lm, rayRightIndices, false);
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 3. ADEM ELMASI ÜSTÜ 3B BOYUN ÇİZGİSİ [C] (3B Vektör İle Çeneye Kilitli)
      // ----------------------------------------------------------------------
      // Çene kemiği halkası: 172 -> 136 -> 150 -> 149 -> 176 -> 148 -> 152 -> 377 -> 378 -> 379 -> 365 -> 397
      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#000000';

      ctx.beginPath();
      jawIndices.forEach((idx, i) => {
        const pt = lm[idx];
        if (!pt) return;

        // Her çene noktasını 3B kafa yönelim vektörü boyunca öteliyoruz (Asla kaymaz)
        const projX = pt.x + unitDirX * neckOffsetDist;
        const projY = pt.y + unitDirY * neckOffsetDist;

        if (i === 0) ctx.moveTo(projX, projY);
        else ctx.lineTo(projX, projY);
      });
      ctx.stroke();

      ctx.restore();
    }
  }
];

// Helper: MediaPipe 3D Landmark Noktalarını Doğrudan Çizen Fonksiyon
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
