import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SelectorButton } from '../selector-button';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ck-panel-selector',
  imports: [MatIconModule, MatDividerModule],
  templateUrl: './panel-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelSelector {
  readonly selectorButtons = input.required<SelectorButton[]>();
  readonly selectedButtonName = input.required<string>();
  protected readonly panelSelectorClick = output<number>();

  protected readonly buttonStyles = computed(() => {
    return this.selectorButtons().map((button) => {
      return button.name === this.selectedButtonName()
        ? `grid bg-[var(--mat-sys-primary-fixed-dim)] cursor-pointer hover:bg-[color-mix(in_srgb,_var(--mat-sys-primary-fixed),_transparent_35%)] py-0.5`
        : `grid cursor-pointer hover:bg-[color-mix(in_srgb,_var(--mat-sys-primary-fixed),_transparent_35%)] py-0.5`;
    });
  });
}
