/* ==========================================================================
   TRIMLY.AR - 5-Adımlı Mükemmel Keçi Sakalı Geometrik Algoritması
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Burun kanadı dikey hizası ve Adem elması 2-parmak boyun kuralıyla %100 simetrik çizgi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // ----------------------------------------------------------------------
      // ADIM 1: Dikey Sınırların Belirlenmesi (Burun Kanadı & Genişlik Kuralı [A])
      // ----------------------------------------------------------------------
      const nostrilLeft = lm[102] || lm[49] || lm[61]; // Sol burun kanadı dış noktası
      const nostrilRight = lm[331] || lm[279] || lm[291]; // Sağ burun kanadı dış noktası
      const mouthLeft = lm[61];   // Sol ağız kenarı
      const mouthRight = lm[291]; // Sağ ağız kenarı
      const noseBase = lm[2];     // Burun tabanı

      // Burun kanadından aşağı inen ve ağız kenarının ~0.8cm dışından geçen dikey hat [A]
      const verticalLineLeftX = nostrilLeft.x;
      const verticalLineRightX = nostrilRight.x;

      // ----------------------------------------------------------------------
      // ADIM 2: Yatay Alt Sınırın Belirlenmesi (Adem Elması 2-Parmak Kuralı [C])
      // ----------------------------------------------------------------------
      const chin = lm[152];
      const jawLeft = lm[148];
      const jawRight = lm[377];
      const neckLeft = lm[172];
      const neckRight = lm[397];

      // Çene boyu oranına göre Adem elmasının 2 parmak (2.5 - 3 cm) üstü
      const faceHeight = Math.abs(chin.y - lm[10].y);
      const twoFingerOffset = faceHeight * 0.08; // ~2.5 - 3 cm hassas oran
      const neckLineY = chin.y + twoFingerOffset;

      // ----------------------------------------------------------------------
      // ADIM 3: Üst Kavis & Yanak Bağlantısı (Yanak Kuralı - Yüz Şekline Uyumlu)
      // ----------------------------------------------------------------------
      // Köşeli/Kare yüzlerde yumuşak kavis, Yuvarlak yüzde keskin düz hat
      const cheekCurveOffset = options.cheekOffset || 0;

      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37'; // Klasik Berber Altını
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 8;

      // 1. Dikey Kılavuz Çizgileri [A] (Hizalama Kesik Çizgileri)
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(247, 244, 235, 0.4)';
      ctx.beginPath();
      ctx.moveTo(verticalLineLeftX, nostrilLeft.y);
      ctx.lineTo(verticalLineLeftX, chin.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(verticalLineRightX, nostrilRight.y);
      ctx.lineTo(verticalLineRightX, chin.y);
      ctx.stroke();
      ctx.restore();

      // 2. Renk Kodlu Kesim Haritası
      if (options.zoneMode) {
        // [KORUNACAK SAKAL GÖVDESİ]
        ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
        ctx.beginPath();
        ctx.moveTo(verticalLineLeftX, noseBase.y - 4);
        ctx.lineTo(verticalLineRightX, noseBase.y - 4);
        ctx.quadraticCurveTo(verticalLineRightX + 12 + cheekCurveOffset, mouthRight.y, jawRight.x, jawRight.y);
        ctx.quadraticCurveTo(chin.x, neckLineY, jawLeft.x, jawLeft.y);
        ctx.quadraticCurveTo(verticalLineLeftX - 12 - cheekCurveOffset, mouthLeft.y, verticalLineLeftX, noseBase.y - 4);
        ctx.closePath();
        ctx.fill();

        // [KESİLECEK YANAK VE BOYUN ALANLARI]
        ctx.fillStyle = 'rgba(226, 232, 240, 0.12)';
        // Sol Yanak
        ctx.beginPath();
        ctx.moveTo(lm[234].x, lm[234].y);
        ctx.lineTo(verticalLineLeftX - 10, mouthLeft.y);
        ctx.lineTo(jawLeft.x, jawLeft.y);
        ctx.closePath();
        ctx.fill();
        // Sağ Yanak
        ctx.beginPath();
        ctx.moveTo(lm[454].x, lm[454].y);
        ctx.lineTo(verticalLineRightX + 10, mouthRight.y);
        ctx.lineTo(jawRight.x, jawRight.y);
        ctx.closePath();
        ctx.fill();
      }

      // 3. MÜKEMMEL KEÇİ SAKALI AR DIŞ SINIR HATTI
      ctx.beginPath();
      // Bıyık Üst Hattı (Burun Kanadı Hizası [A])
      ctx.moveTo(verticalLineLeftX, noseBase.y - 4);
      ctx.lineTo(verticalLineRightX, noseBase.y - 4);

      // Sağ Yanak & Bıyık Dış Kavis Hattı
      ctx.quadraticCurveTo(verticalLineRightX + 12 + cheekCurveOffset, mouthRight.y, jawRight.x, jawRight.y);

      // ADIM 2: Adem Elması 2-Parmak Alt Yay Hattı [C]
      ctx.quadraticCurveTo(chin.x, neckLineY, jawLeft.x, jawLeft.y);

      // Sol Yanak & Bıyık Dış Kavis Hattı
      ctx.quadraticCurveTo(verticalLineLeftX - 12 - cheekCurveOffset, mouthLeft.y, verticalLineLeftX, noseBase.y - 4);
      ctx.stroke();

      // ----------------------------------------------------------------------
      // ADIM 4: Dudak Altı Ruh Hatları (Soul Patch [B])
      // ----------------------------------------------------------------------
      const lowerLip = lm[17];
      const chinNotch = lm[200] || lm[18];

      if (lowerLip && chinNotch) {
        ctx.save();
        ctx.strokeStyle = 'rgba(247, 244, 235, 0.6)';
        ctx.lineWidth = 1.5;
        // Alt dudak ruh adası rehber kılavuzu
        ctx.beginPath();
        ctx.moveTo(mouthLeft.x + 8, lowerLip.y + 6);
        ctx.lineTo(mouthLeft.x + 12, chinNotch.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(mouthRight.x - 8, lowerLip.y + 6);
        ctx.lineTo(mouthRight.x - 12, chinNotch.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  },
  {
    id: 'stubble',
    name: 'Kirli Sakal (Stubble)',
    description: 'Yanak kemiği ve boyun kavis hattını vurgulayan doğal berber çizgisi.',
    icon: 'sparkles',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 10);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 20 + options.cheekOffset, mL.x - 12, mL.y - 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 10);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 20 + options.cheekOffset, mR.x + 12, mR.y - 2);
      ctx.stroke();

      ctx.strokeStyle = '#C8963E';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 24);
      ctx.quadraticCurveTo(chin.x, chin.y + 34, neckR.x, neckR.y + 24);
      ctx.stroke();
    }
  },
  {
    id: 'fullbeard',
    name: 'Full Sakal Çizgisi',
    description: 'Gür sakallar için jilet gibi yanak ve alt boyun sınır rehberi.',
    icon: 'user-check',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#F7F4EB';
      ctx.shadowColor = 'rgba(247, 244, 235, 0.5)';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 6);
      ctx.lineTo(mL.x - 16, mL.y - 12 + options.cheekOffset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 6);
      ctx.lineTo(mR.x + 16, mR.y - 12 + options.cheekOffset);
      ctx.stroke();

      ctx.strokeStyle = '#D4AF37';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 28);
      ctx.quadraticCurveTo(chin.x, chin.y + 42, neckR.x, neckR.y + 28);
      ctx.stroke();
    }
  },
  {
    id: 'balbo',
    name: 'Balbo & Bıyık',
    description: 'Geleneksel T-şekilli çene sakalı rehberi.',
    icon: 'scissors',
    drawGuide: (ctx, lm, options) => {
      const nBase = lm[2];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];

      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(nBase.x - 22, nBase.y + 2);
      ctx.lineTo(mL.x - 8, mL.y - 6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nBase.x + 22, nBase.y + 2);
      ctx.lineTo(mR.x + 8, mR.y - 6);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mL.x - 12, mL.y + 16);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 12, jawR.x, jawR.y);
      ctx.lineTo(mR.x + 12, mR.y + 16);
      ctx.stroke();
    }
  },
  {
    id: 'chinstrap',
    name: 'Çene Şeridi',
    description: 'Favorilerden başlayıp çene kemiğini saran zarif bant.',
    icon: 'shield',
    drawGuide: (ctx, lm, options) => {
      const earL = lm[234];
      const earR = lm[454];
      const jawL = lm[148];
      const jawR = lm[377];
      const chin = lm[152];

      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 12);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 5, jawR.x, jawR.y);
      ctx.lineTo(earR.x, earR.y + 12);
      ctx.stroke();
    }
  }
];
