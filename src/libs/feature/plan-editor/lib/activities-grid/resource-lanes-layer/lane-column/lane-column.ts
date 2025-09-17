import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { PlanEditorDataService } from '@feature/plan-editor/lib/plan-editor-data-service';
import { DEFAULT_COLOR_OPACITY, googleColors, RESOURCE_ACTION_COMPONENT_HEIGHT } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { ActionDisplayTile, activityDBsEqual, DisplayTile } from '@util/data-types/index';
import { laneWidthPx, ResourceLane, resourceLanesEqual } from '@util/data-types/lib/resource-lane';
import { Tiler } from '@util/tiler/index';
import { format, isSameMinute, subMinutes } from 'date-fns';
import { ActivityTile } from './activity-tile/activity-tile';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';
import { ResourceActionTile } from './resource-action-tile/resource-action-tile';

@Component({
  selector: 'ck-lane-column',
  imports: [CommonModule, ActivityTile, ResourceActionTile],
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

  /**
   * compute the activity tiles for this resource lane
   */
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

  // Private Methods
  // ---------------

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
