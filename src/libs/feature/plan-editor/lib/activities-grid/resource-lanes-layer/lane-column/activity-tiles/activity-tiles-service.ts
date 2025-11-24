import { computed, inject, Injectable, InputSignal, Signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlansDataService } from '@data-access/plans/index';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import { DEFAULT_COLOR_OPACITY, DEFAULT_SNACKBAR_DURATION, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { ActivityDB, activityDBsEqual, DisplayTile, laneWidthPx, ResourceLane } from '@util/data-types/index';
import { Tiler } from '@util/tiler/index';
import { isSameMinute } from 'date-fns';

@Injectable()
export class ActivityTilesService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly db = inject(PlansDataService);
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly tiler = inject(Tiler);

  // Computed Signal Factories
  // -------------------------

  /**
   * compute the activities for this resource lane
   */
  computedResourceActivities(resourceLane: InputSignal<ResourceLane>) {
    return computed(
      () => {
        const lane = resourceLane();
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
  }

  /**
   * compute the activity tiles for this resource lane
   */
  computedActivityTiles(resourceLane: Signal<ResourceLane>, resourceActivities: Signal<ActivityDB[]>) {
    return computed(() => {
      const planEnd = this.planEditorData.planEndTime();
      const lane = resourceLane();
      const activities = resourceActivities();
      const selectedActivityId = this.planEditorData.selectedActivityId();
      const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
      const timeWindow = this.planEditorData.planTimeWindow();
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
  }

  // Public Methods
  // --------------

  updateActivityDuration(activityId: string, newDurationMins: number): void {
    this.db.updateActivity(activityId, { duration: newDurationMins }).subscribe({
      error: (err) => {
        console.error('Error updating activity duration', err);
        this.snackBar.open('Error updating activity duration', undefined, { duration: DEFAULT_SNACKBAR_DURATION });
      },
    });
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
}
