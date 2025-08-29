import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ck-panel-content',
  imports: [CommonModule, MatDividerModule],
  templateUrl: './panel-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelContent {
  readonly panelComponent = input<any | undefined>();
}
