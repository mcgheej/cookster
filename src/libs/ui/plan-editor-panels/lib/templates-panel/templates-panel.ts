import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-templates-panel',
  template: `
    <div>
      <h2>Templates</h2>
      <p>Manage your templates here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesPanel {}
