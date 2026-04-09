import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { addResourceActionToPlan, Plan, ResourceAction, ResourceLane } from '@util/data-types/index';
import { PlanEditorDataService } from './plan-editor-data-service';
import { addMinutes, compareAsc, format, startOfDay } from 'date-fns';
import { DEFAULT_SNACKBAR_DURATION } from '@util/app-config/index';
import { GenericInputDialog, GenericInputDialogData } from '@ui/dialog-generic-input/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';

@Injectable()
export class ResourceActionService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);
  private readonly planEditorData = inject(PlanEditorDataService);

  private readonly plan = this.planEditorData.currentPlan;
  private readonly pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour;
  private readonly planTimeWindow = this.planEditorData.planTimeWindow;

  // Public Methods
  // --------------

  createNewResourceAction(ev: MouseEvent, resourceLane: ResourceLane): void {
    const plan = this.plan();
    if (!plan) {
      return;
    }
    const minsSinceMidnight =
      Math.round((ev.offsetY / this.pixelsPerHour()) * 60) + this.planTimeWindow().startHours * 60;
    const actionTime = addMinutes(startOfDay(plan.properties.endTime), Math.round(minsSinceMidnight / 15) * 15);
    this.createResourceActionFromTime(plan, resourceLane, actionTime);
  }

  createResourceActionFromTime(plan: Plan, resourceLane: ResourceLane, actionTime: Date): void {
    if (compareAsc(actionTime, plan.properties.endTime) > 0) {
      this.snackBar.open('Can not create action beyond the end of the plan.', 'Close', {
        duration: DEFAULT_SNACKBAR_DURATION,
      });
      return;
    }
    this.dialog
      .open<GenericInputDialog, GenericInputDialogData, string | undefined>(GenericInputDialog, {
        data: {
          title: 'New Resource Action',
          description: `Enter a name for the new action at ${format(actionTime, 'HH:mm')}.`,
          inputLabel: 'Resource Action Name',
          inputPlaceholder: '',
          inputValue: '',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const timeOffset = Math.max(
            0,
            getMinutesSinceMidnight(plan.properties.endTime) - getMinutesSinceMidnight(actionTime)
          );
          const newAction: ResourceAction = { name: result, timeOffset };
          const newPlan = addResourceActionToPlan(plan, resourceLane, newAction);
          this.plansData
            .updatePlanProperties(plan.properties.id, { kitchenResources: newPlan.properties.kitchenResources })
            .subscribe({
              next: () => {
                this.snackBar.open(`Resource action "${result}" created.`, 'Close', {
                  duration: DEFAULT_SNACKBAR_DURATION,
                });
              },
              error: (error) => {
                this.snackBar.open(error.message, 'Close', { duration: DEFAULT_SNACKBAR_DURATION });
                console.error('Error creating resource action', error);
              },
            });
        }
      });
  }
}
