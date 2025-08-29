import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-kitchen-panel',
  template: `
    <div>
      <h2>Kitchen</h2>
      <p>Manage kitchen resources here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenPanel {}
