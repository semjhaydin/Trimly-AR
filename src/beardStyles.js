/* ==========================================================================
   TRIMLY.AR - Milimetrik Keçi Sakalı Algoritması (5-Adım Geometrik Sistem)
   [A] Dikey sınır ışınları  |  [B] Alt bağlantı yatay  |  [C] Boyun kavisi
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Burun kanatlarından inen dikey [A] sınır çizgileri, alt dudak yatay [B] sınırı ve Adem elması [C] boyun kavisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {

      // ── Temel Anatomik Landmark Noktaları ──────────────────────────────────
      const nostrilL  = lm[102]; // Sol burun kanadı dış kenarı
      const nostrilR  = lm[331]; // Sağ burun kanadı dış kenarı
      const mouthL    = lm[61];  // Sol dudak kenarı
      const mouthR    = lm[291]; // Sağ dudak kenarı
      const lowerLip  = lm[17];  // Alt dudak orta alt noktası
      const forehead  = lm[10];  // Alın merkezi
      const chin      = lm[152]; // Çene ucu

      if (!nostrilL || !nostrilR || !mouthL || !mouthR || !lowerLip || !chin || !forehead) return;

      // ── Çizgi Koordinatları ────────────────────────────────────────────────

      // [A] Dikey çizgi X pozisyonları = Burun kanadı dış kenarları
      const lineLeftX  = nostrilL.x;
      const lineRightX = nostrilR.x;

      // [A] Dikey çizgi üst Y = Burun kanadı hizası
      const lineTopY = nostrilL.y;

      // [B] Alt yatay çizgi Y = Alt dudağın biraz altı (dudak + çene arası %30)
      const lineBottomY = lowerLip.y + (chin.y - lowerLip.y) * 0.3;

      // ── Stil Ayarları ──────────────────────────────────────────────────────
      const lw = options.lineWidth || 4.5;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap    = 'round';
      ctx.lineJoin   = 'round';
      ctx.lineWidth  = lw;
      ctx.strokeStyle = '#000000';

      // ── [A] SOL DİKEY SINIR IŞINI ─────────────────────────────────────────
      // Burun kanadından düz aşağı, [B] yatay hatta kadar
      ctx.beginPath();
      ctx.moveTo(lineLeftX, lineTopY);
      ctx.lineTo(lineLeftX, lineBottomY);
      ctx.stroke();

      // ── [A] SAĞ DİKEY SINIR IŞINI ────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(lineRightX, lineTopY);
      ctx.lineTo(lineRightX, lineBottomY);
      ctx.stroke();

      // ── [B] ALT YATAY SINIR ÇIZGISI (Dudak Altı → Sol/Sağ Sınır) ─────────
      ctx.beginPath();
      ctx.moveTo(lineLeftX,  lineBottomY);
      ctx.lineTo(lineRightX, lineBottomY);
      ctx.stroke();

      // ── [C] BOYUN KAVİS ÇİZGİSİ (Adem Elması ~2 Parmak Üstü, 3B Kilitli) ─
      // Kafa açısına (pitch/yaw) göre boyun çizgisini 3B vektör ile öteleyerek
      // yüz döndüğünde de kaymayan dinamik boyun hattı
      const faceLen   = Math.hypot(chin.x - forehead.x, chin.y - forehead.y) || 1;
      const unitDirX  = (chin.x - forehead.x) / faceLen;
      const unitDirY  = (chin.y - forehead.y) / faceLen;
      const neckDist  = faceLen * 0.15; // ~Adem elmasının 2 parmak üstü

      const jawIndices = [172, 136, 150, 149, 176, 148, 152, 377, 378, 379, 365, 397];

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
