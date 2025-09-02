import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ACTIVITIES_GRID_HEADER_HEIGHT,
  ACTIVITIES_GRID_TIME_COLUMN_WIDTH,
  DEFAULT_TOOLTIP_SHOW_DELAY,
} from '@util/app-config/lib/constants';
import { ActivitiesGridMenu } from '../activities-grid-menu/activities-grid-menu';

@Component({
  selector: 'ck-activities-grid',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, ActivitiesGridMenu],
  templateUrl: './activities-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGrid {
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected readonly headerGridCols = `grid-cols-[${ACTIVITIES_GRID_TIME_COLUMN_WIDTH}px_minmax(0,_1fr)]` as const;
  protected readonly headerHeight = `h-[${ACTIVITIES_GRID_HEADER_HEIGHT}px]` as const;
}
