import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KitchensStore } from '../kitchens-store';
import { CommonModule } from '@angular/common';
import { KitchenItem } from './kitchen-item/kitchen-item';

@Component({
  selector: 'ck-kitchen-explorer',
  imports: [CommonModule, KitchenItem],
  templateUrl: './kitchen-explorer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenExplorer {
  private readonly kitchensStore = inject(KitchensStore);

  protected readonly kitchens = this.kitchensStore.kitchens;
}
