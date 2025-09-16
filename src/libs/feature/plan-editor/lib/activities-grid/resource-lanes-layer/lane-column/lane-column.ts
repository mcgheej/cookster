import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import { DEFAULT_COLOR_OPACITY, googleColors } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { activityDBsEqual, DisplayTile } from '@util/data-types/index';
import { laneWidthPx, ResourceLane, resourceLanesEqual } from '@util/data-types/lib/resource-lane';
import { Tiler } from '@util/tiler/index';
import { isSameMinute } from 'date-fns';
import { ActivityTile } from './activity-tile/activity-tile';

@Component({
  selector: 'ck-lane-column',
  imports: [CommonModule, ActivityTile],
  templateUrl: './lane-column.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Tiler],
})
export class LaneColumn {
  private readonly planEditorData = inject(PlanEditorDataService);
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

  protected readonly activityTiles = computed(() => {
    const planEnd = this.planEndTime();
    const lane = this.distinctResourceLane();
    const activities = this.resourceActivities();
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
    return displayTiles.map((item) => ({ ...item, styles: this.getStyles(item) }));
  });

  private getStyles(item: DisplayTile): Record<string, string> {
    const borderColor = googleColors[item.activity.color].color;
    const backgroundColor = opaqueColor(borderColor, DEFAULT_COLOR_OPACITY);
    const border = `2px solid ${borderColor}`;
    return {
      boxSizing: 'border-box',
      border,
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
