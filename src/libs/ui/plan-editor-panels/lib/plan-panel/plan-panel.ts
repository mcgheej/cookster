import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-plan-panel',
  template: `
    <div>
      <h2>Plan</h2>
      <p>Plan details here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPanel {}
