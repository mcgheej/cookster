import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-selected-activity-panel',
  template: `
    <div>
      <h2>Selected Activity</h2>
      <p>View selected activity details here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedActivityPanel {}
