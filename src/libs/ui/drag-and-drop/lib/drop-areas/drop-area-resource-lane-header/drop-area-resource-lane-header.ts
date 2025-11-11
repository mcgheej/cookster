import { Signal } from '@angular/core';
import { DropArea, DropAreaCheckResult, DropAreaData, DropAreaDragProps } from '../drop-area';
import { pointInRect } from '@util/data-types/index';
import { rectIntersection } from '@util/misc-utilities/index';

export interface DropAreaResourceLaneHeaderData extends DropAreaData {
  scrollX: Signal<number>;
  activitiesGridBoundingRect: Signal<DOMRect>;
}

export class DropAreaResourceLaneHeader extends DropArea implements DropAreaResourceLaneHeaderData {
  scrollX: Signal<number>;
  activitiesGridBoundingRect: Signal<DOMRect>;

  constructor(configData: DropAreaResourceLaneHeaderData) {
    super(configData as DropAreaData);
    this.scrollX = configData.scrollX;
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

  private outsideDropArea(props: DropAreaDragProps): boolean {
    if (this.hostElement) {
      const rect = this.hostElement.getBoundingClientRect();
      if (pointInRect(props.pointerPos.dragPosition, rect)) {
        return false;
      }
    }
    return true;
  }

  private getClipArea(): DOMRect | undefined {
    if (this.hostElement) {
      const rect = this.hostElement.getBoundingClientRect();
      const activitiesGridBoundingRect = this.activitiesGridBoundingRect();
      const headersRect = DOMRect.fromRect({
        x: activitiesGridBoundingRect.x,
        y: rect.y,
        width: activitiesGridBoundingRect.width,
        height: rect.height,
      });
      return rectIntersection(rect, headersRect);
    }
    return undefined;
  }
}
