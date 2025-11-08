import { Type } from '@angular/core';
import { DropArea, DropAreaData, DropAreaDragProps } from '../drop-area';
import { PreviewComponentBase } from '../preview-component-base';
import { pointInRect } from '@util/data-types/index';

export interface DropAreaResourceLaneHeaderData extends DropAreaData {}

export class DropAreaResourceLaneHeader extends DropArea implements DropAreaResourceLaneHeaderData {
  constructor(configData: DropAreaResourceLaneHeaderData) {
    super(configData as DropAreaData);
  }

  drag(props: DropAreaDragProps): Type<PreviewComponentBase> | null {
    if (this.outsideDropArea(props)) {
      return null;
    }
    const { dragId } = props;
    const acceptedOperation = this.acceptedDragOperations.get(dragId);
    return acceptedOperation ? acceptedOperation.previewComponent : null;
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
}
