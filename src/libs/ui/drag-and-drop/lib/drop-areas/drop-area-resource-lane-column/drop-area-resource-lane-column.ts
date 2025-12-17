import { Signal } from '@angular/core';
import { DropArea, DropAreaCheckResult, DropAreaData, DropAreaDragProps } from '../drop-area';
import { pointInRect, ResourceLane, TimeWindow } from '@util/data-types/index';
import { rectIntersection } from '@util/misc-utilities/index';
import { getMinutesSinceMidnight } from '@util/date-utilities/index';

export interface DropAreaResourceLaneColumnData extends DropAreaData {
  scrollX: Signal<number>;
  scrollY: Signal<number>;
  resourceLane: Signal<ResourceLane>;
  pixelsPerHour: Signal<number>;
  timeWindow: Signal<TimeWindow>;
  timeSnapMins: Signal<number>;
  activitiesGridRect: Signal<DOMRect>;
  activitiesGridBoundingRect: Signal<DOMRect>;
}

export class DropAreaResourceLaneColumn extends DropArea implements DropAreaResourceLaneColumnData {
  scrollX: Signal<number>;
  scrollY: Signal<number>;
  resourceLane: Signal<ResourceLane>;
  pixelsPerHour: Signal<number>;
  timeWindow: Signal<TimeWindow>;
  timeSnapMins: Signal<number>;
  activitiesGridRect: Signal<DOMRect>;
  activitiesGridBoundingRect: Signal<DOMRect>;

  constructor(configData: DropAreaResourceLaneColumnData) {
    super(configData as DropAreaData);
    this.scrollX = configData.scrollX;
    this.scrollY = configData.scrollY;
    this.resourceLane = configData.resourceLane;
    this.pixelsPerHour = configData.pixelsPerHour;
    this.timeWindow = configData.timeWindow;
    this.timeSnapMins = configData.timeSnapMins;
    this.activitiesGridRect = configData.activitiesGridRect;
    this.activitiesGridBoundingRect = configData.activitiesGridBoundingRect;
  }

  check(props: DropAreaDragProps): DropAreaCheckResult {
    if (this.outsideDropArea(props)) {
      return { previewComponent: null };
    }
    const { dragId } = props;
    const acceptedOperation = this.acceptedDragOperations.get(dragId);
    const clipArea = this.getClipArea();
    return acceptedOperation
      ? { previewComponent: acceptedOperation.previewComponent, clipArea }
      : { previewComponent: null };
  }

  getVerticalPositionFromTime(time: Date): number {
    if (!this.hostElement) {
      return 0;
    }
    const laneRect = this.hostElement.getBoundingClientRect();
    const M = getMinutesSinceMidnight(time);
    const P = this.pixelsPerHour();
    const T = laneRect.top;
    const S = this.timeWindow().startHours;
    return Math.round((P * (M - 60 * S)) / 60 + T);
  }

  private outsideDropArea(props: DropAreaDragProps): boolean {
    if (this.hostElement) {
      const rect = this.hostElement.getBoundingClientRect();
      const topVisibleDropArea = rect.top - this.scrollY();
      const bottomVisibleDropArea = topVisibleDropArea + this.activitiesGridRect().height - 1;
      const dragPosition = props.pointerPos.dragPosition;
      if (
        pointInRect(dragPosition, rect) &&
        dragPosition.y >= topVisibleDropArea &&
        dragPosition.y <= bottomVisibleDropArea
      ) {
        return false;
      }
    }
    return true;
  }

  private getClipArea(): DOMRect | undefined {
    if (this.hostElement) {
      const rect = this.hostElement.getBoundingClientRect();
      const visibleGridRect = DOMRect.fromRect({
        x: this.activitiesGridBoundingRect().x,
        y: this.activitiesGridBoundingRect().y,
        width: this.activitiesGridRect().width,
        height: this.activitiesGridRect().height,
      });
      return rectIntersection(rect, visibleGridRect);
    }
    return undefined;
  }
}
