import { inject, Injectable } from '@angular/core';
import {
  DEFAULT_ACTIVITY_COLOR,
  DEFAULT_SNACKBAR_DURATION,
  INITIAL_ACTIVITY_DURATION_MINS,
} from '@util/app-config/index';
import { ActivityDB, Plan, ResourceLane } from '@util/data-types/index';
import { getHours, getMinutes } from 'date-fns';
import { PlanEditorDataService } from './plan-editor-data-service';
import { openActivityDialog } from '@ui/activity-dialog/index';
import { exceedsMaxParallelActivities } from '@util/tiler/index';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { DeleteActivitySnack } from '@ui/snack-bars/index';

@Injectable()
export class ActivityService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);
  private readonly planEditorData = inject(PlanEditorDataService);

  private readonly plan = this.planEditorData.currentPlan;
  private readonly pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour;
  private readonly planTimeWindow = this.planEditorData.planTimeWindow;

  // Public Methods
  // --------------

  createNewActivity(ev: MouseEvent, resourceLane: ResourceLane): void {
    const plan = this.plan();
    if (!plan) {
      return;
    }

    const minsSinceMidnight =
      Math.round((ev.offsetY / this.pixelsPerHour()) * 60) + this.planTimeWindow().startHours * 60;
    this.createActivity(minsSinceMidnight, resourceLane, plan);
  }

  editActivity(activity: ActivityDB): void {
    const plan = this.plan();
    if (!plan) {
      return;
    }
    openActivityDialog({ activity, plan }, this.dialog)
      .afterClosed()
      .subscribe((newActivity) => {
        if (newActivity) {
          // check if new activity location exceeds max parallel activities for the resource lane in question
          const activitiesInLane = plan.activities.filter((a) => a.resourceIndex === newActivity.resourceIndex);
          if (exceedsMaxParallelActivities(newActivity, activitiesInLane, plan)) {
            this.snackBar.open('Max parallel activities exceeded for this resource.', undefined, {
              duration: DEFAULT_SNACKBAR_DURATION,
            });
          } else {
            const { id, ...activityUpdates } = newActivity;
            this.plansData.updateActivity(id, activityUpdates).subscribe({
              next: () => {
                this.snackBar.open('Activity updated', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
              },
              error: (err) => {
                console.error('Error updating activity', err);
                this.snackBar.open('Error updating activity', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
              },
            });
          }
        }
      });
  }

  deleteActivity(activity: ActivityDB): void {
    this.snackBar
      .openFromComponent(DeleteActivitySnack, {
        duration: 0,
        verticalPosition: 'bottom',
        data: `Delete activity "${activity.name}"?`,
      })
      .onAction()
      .subscribe(() => {
        this.doDeleteActivity(activity.id);
      });
  }

  // private Methods
  // ----------------

  private createActivity(minutesSinceMidnight: number, resourceLane: ResourceLane, plan: Plan): void {
    const newActivity = this.createActivityInstance(minutesSinceMidnight, resourceLane, plan);
    openActivityDialog({ activity: newActivity, plan: plan }, this.dialog)
      .afterClosed()
      .subscribe((newActivity) => {
        if (newActivity) {
          // check if new activity location exceeds max parallel activities for the resource lane in question
          const activitiesInLane = plan.activities.filter((a) => a.resourceIndex === newActivity.resourceIndex);
          if (exceedsMaxParallelActivities(newActivity, activitiesInLane, plan)) {
            this.snackBar.open('Max parallel activities exceeded for this resource.', undefined, {
              duration: DEFAULT_SNACKBAR_DURATION,
            });
          } else {
            this.plansData.createActivity(newActivity).subscribe({
              next: () => {
                this.snackBar.open('Activity created', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
              },
              error: (err) => {
                console.error('Error creating activity', err);
                this.snackBar.open('Error creating activity', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
              },
            });
          }
        }
      });
  }

  private createActivityInstance(minutesSinceMidnight: number, resourceLane: ResourceLane, plan: Plan): ActivityDB {
    return {
      id: '',
      name: 'New Activity',
      description: '',
      duration: INITIAL_ACTIVITY_DURATION_MINS,
      actions: [],
      color: DEFAULT_ACTIVITY_COLOR,
      startMessage: '',
      endMessage: '',
      startTimeOffset: this.calcStartTimeOffsetToQuarterHour(plan.properties.endTime, minutesSinceMidnight),
      planId: plan.properties.id,
      resourceIndex: resourceLane.kitchenResource.index,
    } as ActivityDB;
  }

  private doDeleteActivity(id: string): void {
    this.snackBar.open('Deleting activity...', undefined, { duration: 0 });
    this.plansData.deleteActivity(id).subscribe({
      next: () => {
        this.snackBar.open('Activity deleted', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
      },
      error: (error) => {
        this.snackBar.open(`Error deleting activity: ${error}`, undefined, { duration: DEFAULT_SNACKBAR_DURATION });
      },
    });
  }

  private calcStartTimeOffsetToQuarterHour(endDate: Date, minutesSinceMidnight: number): number {
    return getHours(endDate) * 60 + getMinutes(endDate) - Math.round(minutesSinceMidnight / 15) * 15;
  }
}
