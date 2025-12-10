import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AlarmGroupController } from '../../alarm-group-controller';
import { CommonModule } from '@angular/common';
import { AlarmGroupComponent } from '@ui/shared-components/index';

@Component({
  selector: 'ck-upcoming-alarms',
  imports: [CommonModule, AlarmGroupComponent],
  templateUrl: './upcoming-alarms.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingAlarms {
  readonly upcomingAlarms = input.required<AlarmGroupController[]>();
}
