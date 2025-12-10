import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AlarmGroup } from '@util/data-types/index';

@Component({
  selector: 'ck-alarm-group-component',
  template: `
    @for (alarm of alarmGroup().alarms; track $index; let isFirst = $first) {
      <div
        class="grid grid-cols-[35px_1fr] gap-1"
        [style.backgroundColor]="highlightOn() ? 'var(--mat-sys-surface-variant)' : 'var(--mat-sys-surface)'">
        <div>{{ isFirst ? alarm.timeString : '' }}</div>
        <div>{{ alarm.message }}</div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmGroupComponent {
  readonly alarmGroup = input.required<AlarmGroup>();
  readonly highlightOn = input<boolean>(false);
}
