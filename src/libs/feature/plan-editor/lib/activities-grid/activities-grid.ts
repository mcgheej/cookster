import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';

@Component({
  selector: 'ck-activities-grid',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './activities-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGrid {
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  openTimeColumnMenu() {
    console.log('Open time column menu');
  }
}
