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
import { ResourceLanesLayer } from './resource-lanes-layer/resource-lanes-layer';
import { PlanEnd } from './plan-end/plan-end';
import { TfxResizeEvent, TfxResizeObserver } from '@ui/tfx-resize-observer/index';
import { FULL_TIME_WINDOW } from '@util/data-types/index';

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
    ResourceLanesLayer,
    PlanEnd,
    TfxResizeObserver,
  ],
  templateUrl: './activities-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesGrid {
  private readonly planEditorData = inject(PlanEditorDataService);
  protected tooltipShowDelay = DEFAULT_TOOLTIP_SHOW_DELAY;

  protected readonly hoursInGrid = computed(() => {
    const { startHours, endHours } = this.planEditorData.currentPlan()?.properties.timeWindow || FULL_TIME_WINDOW;
    return TIMESLOTS.filter((_, i) => i >= startHours && i < endHours);
  });

  protected onScroll(ev: any) {
    const sX = this.planEditorData.activitiesGridScrollX();
    const scrollX = -ev.target.scrollLeft;
    if (scrollX !== sX) {
      this.planEditorData.setScrollX(scrollX);
    }
    const sY = this.planEditorData.activitiesGridScrollY();
    const scrollY = -ev.target.scrollTop;
    if (scrollY !== sY) {
      this.planEditorData.setScrollY(scrollY);
    }
  }

  onResize(event: TfxResizeEvent) {
    this.planEditorData.setActivitiesGridRect(event.newRect);
    this.planEditorData.setActivitiesGridBoundingRect(event.boundingRect);
  }
}
