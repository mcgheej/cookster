import { Type } from '@angular/core';
import { PreviewComponentBase } from './preview-component-base';

export class AcceptedDragOperation {
  dragId: string;
  dropAreaId: string;
  previewComponent: Type<PreviewComponentBase>;

  constructor(dragId: string, dropAreaId: string, previewComponent: Type<PreviewComponentBase>) {
    this.dragId = dragId;
    this.dropAreaId = dropAreaId;
    this.previewComponent = previewComponent;
  }
}
