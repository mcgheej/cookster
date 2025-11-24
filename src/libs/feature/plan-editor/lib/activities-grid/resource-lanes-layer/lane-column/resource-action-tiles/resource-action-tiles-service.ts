import { computed, inject, Injectable, InputSignal, Signal } from '@angular/core';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import { DEFAULT_SNACKBAR_DURATION, RESOURCE_ACTION_COMPONENT_HEIGHT } from '@util/app-config/index';
import {
  ActionDisplayTile,
  modifyResourceActionInPlan,
  Plan,
  removeResourceActionFromPlan,
  ResourceAction,
  ResourceLane,
} from '@util/data-types/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { format, subMinutes } from 'date-fns';
import { SnackConfirmDelete } from './snack-confirm-delete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';

@Injectable()
export class ResourceActionTilesService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly db = inject(PlansDataService);
  private readonly planEditorData = inject(PlanEditorDataService);

  plan = this.planEditorData.currentPlan;

  // Computed Signal Factories
  // -------------------------

  /**
   * compute the actions for this resource lane
   */
  computedResourceActions(resourceLane: InputSignal<ResourceLane>) {
    return computed(() => resourceLane().kitchenResource.actions);
  }

  /**
   * compute the resource action display tiles for this resoirce lane
   */
  computedActionDisplayTiles(
    resourceActions: Signal<ResourceAction[]>
    // planEndTime: Signal<Date>,
    // planTimeWindow: Signal<TimeWindow>
  ) {
    return computed(() => {
      const actions = resourceActions();
      const planEnd = this.planEditorData.planEndTime();
      const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
      const { startHours } = this.planEditorData.planTimeWindow();
      return actions.map((a, index) => {
        const time = subMinutes(planEnd, a.timeOffset);
        return {
          index,
          resourceAction: a,
          xPx: 0,
          yPx: (getMinutesSinceMidnight(time) / 60 - startHours) * pixelsPerHour - RESOURCE_ACTION_COMPONENT_HEIGHT / 2,
          time: format(time, 'HH:mm'),
        } as ActionDisplayTile;
      });
    });
  }

  // Public Methods
  // --------------

  deleteResourceAction(plan: Plan, resourceLane: ResourceLane, actionIndex: number): void {
    this.snackBar
      .openFromComponent(SnackConfirmDelete, {
        duration: 0,
        verticalPosition: 'bottom',
      })
      .onAction()
      .subscribe({
        next: () => this.doDeleteResourceAction(plan, resourceLane, actionIndex),
      });
  }

  modifyResourceAction(plan: Plan, resourceLane: ResourceLane, actionIndex: number, newTime: Date): void {
    const timeOffset = Math.max(0, getMinutesSinceMidnight(plan.properties.endTime) - getMinutesSinceMidnight(newTime));
    const modifiedAction: ResourceAction = { ...resourceLane.kitchenResource.actions[actionIndex], timeOffset };
    if (modifiedAction.timeOffset === resourceLane.kitchenResource.actions[actionIndex].timeOffset) {
      return;
    }
    if (modifiedAction.timeOffset < 0) {
      this.snackBar.open('Can not create action beyond the end of the plan.', 'Close', {
        duration: DEFAULT_SNACKBAR_DURATION,
      });
      return;
    }
    const newPlan = modifyResourceActionInPlan(plan, resourceLane, actionIndex, modifiedAction);
    this.db
      .updatePlanProperties(plan.properties.id, { kitchenResources: newPlan.properties.kitchenResources })
      .subscribe({
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
          console.error('Error moving resource action', error);
        },
      });
  }

  // Private Methods
  // ---------------

  private doDeleteResourceAction(plan: Plan, resourceLane: ResourceLane, actionIndex: number): void {
    const newPlan = removeResourceActionFromPlan(plan, resourceLane, actionIndex);
    this.db
      .updatePlanProperties(plan.properties.id, { kitchenResources: newPlan.properties.kitchenResources })
      .subscribe({
        next: () => {
          this.snackBar.open('Resource action deleted.', 'Close', {
            duration: DEFAULT_SNACKBAR_DURATION,
          });
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
          console.error('Error deleting resource action', error);
        },
      });
  }
}
