import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ACTIVITIES_GRID_HEADER_HEIGHT, DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';

@Component({
  selector: 'ck-activities-grid-menu',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './activities-grid-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGridMenu {
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected readonly headerHeight = `h-[${ACTIVITIES_GRID_HEADER_HEIGHT}px]` as const;

  openTimeColumnMenu() {
    console.log('Open time column menu');
  }
}
