import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Kitchen } from '@util/data-types/index';
import { KitchensStore } from '../../kitchens-store';
import { CommonModule } from '@angular/common';
import { KitchenItemDetail } from './kitchen-item-detail';

@Component({
  selector: 'ck-kitchen-item',
  imports: [CommonModule, KitchenItemDetail],
  templateUrl: './kitchen-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenItem {
  private kitchensStore = inject(KitchensStore);

  readonly kitchenItem = input.required<Kitchen>();

  protected readonly isCurrentKitchen = computed(() => {
    return this.kitchensStore.currentKitchenId() === this.kitchenItem().id;
  });

  setCurrentKitchen(kitchen: Kitchen) {
    this.kitchensStore.setCurrentKitchenId(this.isCurrentKitchen() ? '' : kitchen.id);
  }
}
