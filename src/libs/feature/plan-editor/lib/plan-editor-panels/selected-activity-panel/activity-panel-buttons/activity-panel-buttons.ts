import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';

@Component({
  selector: 'ck-activity-panel-buttons',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './activity-panel-buttons.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityPanelButtons {
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
