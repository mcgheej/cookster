import { Component } from '@angular/core';
import { MatColors } from '@ui/mat-colors/index';

@Component({
  selector: 'ck-colors',
  imports: [MatColors],
  template: `
    <div class="size-full">
      <ck-mat-colors></ck-mat-colors>
    </div>
  `,
})
export class Colors {}
