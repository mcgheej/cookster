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
import { MatSliderModule } from '@angular/material/slider';
import { concat, of, delay, repeat } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';

const initialVolume = 10;

@Component({
  selector: 'ck-sounding-alarms',
  imports: [
    CommonModule,
    FormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatTooltipModule,
    AlarmGroupComponent,
  ],
  templateUrl: './sounding-alarms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundingAlarms implements OnInit, OnDestroy {
  readonly soundingAlarms = input.required<AlarmGroupController[]>();
  readonly volume = input<number>(initialVolume);
  readonly blinkCancelButton = input<boolean>(true);
  protected readonly cancelAlarm = output<void>();
  protected readonly blinkCancelButtonChange = output<boolean>();
  protected readonly alarmVolumeChange = output<number>();

  protected muted = signal<boolean>(false);
  private lastVolume = initialVolume;

  private readonly _blink = toSignal(
    concat(of('var(--mat-sys-error)').pipe(delay(300)), of('var(--mat-sys-primary)').pipe(delay(700))).pipe(repeat())
  );

  private readonly _noBlink = signal<string>('var(--mat-sys-error)');

  private audioPlayer: HTMLAudioElement | undefined = undefined;
  private audioPlayerReady = signal<boolean>(false);

  protected readonly showTooltipDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

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
    this.audioPlayer.volume = this.volume() / 10;
    this.muted.set(this.volume() === 0);
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

  protected onBlinkToggle(ev: MouseEvent): void {
    ev.stopPropagation();
    this.blinkCancelButtonChange.emit(!this.blinkCancelButton());
  }

  protected onVolumeChange(inputEvent: Event): void {
    const newVolume = Number((inputEvent.target as HTMLInputElement).value);
    if (this.lastVolume !== newVolume) {
      this.lastVolume = newVolume;
      this.changeAudioVolume(newVolume);
      this.alarmVolumeChange.emit(newVolume);
    }
    if (newVolume === 0) {
      this.muted.set(true);
    }
  }

  protected onMuteToggle(ev: MouseEvent): void {
    ev.stopPropagation();
    const newMuted = !this.muted();
    if (newMuted === false) {
      if (this.lastVolume !== 0) {
        this.changeAudioVolume(this.lastVolume);
        this.alarmVolumeChange.emit(this.lastVolume);
      } else {
        this.lastVolume = 1;
        this.changeAudioVolume(1);
        this.alarmVolumeChange.emit(1);
      }
    } else {
      this.changeAudioVolume(0);
      this.alarmVolumeChange.emit(0);
    }
    this.muted.set(newMuted);
  }

  private changeAudioVolume(newVolume: number): void {
    if (this.audioPlayer) {
      this.audioPlayer.volume = newVolume / 10;
    }
  }
}
