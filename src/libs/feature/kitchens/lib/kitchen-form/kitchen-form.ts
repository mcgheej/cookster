import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-kitchen-form',
  templateUrl: './kitchen-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenForm {}
