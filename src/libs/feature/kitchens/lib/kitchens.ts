import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KitchensService } from './kitchens-service';
import { CommonModule } from '@angular/common';
import { KitchenExplorer } from './kitchen-explorer/kitchen-explorer';
import { KitchenEditor } from './kitchen-editor/kitchen-editor';

@Component({
  selector: 'ck-kitchens',
  imports: [CommonModule, KitchenExplorer, KitchenEditor],
  templateUrl: './kitchens.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KitchensService],
})
export class Kitchens {
  private readonly kitchensService = inject(KitchensService);

  protected readonly kitchens = this.kitchensService.kitchens;
}
