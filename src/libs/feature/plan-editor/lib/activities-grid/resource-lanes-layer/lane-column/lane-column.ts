import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import {
  DEFAULT_ACTIVITY_COLOR,
  DEFAULT_COLOR_OPACITY,
  DEFAULT_SNACKBAR_DURATION,
  googleColors,
  INITIAL_ACTIVITY_DURATION_MINS,
  RESOURCE_ACTION_COMPONENT_HEIGHT,
} from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { ActionDisplayTile, ActivityDB, activityDBsEqual, DisplayTile, Plan } from '@util/data-types/index';
import { laneWidthPx, ResourceLane, resourceLanesEqual } from '@util/data-types/lib/resource-lane';
import { exceedsMaxParallelActivities, Tiler } from '@util/tiler/index';
import { format, getHours, getMinutes, isSameMinute, subMinutes } from 'date-fns';
import { ActivityTile } from './activity-tile/activity-tile';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { ResourceActionTile } from './resource-action-tile/resource-action-tile';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ActivityPropertiesDialogData,
  ActivityPropertiesDialog,
  openActivityPropertiesDialog,
} from '@ui/dialog-activity-properties/index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/lib/plans-data';

@Component({
  selector: 'ck-lane-column',
  imports: [CommonModule, ActivityTile, ResourceActionTile],
  templateUrl: './lane-column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Tiler],
})
export class LaneColumn {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly plansData = inject(PlansDataService);
  private readonly tiler = inject(Tiler);

  readonly resourceLane = input.required<ResourceLane>();

  /**
   * compute resource lane that is truly distinct
   */
  protected readonly distinctResourceLane = computed(() => this.resourceLane(), {
    equal: (a, b) => resourceLanesEqual(a, b),
  });

  /**
   * compute the activities for this resource lane
   */
  protected resourceActivities = computed(
    () => {
      const lane = this.resourceLane();
      return this.planEditorData.activities().filter((a) => a.resourceIndex === lane.kitchenResource.index);
    },
    {
      equal: (a, b) => {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!activityDBsEqual(a[i], b[i])) {
            return false;
          }
        }
        return true;
      },
    }
  );

  /**
   * compute plan end time
   */
  protected planEndTime = computed(
    () => {
      return this.planEditorData.currentPlan()?.properties.endTime || new Date(0);
    },
    { equal: (a, b) => isSameMinute(a, b) }
  );

  /**
   * compute the actions for this resource lane
   */
  protected resourceActions = computed(() => this.resourceLane().kitchenResource.actions);

  /**
   * compute the activity tiles for this resource lane
   */
  protected readonly activityTiles = computed(() => {
    const planEnd = this.planEndTime();
    const lane = this.distinctResourceLane();
    const activities = this.resourceActivities();
    const selectedActivityId = this.planEditorData.selectedActivityId();
    const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
    const timeWindow = this.planEditorData.activitiesGridTimeWindow();
    if (isSameMinute(planEnd, new Date(0))) {
      return [];
    }
    const displayTiles = this.tiler.generateDisplayTiles(activities, planEnd, {
      pixelsPerHour,
      timeWindow,
      laneWidthPx: laneWidthPx[lane.laneWidth],
      leftMarginPx: 4,
      rightMarginPx: 16,
      gapPx: 4,
    });
    return displayTiles.map((item) => ({ ...item, styles: this.getStyles(item, selectedActivityId) }));
  });

  /**
   * compute the resource action display tiles for this resoirce lane
   */
  protected readonly actionDisplayTiles = computed(() => {
    const resourceActions = this.resourceActions();
    const planEnd = this.planEndTime();
    const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
    const { startHours } = this.planEditorData.activitiesGridTimeWindow();
    return resourceActions.map((a, index) => {
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

  private getStyles(item: DisplayTile, selectedActivityId: string): Record<string, string> {
    const color = googleColors[item.activity.color].color;
    let borderColor = color;
    let borderWidth = '2px';
    if (item.activity.id === selectedActivityId) {
      borderColor = googleColors[item.activity.color].contrastColor;
      borderWidth = '4px';
    }
    const backgroundColor = opaqueColor(color, DEFAULT_COLOR_OPACITY);
    const border = `2px solid ${borderColor}`;
    const borderLeftWidth = `${borderWidth}`;
    const borderRightWidth = `${borderWidth}`;
    return {
      boxSizing: 'border-box',
      border,
      borderLeftWidth,
      borderRightWidth,
      position: 'absolute',
      top: `${item.topPx}px`,
      left: `${item.leftPx}px`,
      width: `${item.widthPx}px`,
      height: `${item.heightPx}px`,
      backgroundColor,
      borderRadius: '6px',
    };
  }

  private createActivity(minutesSinceMidnight: number, resourceLane: ResourceLane, plan: Plan): void {
    const newActivity = this.createActivityInstance(minutesSinceMidnight, resourceLane, plan);
    const dialogRef = openActivityPropertiesDialog({ activity: newActivity, plan: plan }, this.dialog);
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
