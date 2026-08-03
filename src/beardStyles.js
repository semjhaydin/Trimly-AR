/* ==========================================================================
   TRIMLY.AR - Cilde Dövme Gibi İşlenen (Skin-Inked) AR Sakal Motoru
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Cilt dokusuna dövme gibi işlenen, burun kanadı ve boyun kuralı olan tam hat.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // Key Landmark Indices for 3D Surface Conformance
      const nostrilL = lm[102] || lm[49];
      const nostrilR = lm[331] || lm[279];
      const mL = lm[61];
      const mR = lm[291];
      const nBase = lm[2];
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];
      const neckL = lm[172];
      const neckR = lm[397];

      // Exact vertical alignment line
      const lineLeftX = nostrilL.x;
      const lineRightX = nostrilR.x;

      const faceLength = Math.abs(chin.y - lm[10].y);
      const neckOffset = faceLength * 0.085;
      const neckCenterY = chin.y + neckOffset;

      ctx.save();

      // CİLDE DÖVME GİBİ İŞLEME HARMANLAMA MODU (Skin Ink Multiply Blend)
      // Bu mod çizginin videodaki cilt dokusu ve gölgeleriyle bütünleşmesini sağlar
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // KESİM HARİTASI (Cilt Dövme Boyası)
      if (options.zoneMode) {
        // Sakal Gövdesi Koruma Boyası
        ctx.fillStyle = 'rgba(180, 140, 35, 0.35)'; // Derin Berber Altını Cilt Mürekkebi
        ctx.beginPath();
        ctx.moveTo(lineLeftX, nBase.y - 3);
        ctx.lineTo(lineRightX, nBase.y - 3);
        ctx.quadraticCurveTo(lineRightX + 8, mR.y, jawR.x, jawR.y);
        ctx.quadraticCurveTo(chin.x, neckCenterY, jawL.x, jawL.y);
        ctx.quadraticCurveTo(lineLeftX - 8, mL.y, lineLeftX, nBase.y - 3);
        ctx.closePath();
        ctx.fill();

        // Boyun & Yanak Temizleme Boyası
        ctx.fillStyle = 'rgba(180, 40, 30, 0.28)'; // Kırmızı Cilt Dövme Boyası
        ctx.beginPath();
        ctx.moveTo(neckL.x, neckL.y);
        ctx.quadraticCurveTo(chin.x, neckCenterY, neckR.x, neckR.y);
        ctx.lineTo(neckR.x, neckR.y + 40);
        ctx.lineTo(neckL.x, neckL.y + 40);
        ctx.closePath();
        ctx.fill();
      }

      // CİLDE TAM YAPIŞAN DÖVME ÇİZGİLERİ (Skin Inked Outline)
      // Çift katmanlı çizim: 1. Cilt Mürekkep Gölgesi (Inner Ink), 2. Mat Altın Kontur (Outer Stroke)
      
      // Katman 1: Cilt Altı Dövme Mürekkebi (Mat Koyu Çerçeve)
      ctx.lineWidth = (options.lineWidth || 3.5) + 2;
      ctx.strokeStyle = 'rgba(15, 12, 5, 0.85)'; // Cilde batan mat koyu mürekkep sınırı
      drawGoateePath(ctx, lineLeftX, lineRightX, nBase, mL, mR, jawL, jawR, chin, neckCenterY);
      ctx.stroke();

      // Katman 2: Cilt Üstü Dövme Çizgisi (Mat Berber Altını)
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37'; // Parlamayan Mat Berber Altını
      drawGoateePath(ctx, lineLeftX, lineRightX, nBase, mL, mR, jawL, jawR, chin, neckCenterY);
      ctx.stroke();

      // BOYUN ALT SINIR DÖVME ÇİZGİSİ [C] (Adem Elması Üstü Mat Krem)
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(20, 18, 12, 0.9)';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 6);
      ctx.quadraticCurveTo(chin.x, neckCenterY, neckR.x, neckR.y + 6);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#F7F4EB';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 6);
      ctx.quadraticCurveTo(chin.x, neckCenterY, neckR.x, neckR.y + 6);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'stubble',
    name: 'Kirli Sakal (Stubble)',
    description: 'Cilde yapışan mat yanak ve boyun çizgisi.',
    icon: 'sparkles',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

      ctx.save();
      ctx.shadowBlur = 0;

      // Sol Yanak Cilt Dövme Çizgisi
      ctx.lineWidth = (options.lineWidth || 3.5) + 1.5;
      ctx.strokeStyle = 'rgba(15, 12, 5, 0.8)';
      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 10);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 18 + options.cheekOffset, mL.x - 8, mL.y - 2);
      ctx.stroke();

      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37';
      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 10);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 18 + options.cheekOffset, mL.x - 8, mL.y - 2);
      ctx.stroke();

      // Sağ Yanak Cilt Dövme Çizgisi
      ctx.lineWidth = (options.lineWidth || 3.5) + 1.5;
      ctx.strokeStyle = 'rgba(15, 12, 5, 0.8)';
      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 10);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 18 + options.cheekOffset, mR.x + 8, mR.y - 2);
      ctx.stroke();

      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37';
      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 10);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 18 + options.cheekOffset, mR.x + 8, mR.y - 2);
      ctx.stroke();

      // Boyun Çizgisi
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#F7F4EB';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 18);
      ctx.quadraticCurveTo(chin.x, chin.y + 28, neckR.x, neckR.y + 18);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    id: 'fullbeard',
    name: 'Full Sakal Çizgisi',
    description: 'Cilde tam oturan yanak ve alt boyun sınır rehberi.',
    icon: 'user-check',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#F7F4EB';

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 5);
      ctx.lineTo(mL.x - 14, mL.y - 10 + options.cheekOffset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 5);
      ctx.lineTo(mR.x + 14, mR.y - 10 + options.cheekOffset);
      ctx.stroke();

      ctx.strokeStyle = '#C93B2B';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 24);
      ctx.quadraticCurveTo(chin.x, chin.y + 36, neckR.x, neckR.y + 24);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'balbo',
    name: 'Balbo & Bıyık',
    description: 'Cilde yapışan T-şekilli çene sakalı rehberi.',
    icon: 'scissors',
    drawGuide: (ctx, lm, options) => {
      const nBase = lm[2];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37';

      ctx.beginPath();
      ctx.moveTo(nBase.x - 20, nBase.y + 2);
      ctx.lineTo(mL.x - 6, mL.y - 6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nBase.x + 20, nBase.y + 2);
      ctx.lineTo(mR.x + 6, mR.y - 6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mL.x - 10, mL.y + 16);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 10, jawR.x, jawR.y);
      ctx.lineTo(mR.x + 10, mR.y + 16);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    id: 'chinstrap',
    name: 'Çene Şeridi',
    description: 'Çene kemiğine dövme gibi işlenen bant.',
    icon: 'shield',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const jawL = lm[148];
      const jawR = lm[377];
      const chin = lm[152];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37';

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 12);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 5, jawR.x, jawR.y);
      ctx.lineTo(earR.x, earR.y + 12);
      ctx.stroke();
      ctx.restore();
    }
  }
];

// Helper to draw Goatee path
function drawGoateePath(ctx, lineLeftX, lineRightX, nBase, mL, mR, jawL, jawR, chin, neckCenterY) {
  ctx.beginPath();
  ctx.moveTo(lineLeftX, nBase.y - 3);
  ctx.lineTo(lineRightX, nBase.y - 3);
  ctx.quadraticCurveTo(lineRightX + 8, mR.y, jawR.x, jawR.y);
  ctx.quadraticCurveTo(chin.x, neckCenterY, jawL.x, jawL.y);
  ctx.quadraticCurveTo(lineLeftX - 8, mL.y, lineLeftX, nBase.y - 3);
}
