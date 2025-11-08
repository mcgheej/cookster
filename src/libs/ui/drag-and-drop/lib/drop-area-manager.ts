import { Injectable } from '@angular/core';
import { DropArea } from './drop-areas/drop-area';

@Injectable({ providedIn: 'root' })
export class DropAreasManager {
  private dropAreas = new Map<string, DropArea>();

  /**
   * Registers a drop area for drag/drop operations.
   * This is called by each area that can accept drag-and-drop items.
   */
  registerDropArea(dropArea: DropArea): void {
    this.dropAreas.set(dropArea.id, dropArea);
  }

  deRegisterDropArea(id: string): void {
    this.dropAreas.delete(id);
  }

  getDropAreasByDragOperation(dragOperationId: string): DropArea[] {
    return Array.from(this.dropAreas.values()).filter((area) => {
      const dragOp = area.acceptedDragOperations.get(dragOperationId);
      return !!dragOp;
    });
  }
}
