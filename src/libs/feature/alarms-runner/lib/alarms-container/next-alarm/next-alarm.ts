import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AlarmGroupController } from '../../alarm-group-controller';
import { CommonModule } from '@angular/common';
import { AlarmGroupComponent } from '@ui/shared-components/index';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { differenceInSeconds } from 'date-fns';

@Component({
  selector: 'ck-next-alarm',
  imports: [CommonModule, AlarmGroupComponent],
  templateUrl: './next-alarm.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextAlarm {
  readonly nextAlarm = input.required<AlarmGroupController | undefined>();

  private currentTime = toSignal(interval(1000).pipe(map(() => new Date())), { initialValue: new Date() });

  protected time = computed(
    () => {
      const currentTime = this.currentTime();
      const nextAlarm = this.nextAlarm();
      if (!nextAlarm) {
        return '';
      }
      const diffSeconds = differenceInSeconds(nextAlarm.group.alarms[0].time, currentTime);
      if (diffSeconds <= 0) {
        return '00:00:00';
      }

      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;
      const hoursString = hours > 9 ? `${hours}` : `0${hours}`;
      const minutesString = minutes > 9 ? `${minutes}` : `0${minutes}`;
      const secondsString = seconds > 9 ? `${seconds}` : `0${seconds}`;
      return `${hoursString}:${minutesString}:${secondsString}`;
    },
    { equal: (a, b) => a === b }
  );
}
