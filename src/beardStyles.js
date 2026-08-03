/* ==========================================================================
   TRIMLY.AR - Cilde Yapışan Keskin Berber Çizgisi & Boyun Haritası Engine'i
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Cilde tam yapışan dikey hizalama ve Adem elması boyun sınırı.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // ----------------------------------------------------------------------
      // 1. ANATOMİK HİZALAMA NOKTALARI (Cilde Tam Oturan Referanslar)
      // ----------------------------------------------------------------------
      const nostrilL = lm[102] || lm[49]; // Sol burun kanadı
      const nostrilR = lm[331] || lm[279]; // Sağ burun kanadı
      const mL = lm[61];   // Sol dudak kenarı
      const mR = lm[291]; // Sağ dudak kenarı
      const nBase = lm[2]; // Burun alt tabanı
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];
      const neckL = lm[172];
      const neckR = lm[397];

      // Dikey Sınır Hatları [A] (Ağız kenarının ~0.8cm dışı)
      const lineLeftX = nostrilL.x;
      const lineRightX = nostrilR.x;

      // Boyun Alt Sınırı [C] (Adem Elmasının 2 Parmak / 2.5cm Üstü)
      const faceLength = Math.abs(chin.y - lm[10].y);
      const neckOffset = faceLength * 0.085; // Hassas boyun kıvrım mesafesi
      const neckCenterY = chin.y + neckOffset;

      // ----------------------------------------------------------------------
      // 2. CİLDE YAPIŞAN KESKİN BERBER ÇİZGİLERİ (Hologram Gölgesi Sıfırlandı)
      // ----------------------------------------------------------------------
      ctx.shadowBlur = 0; // Hologram etkisini kaldır, cilde yapıştır
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // KESİM BÖLGELERİ (Cilt Boyası Gibi Mat Dolgu)
      if (options.zoneMode) {
        // [KORUNACAK SAKAL GÖVDESİ]
        ctx.fillStyle = 'rgba(212, 175, 55, 0.22)';
        ctx.beginPath();
        ctx.moveTo(lineLeftX, nBase.y - 3);
        ctx.lineTo(lineRightX, nBase.y - 3);
        ctx.quadraticCurveTo(lineRightX + 10, mL.y, jawR.x, jawR.y);
        ctx.quadraticCurveTo(chin.x, neckCenterY, jawL.x, jawL.y);
        ctx.quadraticCurveTo(lineLeftX - 10, mL.y, lineLeftX, nBase.y - 3);
        ctx.closePath();
        ctx.fill();

        // [TEMİZLENECEK BOYUN & YANAK ALANI]
        ctx.fillStyle = 'rgba(201, 59, 43, 0.18)'; // Kırmızı Temizlik Alanı
        // Boyun Altı Temizlenecek Kısım
        ctx.beginPath();
        ctx.moveTo(neckL.x, neckL.y);
        ctx.quadraticCurveTo(chin.x, neckCenterY, neckR.x, neckR.y);
        ctx.lineTo(neckR.x, neckR.y + 50);
        ctx.lineTo(neckL.x, neckL.y + 50);
        ctx.closePath();
        ctx.fill();
      }

      // ANA KESİM HATTI (Keskin Berber Kalemi Çizgisi)
      ctx.strokeStyle = '#D4AF37'; // Mat Altın Berber Çizgisi

      ctx.beginPath();
      // Bıyık Üst Sınırı
      ctx.moveTo(lineLeftX, nBase.y - 3);
      ctx.lineTo(lineRightX, nBase.y - 3);
      // Sağ Yanak & Bıyık Dış Hattı
      ctx.quadraticCurveTo(lineRightX + 10, mR.y, jawR.x, jawR.y);
      // ÇENE ALTI BOYUN KAVRUMU [C] (Tam çene kemiğine oturan net kavis)
      ctx.quadraticCurveTo(chin.x, neckCenterY, jawL.x, jawL.y);
      // Sol Yanak & Bıyık Dış Hattı
      ctx.quadraticCurveTo(lineLeftX - 10, mL.y, lineLeftX, nBase.y - 3);
      ctx.stroke();

      // BOYUN ALT SINIR ÇİZGİSİ [C] (Adem Elması Üstü Kesin Hat)
      ctx.strokeStyle = '#F7F4EB'; // Krem Beyaz Net Boyun Hattı
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 8);
      ctx.quadraticCurveTo(chin.x, neckCenterY, neckR.x, neckR.y + 8);
      ctx.stroke();

      // CİLDE TAM YAPIŞMA NOKTALARI (Skin Anchor Pin Points)
      drawPinPoint(ctx, nostrilL.x, nBase.y - 3, '#D4AF37');
      drawPinPoint(ctx, nostrilR.x, nBase.y - 3, '#D4AF37');
      drawPinPoint(ctx, chin.x, neckCenterY, '#F7F4EB');
      drawPinPoint(ctx, jawL.x, jawL.y, '#D4AF37');
      drawPinPoint(ctx, jawR.x, jawR.y, '#D4AF37');
    }
  },
  {
    id: 'stubble',
    name: 'Kirli Sakal (Stubble)',
    description: 'Keskin yanak ve anatomik boyun kavis hattı.',
    icon: 'sparkles',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37';

      // Sol Yanak Çizgisi
      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 10);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 18 + options.cheekOffset, mL.x - 10, mL.y - 2);
      ctx.stroke();

      // Sağ Yanak Çizgisi
      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 10);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 18 + options.cheekOffset, mR.x + 10, mR.y - 2);
      ctx.stroke();

      // Anatomik Boyun Temizlik Hattı (Adem Elması Üstü)
      ctx.strokeStyle = '#F7F4EB';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 18);
      ctx.quadraticCurveTo(chin.x, chin.y + 28, neckR.x, neckR.y + 18);
      ctx.stroke();

      drawPinPoint(ctx, earL.x, earL.y + 10, '#D4AF37');
      drawPinPoint(ctx, earR.x, earR.y + 10, '#D4AF37');
      drawPinPoint(ctx, chin.x, chin.y + 28, '#F7F4EB');
    }
  },
  {
    id: 'fullbeard',
    name: 'Full Sakal Çizgisi',
    description: 'Keskin yanak ve boyun temizleme hattı.',
    icon: 'user-check',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

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

      // Boyun Hattı
      ctx.strokeStyle = '#C93B2B';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 24);
      ctx.quadraticCurveTo(chin.x, chin.y + 36, neckR.x, neckR.y + 24);
      ctx.stroke();
    }
  },
  {
    id: 'balbo',
    name: 'Balbo & Bıyık',
    description: 'Çene ve bıyık ayrım hatları.',
    icon: 'scissors',
    drawGuide: (ctx, lm, options) => {
      const nBase = lm[2];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];

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
    }
  },
  {
    id: 'chinstrap',
    name: 'Çene Şeridi',
    description: 'Çene kemiğine tam yapışan bant.',
    icon: 'shield',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const jawL = lm[148];
      const jawR = lm[377];
      const chin = lm[152];

      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3.5;
      ctx.strokeStyle = '#D4AF37';

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 12);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 5, jawR.x, jawR.y);
      ctx.lineTo(earR.x, earR.y + 12);
      ctx.stroke();
    }
  }
];

// Cilde Yapışma Noktaları (Pin Points) Çizen Yardımcı Fonksiyon
function drawPinPoint(ctx, x, y, color = '#D4AF37') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#0D0E12';
  ctx.stroke();
  ctx.restore();
}
