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
import { ActivitiesGridTimeLabels } from '../activities-grid-time-labels/activities-grid-time-labels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ck-activities-grid',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ActivitiesGridMenu,
    ActivitiesGridTimeLabels,
  ],
  templateUrl: './activities-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGrid {
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected gridClasses =
    'size-full grid grid-cols-1 bg-[var(--mat-sys-surface)] grid-rows-[' +
    ACTIVITIES_GRID_HEADER_HEIGHT +
    'px_minmax(0,_1fr)]';

  protected gridHeaderClasses =
    'grid border-b-2 divider-dark overflow-hidden grid-cols-[' +
    ACTIVITIES_GRID_TIME_COLUMN_WIDTH +
    'px_minmax(0,_1fr)]';
}
