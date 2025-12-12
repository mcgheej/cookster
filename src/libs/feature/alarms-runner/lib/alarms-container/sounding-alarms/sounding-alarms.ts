import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { AlarmGroupController } from '../../alarm-group-controller';
import { CommonModule } from '@angular/common';
import { AlarmGroupComponent } from '@ui/shared-components/index';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { concat, of, delay, repeat } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ck-sounding-alarms',
  imports: [CommonModule, MatBadgeModule, MatButtonModule, AlarmGroupComponent],
  templateUrl: './sounding-alarms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundingAlarms implements OnInit, OnDestroy {
  readonly soundingAlarms = input.required<AlarmGroupController[]>();
  readonly blinkCancelButton = input<boolean>(false);
  protected readonly cancelAlarm = output<void>();

  private readonly _blink = toSignal(
    concat(of('var(--mat-sys-error)').pipe(delay(300)), of('var(--mat-sys-primary)').pipe(delay(700))).pipe(repeat())
  );

  private readonly _noBlink = signal<string>('var(--mat-sys-error)');

  private audioPlayer: HTMLAudioElement | undefined = undefined;
  private audioPlayerReady = signal<boolean>(false);

  constructor() {
    effect(() => {
      const soundingAlarms = this.soundingAlarms();
      const audioPlayerReady = this.audioPlayerReady();
      if (this.audioPlayer) {
        if (soundingAlarms.length > 0 && audioPlayerReady && this.audioPlayer.paused) {
          this.audioPlayer.play();
        } else if (soundingAlarms.length === 0 && this.audioPlayer.paused === false) {
          this.audioPlayer.pause();
        }
      }
    });
  }

  ngOnInit(): void {
    this.audioPlayer = new Audio('./assets/alarm-429128.mp3');
    this.audioPlayer.loop = true;
    this.audioPlayer.addEventListener('canplaythrough', () => {
      if (!this.audioPlayerReady()) {
        this.audioPlayerReady.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.removeEventListener('canplaythrough', () => {});
      this.audioPlayer = undefined;
    }
  }

  protected blink = computed(() => {
    if (this.blinkCancelButton()) {
      return this._blink;
    }
    return this._noBlink;
  });

  protected cancelAlarmClick(): void {
    this.cancelAlarm.emit();
  }
}
