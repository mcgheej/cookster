import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KitchensStore } from './kitchens-store';
import { CommonModule } from '@angular/common';
import { KitchenExplorer } from './kitchen-explorer/kitchen-explorer';
import { KitchenForm } from './kitchen-form/kitchen-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';
import { KitchensService } from './kitchens-service';

@Component({
  selector: 'ck-kitchens',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, KitchenExplorer, KitchenForm],
  templateUrl: './kitchens.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KitchensService, KitchensStore],
})
export class Kitchens {
  private readonly kitchensStore = inject(KitchensStore);
  private readonly kitchensService = inject(KitchensService);

  protected readonly kitchens = this.kitchensStore.kitchens;
  protected readonly currentKitchen = this.kitchensStore.currentKitchen;

  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected addKitchen(ev: MouseEvent): void {
    console.log('Add kitchen clicked');
    this.kitchensService.createKitchen().subscribe((kitchenId) => {
      this.kitchensStore.setCurrentKitchenId(kitchenId);
    });
  }
}
