import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Kitchen } from '@util/data-types/index';
import { KitchensService } from '../../kitchens-service';
import { CommonModule } from '@angular/common';
import { KitchenItemDetail } from './kitchen-item-detail';

@Component({
  selector: 'ck-kitchen-item',
  imports: [CommonModule, KitchenItemDetail],
  templateUrl: './kitchen-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenItem {
  private kitchensService = inject(KitchensService);

  readonly kitchenItem = input.required<Kitchen>();

  protected readonly isCurrentKitchen = computed(() => {
    return this.kitchensService.currentKitchenId() === this.kitchenItem().id;
  });

  setCurrentKitchen(kitchen: Kitchen) {
    this.kitchensService.setCurrentKitchenId(this.isCurrentKitchen() ? '' : kitchen.id);
  }
}
