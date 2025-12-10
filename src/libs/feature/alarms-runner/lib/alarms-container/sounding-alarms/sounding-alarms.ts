import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
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
export class SoundingAlarms {
  readonly soundingAlarms = input.required<AlarmGroupController[]>();
  readonly blinkCancelButton = input<boolean>(false);
  protected readonly cancelAlarm = output<void>();

  private readonly _blink = toSignal(
    concat(of('var(--mat-sys-error)').pipe(delay(300)), of('var(--mat-sys-primary)').pipe(delay(700))).pipe(repeat())
  );

  private readonly _noBlink = signal<string>('var(--mat-sys-error)');

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
