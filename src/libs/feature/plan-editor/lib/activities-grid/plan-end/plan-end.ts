import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { PLAN_END_BAR_HEIGHT } from '@util/app-config/lib/constants';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ck-plan-end',
  imports: [CommonModule, MatIconModule],
  templateUrl: './plan-end.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanEnd {
  private readonly planEditorData = inject(PlanEditorDataService);

  protected readonly planEndTethered = this.planEditorData.activitiesGridPlanEndTethered;
  protected readonly activitiesGridWidth = this.planEditorData.activitiesGridWidth;

  protected readonly pxPlanEndY = computed(() => {
    const planEnd = this.planEditorData.currentPlan()?.properties.endTime || undefined;
    if (!planEnd) {
      return undefined;
    }
    const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
    const { startHours } = this.planEditorData.activitiesGridTimeWindow();
    return (getMinutesSinceMidnight(planEnd) / 60 - startHours) * pixelsPerHour;
  });

  protected planEndBarHeight = PLAN_END_BAR_HEIGHT;
}
