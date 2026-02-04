import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Kitchen } from '@util/data-types/index';
import { KitchensStore } from '../../kitchens-store';
import { CommonModule } from '@angular/common';
import { KitchenItemDetail } from './kitchen-item-detail';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { KitchensService } from '../../kitchens-service';

@Component({
  selector: 'ck-kitchen-item',
  imports: [CommonModule, KitchenItemDetail, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './kitchen-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenItem {
  private readonly kitchensStore = inject(KitchensStore);
  private readonly kitchensService = inject(KitchensService);

  readonly kitchenItem = input.required<Kitchen>();

  protected readonly isCurrentKitchen = computed(() => {
    return this.kitchensStore.currentKitchenId() === this.kitchenItem().id;
  });

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  setCurrentKitchen(kitchen: Kitchen) {
    this.kitchensStore.setCurrentKitchenId(this.isCurrentKitchen() ? '' : kitchen.id);
  }

  deleteKitchen(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault(); // TODO: implement delete kitchen
    this.kitchensService.deleteKitchen(this.kitchenItem());
    // console.log('delete kitchen', this.kitchenItem().id, this.kitchenItem().name);
  }
}
