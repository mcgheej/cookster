import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-alarms-runner',
  template: `<p>Alarms Runner Component Works!</p>
    <p>Plan ID: {{ planId() }}</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlarmsRunner {
  readonly planId = input.required<string>();
}
