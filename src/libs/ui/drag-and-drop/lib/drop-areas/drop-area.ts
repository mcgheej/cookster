import { AcceptedDragOperation } from './accepted-drag-operation';
import { Type } from '@angular/core';
import { PreviewComponentBase } from './preview-component-base';
import { PointerData } from '../types/pointer-data';

export interface DropAreaData {
  id: string;
  hostElement?: HTMLElement;
  acceptedDragOperations: Map<string, AcceptedDragOperation>;
}

export interface DropAreaDragProps {
  dragId: string;
  pointerPos: PointerData;
}

export abstract class DropArea implements DropAreaData {
  id: string;
  hostElement: HTMLElement | undefined;
  acceptedDragOperations: Map<string, AcceptedDragOperation>;

  constructor(configData: DropAreaData) {
    this.id = configData.id;
    this.hostElement = configData.hostElement;
    this.acceptedDragOperations = configData.acceptedDragOperations;
  }

  abstract drag(props: DropAreaDragProps): Type<PreviewComponentBase> | null;
}
