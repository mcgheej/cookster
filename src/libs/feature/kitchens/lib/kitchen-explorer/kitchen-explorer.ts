import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KitchensService } from '../kitchens-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ck-kitchen-explorer',
  imports: [CommonModule],
  templateUrl: './kitchen-explorer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenExplorer {
  private readonly kitchensService = inject(KitchensService);

  protected readonly kitchens = this.kitchensService.kitchens;
}
