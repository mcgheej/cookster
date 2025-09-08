import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-alarms-panel',
  template: `
    <div>
      <h2>Alarms</h2>
      <p>Manage your alarms here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsPanel {}
