import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KitchensService } from './kitchens-service';
import { CommonModule } from '@angular/common';
import { KitchenExplorer } from './kitchen-explorer/kitchen-explorer';
import { KitchenForm } from './kitchen-form/kitchen-form';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/index';

@Component({
  selector: 'ck-kitchens',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, KitchenExplorer, KitchenForm],
  templateUrl: './kitchens.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [KitchensService],
})
export class Kitchens {
  private readonly kitchensService = inject(KitchensService);

  protected readonly kitchens = this.kitchensService.kitchens;
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected addKitchen(ev: MouseEvent): void {
    console.log('Add kitchen clicked');
  }
}
