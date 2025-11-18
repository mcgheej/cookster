import { computed, inject, Injectable } from '@angular/core';
import {
  DragResult,
  DragTetheredPlanEnd,
  DragTetheredPlanEndResult,
  DragUntetheredPlanEnd,
} from '@ui/drag-and-drop/index';
import { PlanEditorDataService } from '../../plan-editor-data-service';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { ActivityDB, FULL_TIME_WINDOW, PlanKitchenResource } from '@util/data-types/index';

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
      const tethered = this.planEditorData.activitiesGridPlanEndTethered();
      if (tethered) {
        return new DragTetheredPlanEnd({
          id: 'drag-tethered-plan-end',
          lockAxis: 'y',
          plan: this.planEditorData.currentPlan(),
        });
      }
      return new DragUntetheredPlanEnd({
        id: 'drag-untethered-plan-end',
        lockAxis: 'y',
        plan: this.planEditorData.currentPlan(),
      });
    });
  }

  computedPlanEndY() {
    return computed(() => {
      const planEnd = this.planEditorData.currentPlan()?.properties.endTime || undefined;
      const planTimeWindow = this.planEditorData.currentPlan()?.properties.timeWindow || FULL_TIME_WINDOW;
      const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
      const { startHours } = planTimeWindow;
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
        plan.properties.timeWindow.startHours * 60
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

  dragUntetheredPlanEndEnded(ev: DragResult | undefined): void {
    const plan = this.planEditorData.currentPlan();
    if (ev && plan) {
      const newTime = (ev as DragTetheredPlanEndResult).time;
      const shiftMins = getMinutesSinceMidnight(newTime) - getMinutesSinceMidnight(plan.properties.endTime);
      if (shiftMins === 0) {
        return; // No change needed
      }
      const shiftedKitchenResources = this.shiftResourceActions(plan.properties.kitchenResources, shiftMins);
      const shiftedActivities = this.shiftActivities(plan.activities, shiftMins);
      const newPlan = {
        ...plan,
        properties: {
          ...plan.properties,
          endTime: newTime,
          kitchenResources: shiftedKitchenResources,
        },
        activities: shiftedActivities,
      };
      this.db.updateUntetheredPlanEnd(newPlan).subscribe({
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
          console.error('Error updating untethered plan end', error);
        },
      });
    }
  }

  private shiftResourceActions(kithenResources: PlanKitchenResource[], shiftMins: number): PlanKitchenResource[] {
    return kithenResources.map((kr) => {
      if (kr.actions.length > 0) {
        const newActions = kr.actions.map((action) => ({ ...action, timeOffset: action.timeOffset + shiftMins }));
        return { ...kr, actions: newActions };
      } else {
        return kr;
      }
    });
  }

  private shiftActivities(activities: ActivityDB[], shiftMins: number): ActivityDB[] {
    return activities.map((activity) => {
      return { ...activity, startTimeOffset: activity.startTimeOffset + shiftMins };
    });
  }
}
