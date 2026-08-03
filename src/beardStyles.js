/* ==========================================================================
   TRIMLY.AR - 3B Mesh Tabanlı Devrimsel Tıraş Rehberi (Zero-Crash, Full Width)
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: '3B yüz ağından beslenen, kafa eğilmelerinde kırılmayan tam genişlikte keçi sakalı.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      const forehead = lm[10];
      const chin = lm[152];
      const nBase = lm[2];

      if (!forehead || !chin || !nBase) return;

      const isGold = options.colorMode === 'gold';
      const strokeColor = isGold ? '#FFD700' : '#000000';
      const lw = options.lineWidth || 4.5;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = lw;
      ctx.strokeStyle = strokeColor;

      // ----------------------------------------------------------------------
      // 1. TAM GENİŞLİKTE 3B KEÇİ SAKALI KONTURU (Goatee Loop via 3D Mesh)
      // ----------------------------------------------------------------------
      // Yüzün 3B noktaları doğrudan kullanıldığı için kafa eğildiğinde %100 kusursuz döner!
      // Bıyık üstü (102 -> 2 -> 331), Sağ Yanak (410, 287, 436), Çene (377, 378, 152, 176, 148), Sol Yanak (216, 57, 186)
      const goatee3DPath = [
        102, 2, 331,  // Bıyık üstü geniş hat
        410, 287, 436, // Sağ yanak rahat dış marjı
        377, 378, 152, 176, 148, // Dolgun çene alt kavis birleşimi
        216, 57, 186   // Sol yanak rahat dış marjı
      ];

      ctx.beginPath();
      let started = false;
      for (let i = 0; i < goatee3DPath.length; i++) {
        const idx = goatee3DPath[i];
        const pt = lm[idx];
        if (!pt) continue;

        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.closePath();
      ctx.stroke();

      // ----------------------------------------------------------------------
      // 2. KAFA EĞİLMELERİNE TAM DÖNÜŞLÜ 3B BOYUN ÇİZGİSİ (Rotated 3D Neck Arc)
      // ----------------------------------------------------------------------
      const dx = chin.x - forehead.x;
      const dy = chin.y - forehead.y;
      const faceLen = Math.hypot(dx, dy) || 1;

      // Kafa eğim açısı birim vektörü (Kafa sağa/sola yattığında vektör de yatar)
      const unitDirX = dx / faceLen;
      const unitDirY = dy / faceLen;
      const neckDist = faceLen * 0.15; // Adem elması üstü mesafe

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

      ctx.lineWidth = Math.max(3, lw * 0.85);
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
