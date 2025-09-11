import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DEFAULT_TOOLTIP_SHOW_DELAY, TIMESLOTS } from '@util/app-config/index';
import { ActivitiesGridMenu } from './activities-grid-menu/activities-grid-menu';
import { TimeLabels } from './time-labels/time-labels';
import { CommonModule } from '@angular/common';
import { ResourceLaneHeaders } from './resource-lane-headers/resource-lane-headers';
import { TimeGridLayer } from './time-grid-layer/time-grid-layer';
import { PlanEditorDataService } from '../plan-editor-data-service';

@Component({
  selector: 'ck-activities-grid',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ActivitiesGridMenu,
    TimeLabels,
    ResourceLaneHeaders,
    TimeGridLayer,
  ],
  templateUrl: './activities-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGrid {
  private readonly planEditorData = inject(PlanEditorDataService);
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected readonly hoursInGrid = computed(() => {
    const { start, end } = this.planEditorData.activitiesGridTimeWindow();
    return TIMESLOTS.filter((_, i) => i >= start && i < end);
  });

  protected onScroll(ev: any) {
    const sX = this.planEditorData.scrollX();
    const scrollX = -ev.target.scrollLeft;
    if (scrollX !== sX) {
      this.planEditorData.setScrollX(scrollX);
    }
    const sY = this.planEditorData.scrollY();
    const scrollY = -ev.target.scrollTop;
    // const scrollY = `0 ${-ev.target.scrollTop}px`;
    if (scrollY !== sY) {
      this.planEditorData.setScrollY(scrollY);
    }
  }
}
