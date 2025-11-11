import { AcceptedDragOperation } from './accepted-drag-operation';
import { Type } from '@angular/core';
import { PreviewComponentBase } from './preview-component-base';
import { PointerData } from '../types/pointer-data';

/**
 * id: A unique identifier for the drop area.
 * hostElement: The HTML element containing the CkDrop directive
 * acceptedDragOperations: A map of accepted drag operations for this drop area.
 */
export interface DropAreaData {
  id: string;
  hostElement?: HTMLElement;
  acceptedDragOperations: Map<string, AcceptedDragOperation>;
}

export interface DropAreaDragProps {
  dragId: string;
  pointerPos: PointerData;
}

export interface DropAreaCheckResult {
  previewComponent: Type<PreviewComponentBase> | null;
  clipArea?: DOMRect;
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

  abstract check(props: DropAreaDragProps): DropAreaCheckResult;
}
