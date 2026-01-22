import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnChanges } from '@angular/core';
import { Kitchen } from '@util/data-types/index';

@Component({
  selector: 'ck-kitchen-form',
  imports: [CommonModule],
  templateUrl: './kitchen-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenForm implements OnChanges {
  currentKitchen = input<Kitchen | null>(null);

  ngOnChanges(): void {
    console.log('Current Kitchen changed:', this.currentKitchen());
  }
}
