import { Injectable, computed, InputSignal, inject, Signal } from '@angular/core';
import { PlanEditorDataService } from '../../../plan-editor-data-service';
import {
  ActionDisplayTile,
  ActivityDB,
  activityDBsEqual,
  DisplayTile,
  laneWidthPx,
  ResourceAction,
  ResourceLane,
  resourceLanesEqual,
} from '@util/data-types/index';
import {
  AcceptedDragOperation,
  DropAreaResourceLaneColumn,
  PreviewNewActionInResourceLaneColumn,
} from '@ui/drag-and-drop/index';
import { format, isSameMinute, subMinutes } from 'date-fns';
import { Tiler } from '@util/tiler/index';
import { DEFAULT_COLOR_OPACITY, googleColors, RESOURCE_ACTION_COMPONENT_HEIGHT } from '@util/app-config/index';
import { opaqueColor } from '@util/color-utilities/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';

@Injectable()
export class LaneColumnService {
  private readonly planEditorData = inject(PlanEditorDataService);
  private readonly tiler = inject(Tiler);

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
  computedDropArea(resourceLane: InputSignal<ResourceLane>) {
    return computed(() => {
      const index = resourceLane().kitchenResource.index;
      const dragId = `drag-new-resource-action-lane-${index}`;
      const dropId = `drop-area-resource-lane-column-${index}`;
      return new DropAreaResourceLaneColumn({
        id: dropId,
        acceptedDragOperations: new Map<string, AcceptedDragOperation>([
          [dragId, new AcceptedDragOperation(dragId, dropId, PreviewNewActionInResourceLaneColumn)],
        ]),
        scrollX: this.planEditorData.activitiesGridScrollX,
        scrollY: this.planEditorData.activitiesGridScrollY,
        resourceLane: resourceLane,
        pixelsPerHour: this.planEditorData.activitiesGridPixelsPerHour,
        timeWindow: this.planEditorData.activitiesGridTimeWindow,
        timeSnapMins: this.planEditorData.timeSnapMins,
        activitiesGridRect: this.planEditorData.activitiesGridRect,
        activitiesGridBoundingRect: this.planEditorData.activitiesGridBoundingRect,
      });
    });
  }

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
   * compute plan end time
   */
  computedPlanEndTime() {
    return computed(
      () => {
        return this.planEditorData.currentPlan()?.properties.endTime || new Date(0);
      },
      { equal: (a, b) => isSameMinute(a, b) }
    );
  }

  /**
   * compute the actions for this resource lane
   */
  computedResourceActions(resourceLane: InputSignal<ResourceLane>) {
    return computed(() => resourceLane().kitchenResource.actions);
  }

  /**
   * compute the activity tiles for this resource lane
   */
  computedActivityTiles(
    distinctResourceLane: Signal<ResourceLane>,
    resourceActivities: Signal<ActivityDB[]>,
    planEndTime: Signal<Date>
  ) {
    return computed(() => {
      const planEnd = planEndTime();
      const lane = distinctResourceLane();
      const activities = resourceActivities();
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
  }

  /**
   * compute the resource action display tiles for this resoirce lane
   */
  computedActionDisplayTiles(resourceActions: Signal<ResourceAction[]>, planEndTime: Signal<Date>) {
    return computed(() => {
      const actions = resourceActions();
      const planEnd = planEndTime();
      const pixelsPerHour = this.planEditorData.activitiesGridPixelsPerHour();
      const { startHours } = this.planEditorData.activitiesGridTimeWindow();
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
