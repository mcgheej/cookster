import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import {
  DEFAULT_ACTIVITY_COLOR,
  DEFAULT_SNACKBAR_DURATION,
  INITIAL_ACTIVITY_DURATION_MINS,
} from '@util/app-config/index';
import { ActivityDB, Plan } from '@util/data-types/index';
import { ResourceLane } from '@util/data-types/lib/resource-lane';
import { exceedsMaxParallelActivities, Tiler } from '@util/tiler/index';
import { getHours, getMinutes } from 'date-fns';
import { ActivityTile } from './activity-tile/activity-tile';
import { ResourceActionTile } from './resource-action-tile/resource-action-tile';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/lib/plans-data';
import { openActivityDialog } from '@ui/activity-dialog/index';
import { CkDrop } from '@ui/drag-and-drop/index';
import { LaneColumnService } from './lane-column-service';

@Component({
  selector: 'ck-lane-column',
  imports: [CommonModule, ActivityTile, ResourceActionTile, CkDrop],
  templateUrl: './lane-column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Tiler, LaneColumnService],
})
export class LaneColumn {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly plansData = inject(PlansDataService);
  private readonly service = inject(LaneColumnService);

  readonly resourceLane = input.required<ResourceLane>();

  protected readonly distinctResourceLane = this.service.computedDistinctResourceLane(this.resourceLane);
  protected readonly dropArea = this.service.computedDropArea(this.resourceLane);
  protected readonly resourceActivities = this.service.computedResourceActivities(this.resourceLane);
  protected readonly planEndTime = this.service.computedPlanEndTime();
  protected readonly resourceActions = this.service.computedResourceActions(this.resourceLane);
  protected readonly activityTiles = this.service.computedActivityTiles(
    this.resourceLane,
    this.resourceActivities,
    this.planEndTime
  );
  protected readonly actionDisplayTiles = this.service.computedActionDisplayTiles(
    this.resourceActions,
    this.planEndTime
  );

  private readonly plan = this.planEditorData.currentPlan;
  private readonly timeWindow = this.planEditorData.activitiesGridTimeWindow;
  private readonly pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour;

  // Methods
  // -------

  createNewActivity(ev: MouseEvent): void {
    ev.stopPropagation();
    const plan = this.plan();
    if (!plan) {
      return;
    }
    const minsSinceMidnight = Math.round((ev.offsetY / this.pixelsPerHour()) * 60) + this.timeWindow().startHours * 60;
    this.createActivity(minsSinceMidnight, this.resourceLane(), plan);
  }

  // Private Methods
  // ---------------

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
