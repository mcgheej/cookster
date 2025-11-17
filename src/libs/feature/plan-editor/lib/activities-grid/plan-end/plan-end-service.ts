import { computed, inject, Injectable } from '@angular/core';
import { DragResult, DragTetheredPlanEnd, DragTetheredPlanEndResult } from '@ui/drag-and-drop/index';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';

@Injectable()
export class PlanEndService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly db = inject(PlansDataService);
  private readonly planEditorData = inject(PlanEditorDataService);

  /**
   * compute drag operation for plan end
   */
  computedDragOperation() {
    return computed(() => {
      return new DragTetheredPlanEnd({
        id: 'drag-tethered-plan-end',
        lockAxis: 'y',
        plan: this.planEditorData.currentPlan(),
      });
    });
  }

  computedPlanEndY() {
    return computed(() => {
      const planEnd = this.planEditorData.currentPlan()?.properties.endTime || undefined;
      const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
      const { startHours } = this.planEditorData.activitiesGridTimeWindow();
      if (!planEnd) {
        return undefined;
      }
      return (getMinutesSinceMidnight(planEnd) / 60 - startHours) * pixelsPerHour;
    });
  }

  dragTetheredPlanEndEnded(ev: DragResult | undefined): void {
    const plan = this.planEditorData.currentPlan();
    if (ev && plan) {
      const newTime = (ev as DragTetheredPlanEndResult).time;
      if (plan.properties.endTime.getTime() === newTime.getTime()) {
        return; // No change needed
      }
      if (
        getMinutesSinceMidnight(newTime) - plan.properties.durationMins <
        this.planEditorData.activitiesGridTimeWindow().startHours * 60
      ) {
        this.snackBar.open('Plan cannot start before time window.', 'Close', {
          duration: DEFAULT_SNACKBAR_DURATION,
        });
        return; // Plan cannot start before time window. Ignoring drag result.
      }
      this.db.updatePlanProperties(plan.properties.id, { endTime: newTime }).subscribe({
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
          console.error('Error updating plan end time', error);
        },
      });
    }
  }
}
