import { Renderer2 } from '@angular/core';
import { DragAndDropOverlay } from '../drag-and-drop-overlay';
import { DropArea } from '../drop-areas/drop-area';
import { DragLockAxis } from '../types/drag-lock-axis';
import { PointerData } from '../types/pointer-data';

export interface DragData {
  id: string;
  lockAxis?: DragLockAxis;
}

export interface DragStartProps {
  pointerPos: PointerData;
  associatedDropAreas: DropArea[];
  overlayService: DragAndDropOverlay;
  renderer: Renderer2;
}

export interface DragMoveProps {
  pointerPos: PointerData;
  overlayService: DragAndDropOverlay;
  renderer: Renderer2;
}

export interface DragEndProps {
  pointerPos: PointerData;
  overlayService: DragAndDropOverlay;
  renderer: Renderer2;
}

export interface DragResult {}

export abstract class DragOperation implements DragData {
  id: string;
  lockAxis?: DragLockAxis;

  constructor(configData: DragData) {
    this.id = configData.id;
    this.lockAxis = configData.lockAxis;
  }

  abstract start(props: DragStartProps): void;
  abstract move(props: DragMoveProps): void;
  abstract end(props: DragEndProps): DragResult | undefined;
}
