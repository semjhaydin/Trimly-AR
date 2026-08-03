/* ==========================================================================
   TRIMLY.AR - Web Speech API Hands-Free Voice Controller
   ========================================================================== */

export class VoiceController {
  constructor(onCommandCallback) {
    this.onCommand = onCommandCallback;
    this.recognition = null;
    this.isListening = false;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'tr-TR';

      this.recognition.onresult = (event) => this.handleResult(event);
      this.recognition.onerror = (err) => console.warn("Ses tanıma hatası:", err);
      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Ignore restart errors
          }
        }
      };
    }
  }

  toggle() {
    if (!this.recognition) {
      alert("Tarayıcınız sesli komut özelliğini desteklemiyor. (Chrome / Edge önerilir)");
      return false;
    }

    if (this.isListening) {
      this.isListening = false;
      this.recognition.stop();
      return false;
    } else {
      this.isListening = true;
      try {
        this.recognition.start();
        return true;
      } catch (e) {
        console.warn("Ses başlatma hatası:", e);
        this.isListening = false;
        return false;
      }
    }
  }

  handleResult(event) {
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();

    console.log("Sesli komut algılandı:", transcript);

    if (transcript.includes('kilitle') || transcript.includes('köpük') || transcript.includes('dondur')) {
      this.emitCommand('lock');
    } else if (transcript.includes('canlı') || transcript.includes('çöz')) {
      this.emitCommand('unlock');
    } else if (transcript.includes('ışık') || transcript.includes('fener')) {
      this.emitCommand('ringlight');
    } else if (transcript.includes('ayna')) {
      this.emitCommand('mirror');
    } else if (transcript.includes('fotoğraf') || transcript.includes('çek') || transcript.includes('resim')) {
      this.emitCommand('snapshot');
    } else if (transcript.includes('sonraki') || transcript.includes('değiştir') || transcript.includes('stil')) {
      this.emitCommand('nextstyle');
    } else if (transcript.includes('bölge') || transcript.includes('renk')) {
      this.emitCommand('zones');
    }
  }

  emitCommand(command) {
    if (this.onCommand) {
      this.onCommand(command);
    }
  }
}
