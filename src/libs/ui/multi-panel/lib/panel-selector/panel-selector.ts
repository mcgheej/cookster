import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SelectorButton } from '../selector-button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ck-panel-selector',
  imports: [CommonModule, MatIconModule, MatDividerModule],
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
        ? `grid bg-[var(--mat-sys-primary-fixed-dim)] cursor-pointer hover:bg-[var(--mat-sys-primary-fixed)] py-0.5`
        : `grid cursor-pointer hover:bg-[var(--mat-sys-primary-fixed)] py-0.5`;
    });
  });
}
