import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ck-header',
  imports: [],
  template: `
    <div class="flex justify-center">
      <img [src]="'./assets/logo.jpg'" class="w-20 h-20 text-blue-600" />
    </div>
    <h3 class="text-2xl font-bold text-center mt-4">Welcome back!</h3>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
