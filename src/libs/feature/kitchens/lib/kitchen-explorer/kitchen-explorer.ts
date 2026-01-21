import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KitchensService } from '../kitchens-service';
import { CommonModule } from '@angular/common';
import { KitchenItem } from './kitchen-item/kitchen-item';

@Component({
  selector: 'ck-kitchen-explorer',
  imports: [CommonModule, KitchenItem],
  templateUrl: './kitchen-explorer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenExplorer {
  private readonly kitchensService = inject(KitchensService);

  protected readonly kitchens = this.kitchensService.kitchens;
}
