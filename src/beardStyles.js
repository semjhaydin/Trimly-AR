/* ==========================================================================
   TRIMLY.AR - Yüze Su Gibi Oturan (Fluid 3D Mesh Conforming) AR Engine
   ========================================================================== */

export const BEARD_STYLES = [
  {
    id: 'goatee',
    name: 'Mükemmel Keçi Sakalı (Master Goatee)',
    description: 'Yüzün 3B kıvrımlarına su gibi oturan, ağzı kapamayan keskin sakal kılavuz çizgisi.',
    icon: 'circle-dot',
    drawGuide: (ctx, lm, options) => {
      // ----------------------------------------------------------------------
      // 1. GERÇEK 3B YÜZ MESH HİZALAMA NOKTALARI
      // ----------------------------------------------------------------------
      const nBase = lm[2];        // Burun alt tabanı
      const mL = lm[61];          // Sol dudak kenarı
      const mR = lm[291];         // Sağ dudak kenarı
      const chin = lm[152];       // Çene ucu
      const jawL = lm[148];       // Sol çene kemiği
      const jawR = lm[377];       // Sağ çene kemiği
      const neckL = lm[172];      // Sol boyun birleşimi
      const neckR = lm[397];      // Sağ boyun birleşimi

      // Ağız genişliğine göre doğal dış sınır (Dudakları boğmayan, ağzı kapatmayan marj)
      const mouthWidth = Math.abs(mR.x - mL.x);
      const margin = mouthWidth * 0.35; // Dudak dışı doğal pay

      const outerLeftX = mL.x - margin;
      const outerRightX = mR.x + margin;

      // Çene altı boyun çizgi konumu (Çene ucunun TAM ALTINDA, boyun bölgesinde)
      const chinHeight = Math.abs(chin.y - nBase.y);
      const neckY = chin.y + chinHeight * 0.22; // Çene kemiğinin altına oturan boyun kavisi

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // ----------------------------------------------------------------------
      // 2. YÜZE SU GİBİ OTURAN İNCE ŞEFFAF RENK BÖLGELERİ (Göz Almayan Yumuşak Tonlar)
      // ----------------------------------------------------------------------
      if (options.zoneMode) {
        // Sakal Alanı (Hafif Şeffaf Sıcak Altın)
        ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
        ctx.beginPath();
        ctx.moveTo(outerLeftX, nBase.y);
        ctx.lineTo(outerRightX, nBase.y);
        ctx.quadraticCurveTo(outerRightX + 4, mR.y, jawR.x, jawR.y);
        ctx.quadraticCurveTo(chin.x, chin.y + 6, jawL.x, jawL.y);
        ctx.quadraticCurveTo(outerLeftX - 4, mL.y, outerLeftX, nBase.y);
        ctx.closePath();
        ctx.fill();

        // Boyun Temizlik Alanı (Çene Altındaki Kırmızı Sınır)
        ctx.fillStyle = 'rgba(201, 59, 43, 0.12)';
        ctx.beginPath();
        ctx.moveTo(neckL.x, neckL.y + 4);
        ctx.quadraticCurveTo(chin.x, neckY, neckR.x, neckR.y + 4);
        ctx.lineTo(neckR.x, neckY + 25);
        ctx.lineTo(neckL.x, neckY + 25);
        ctx.closePath();
        ctx.fill();
      }

      // ----------------------------------------------------------------------
      // 3. YÜZE SU GİBİ OTURAN KESKİN BERBER KILAVUZ ÇİZGİLERİ
      // ----------------------------------------------------------------------
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37'; // Berber Altını Kontur

      // A) KEÇİ SAKALI ANA KONTUR HATI (Ağzı Kapatmayan, Yüz Kıvrımına Oturan Hat)
      ctx.beginPath();
      // Bıyık üst sınırı
      ctx.moveTo(outerLeftX, nBase.y);
      ctx.lineTo(outerRightX, nBase.y);
      // Sağ yanak kavisinden çeneye iniş
      ctx.quadraticCurveTo(outerRightX + 4, mR.y, jawR.x, jawR.y);
      // Çene altı birleşimi
      ctx.quadraticCurveTo(chin.x, chin.y + 6, jawL.x, jawL.y);
      // Sol yanak kavisinden bıyığa dönüş
      ctx.quadraticCurveTo(outerLeftX - 4, mL.y, outerLeftX, nBase.y);
      ctx.stroke();

      // B) BOYUN TEMİZLEME ÇİZGİSİ (Çenenin Tam Altındaki Doğru Kavis)
      ctx.strokeStyle = '#F7F4EB'; // Krem Beyaz Net Boyun Hattı
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 6);
      ctx.quadraticCurveTo(chin.x, neckY, neckR.x, neckR.y + 6);
      ctx.stroke();

      // C) BURUN KANADI DİKEY HİZALAMA KILAVUZLARI [A] (Hassas Kesik Çizgiler)
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(247, 244, 235, 0.4)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(outerLeftX, nBase.y - 6);
      ctx.lineTo(outerLeftX, chin.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(outerRightX, nBase.y - 6);
      ctx.lineTo(outerRightX, chin.y);
      ctx.stroke();
      ctx.restore();

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
      const neckL = lm[172];
      const neckR = lm[397];

      const chinHeight = Math.abs(chin.y - lm[2].y);
      const neckY = chin.y + chinHeight * 0.2;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      // Sol Yanak Çizgisi
      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 8);
      ctx.quadraticCurveTo((earL.x + mL.x) / 2, mL.y - 14 + options.cheekOffset, mL.x - 6, mL.y);
      ctx.stroke();

      // Sağ Yanak Çizgisi
      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 8);
      ctx.quadraticCurveTo((earR.x + mR.x) / 2, mR.y - 14 + options.cheekOffset, mR.x + 6, mR.y);
      ctx.stroke();

      // Boyun Çizgisi
      ctx.strokeStyle = '#F7F4EB';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 6);
      ctx.quadraticCurveTo(chin.x, neckY, neckR.x, neckR.y + 6);
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
      const chin = lm[152];
      const neckL = lm[172];
      const neckR = lm[397];

      const chinHeight = Math.abs(chin.y - lm[2].y);
      const neckY = chin.y + chinHeight * 0.25;

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#F7F4EB';

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 4);
      ctx.lineTo(mL.x - 10, mL.y - 8 + options.cheekOffset);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(earR.x, earR.y + 4);
      ctx.lineTo(mR.x + 10, mR.y - 8 + options.cheekOffset);
      ctx.stroke();

      // Boyun Hattı
      ctx.strokeStyle = '#C93B2B';
      ctx.beginPath();
      ctx.moveTo(neckL.x, neckL.y + 6);
      ctx.quadraticCurveTo(chin.x, neckY, neckR.x, neckR.y + 6);
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
      const nBase = lm[2];
      const mL = lm[61];
      const mR = lm[291];
      const chin = lm[152];
      const jawL = lm[148];
      const jawR = lm[377];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      ctx.beginPath();
      ctx.moveTo(nBase.x - 18, nBase.y + 2);
      ctx.lineTo(mL.x - 4, mL.y - 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(nBase.x + 18, nBase.y + 2);
      ctx.lineTo(mR.x + 4, mR.y - 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mL.x - 8, mL.y + 14);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 8, jawR.x, jawR.y);
      ctx.lineTo(mR.x + 8, mR.y + 14);
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
      const earL = lm[234];
      const earR = lm[454];
      const jawL = lm[148];
      const jawR = lm[377];
      const chin = lm[152];

      ctx.save();
      ctx.shadowBlur = 0;
      ctx.lineWidth = options.lineWidth || 3;
      ctx.strokeStyle = '#D4AF37';

      ctx.beginPath();
      ctx.moveTo(earL.x, earL.y + 10);
      ctx.lineTo(jawL.x, jawL.y);
      ctx.quadraticCurveTo(chin.x, chin.y + 4, jawR.x, jawR.y);
      ctx.lineTo(earR.x, earR.y + 10);
      ctx.stroke();
      ctx.restore();
    }
  }
];
