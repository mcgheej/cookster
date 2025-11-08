import { Type } from '@angular/core';
import { DropArea, DropAreaData, DropAreaDragProps } from '../drop-area';
import { PreviewComponentBase } from '../preview-component-base';

export interface DropAreaResourceLaneColumnData extends DropAreaData {}

export class DropAreaResourceLaneColumn extends DropArea implements DropAreaResourceLaneColumnData {
  constructor(configData: DropAreaResourceLaneColumnData) {
    super(configData as DropAreaData);
  }

  drag(props: DropAreaDragProps): Type<PreviewComponentBase> | null {
    return null;
  }
}
