import { computed, inject, Injectable, InputSignal, Signal } from '@angular/core';
import { PlanEditorDataService } from '../../../plan-editor-data-service';
import {
  ActivityDB,
  FULL_TIME_WINDOW,
  Plan,
  ResourceLane,
  resourceLanesEqual,
  TimeWindow,
} from '@util/data-types/index';
import {
  AcceptedDragOperation,
  DropAreaResourceLaneColumn,
  PreviewChangeActivityDuration,
  PreviewMoveActionInResourceLaneColumn,
  PreviewMoveActivity,
  PreviewNewActionInResourceLaneColumn,
  PreviewTetheredPlanEnd,
  PreviewUntetheredPlanEnd,
} from '@ui/drag-and-drop/index';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { openActivityDialog } from '@ui/activity-dialog/index';
import { exceedsMaxParallelActivities } from '@util/tiler/index';
import {
  DEFAULT_ACTIVITY_COLOR,
  DEFAULT_SNACKBAR_DURATION,
  INITIAL_ACTIVITY_DURATION_MINS,
} from '@util/app-config/index';
import { getHours, getMinutes } from 'date-fns';

@Injectable()
export class LaneColumnService {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly plansData = inject(PlansDataService);
  private readonly planEditorData = inject(PlanEditorDataService);

  private readonly plan = this.planEditorData.currentPlan;
  private readonly pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour;
  private readonly planTimeWindow = this.planEditorData.planTimeWindow;

  // Computed Signal Factories
  // -------------------------

  /**
   * compute resource lane that is truly distinct
   */
  computedDistinctResourceLane(resourceLane: InputSignal<ResourceLane>) {
    return computed(() => resourceLane(), {
      equal: (a, b) => resourceLanesEqual(a, b),
    });
  }

  /**
   * compute drop area object from this resoiurce lane
   */
  computedDropArea(resourceLane: Signal<ResourceLane>) {
    return computed(() => {
      const index = resourceLane().kitchenResource.index;
      const dragNewResourceActionId = `drag-new-resource-action-lane-${index}`;
      const dragMoveResourceActionId = `drag-move-resource-action-lane-${index}`;
      const dropId = `drop-area-resource-lane-column-${index}`;
      return new DropAreaResourceLaneColumn({
        id: dropId,
        acceptedDragOperations: new Map<string, AcceptedDragOperation>([
          [
            dragNewResourceActionId,
            new AcceptedDragOperation(dragNewResourceActionId, dropId, PreviewNewActionInResourceLaneColumn),
          ],
          [
            dragMoveResourceActionId,
            new AcceptedDragOperation(dragMoveResourceActionId, dropId, PreviewMoveActionInResourceLaneColumn),
          ],
          [
            'drag-tethered-plan-end',
            new AcceptedDragOperation('drag-tethered-plan-end', dropId, PreviewTetheredPlanEnd),
          ],
          [
            'drag-untethered-plan-end',
            new AcceptedDragOperation('drag-untethered-plan-end', dropId, PreviewUntetheredPlanEnd),
          ],
          [
            'drag-change-activity-duration',
            new AcceptedDragOperation('drag-change-activity-duration', dropId, PreviewChangeActivityDuration),
          ],
          ['drag-activity', new AcceptedDragOperation('drag-activity', dropId, PreviewMoveActivity)],
        ]),
        scrollX: this.planEditorData.activitiesGridScrollX,
        scrollY: this.planEditorData.activitiesGridScrollY,
        resourceLane: resourceLane,
        pixelsPerHour: this.planEditorData.activitiesGridPixelsPerHour,
        timeWindow: this.planEditorData.planTimeWindow,
        timeSnapMins: this.planEditorData.timeSnapMins,
        activitiesGridRect: this.planEditorData.activitiesGridRect,
        activitiesGridBoundingRect: this.planEditorData.activitiesGridBoundingRect,
      });
    });
  }

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

  // private Methods
  // ----------------

  private createActivity(minutesSinceMidnight: number, resourceLane: ResourceLane, plan: Plan): void {
    const newActivity = this.createActivityInstance(minutesSinceMidnight, resourceLane, plan);
    const dialogRef = openActivityDialog({ activity: newActivity, plan: plan }, this.dialog);
    dialogRef.afterClosed().subscribe((newActivity) => {
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
      startTimeOffset: calcStartTimeOffsetToQuarterHour(plan.properties.endTime, minutesSinceMidnight),
      planId: plan.properties.id,
      resourceIndex: resourceLane.kitchenResource.index,
    } as ActivityDB;
  }
}

function calcStartTimeOffsetToQuarterHour(endDate: Date, minutesFromDayStart: number): number {
  return getHours(endDate) * 60 + getMinutes(endDate) - Math.round(minutesFromDayStart / 15) * 15;
}
