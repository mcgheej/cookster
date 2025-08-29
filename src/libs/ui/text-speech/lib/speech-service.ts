import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechService implements OnDestroy {
  private voices: SpeechSynthesisVoice[] = [];
  private subscription = fromEvent(speechSynthesis, 'voiceschanged')
    .pipe(
      map(() => speechSynthesis.getVoices().filter((voice) => voice.lang.includes('en'))),
      tap((voices) => (this.voices = voices))
    )
    .subscribe();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  stopSpeaking(): void {
    speechSynthesis.cancel();
  }

  speak(text: string): void {
    const voice = this.getVoice();
    if (voice === undefined) {
      console.warn('No suitable voice found');
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.voice = voice;
    speech.text = text;
    speech.rate = 1;
    speech.pitch = 1;
    speechSynthesis.speak(speech);
  }

  private getVoice(): SpeechSynthesisVoice | undefined {
    if (this.voices.length === 0) {
      return undefined;
    }
    const voice = this.voices.find((v) => v.name === 'Google UK English Female');
    return voice ?? this.voices[0];
  }
}
