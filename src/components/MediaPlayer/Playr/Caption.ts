// @ts-nocheck
import Plyr from 'plyr';

export class LiveCaption {
  private recognition: SpeechRecognition;
  private captionsElement: HTMLElement | null;
  private isRecognizing: boolean;

  constructor() {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    this.recognition = new webkitSpeechRecognition();
    this.captionsElement = document.getElementById('captions');
    this.isRecognizing = false;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.captionsElement!.innerText = event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      this.captionsElement!.innerText = interimTranscript;
    };

    this.recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  start(): void {
    if (!this.isRecognizing) {
      this.recognition.start();
      this.isRecognizing = true;
    }
  }

  stop(): void {
    if (this.isRecognizing) {
      this.recognition.stop();
      this.isRecognizing = false;
    }
  }
}

const liveCaption = new LiveCaption();

// Initialize Plyr video player
const player = new Plyr('#video');

// Add event listeners for play and pause events
player.on('play', () => {
  liveCaption.start();
});

player.on('pause', () => {
  liveCaption.stop();
});
