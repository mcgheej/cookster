import { Component, input } from '@angular/core';

@Component({
  selector: 'ck-hob-container',
  host: {
    '[style.width]': 'widthPx()',
    '[style.height]': 'heightPx()',
  },
  template: `<div class="size-full border border-[var(--mat-sys-secondary-fixed)]"></div>`,
})
export class HobContainer {
  readonly widthPx = input<string>('0');
  readonly heightPx = input<string>('0');
}
