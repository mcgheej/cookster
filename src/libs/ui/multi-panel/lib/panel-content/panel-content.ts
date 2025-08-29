import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ck-panel-content',
  imports: [MatDividerModule],
  templateUrl: './panel-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelContent {}
