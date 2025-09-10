import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY } from '@util/app-config/lib/constants';
import { ActivitiesGridMenu } from './activities-grid-menu/activities-grid-menu';
import { ActivitiesGridTimeLabels } from './activities-grid-time-labels/activities-grid-time-labels';
import { CommonModule } from '@angular/common';
import { ResourceLaneHeaders } from './resource-lane-headers/resource-lane-headers';

@Component({
  selector: 'ck-activities-grid',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ActivitiesGridMenu,
    ActivitiesGridTimeLabels,
    ResourceLaneHeaders,
  ],
  templateUrl: './activities-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGrid {
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;
}
