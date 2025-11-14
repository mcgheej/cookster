import { rectIntersection } from '@util/misc-utilities/index';
import { DragOperation } from '../drag-operations/drag-operation';
import { PointerData } from '../types/pointer-data';
import { DropArea } from './drop-area';

export interface PreviewComponentProps {
  pointerPos: PointerData;
  dropArea: DropArea | null;
  dragOp: DragOperation;
  clipArea: DOMRect | undefined;
}

export abstract class PreviewComponentBase {
  protected getClipPath(clipArea: DOMRect | undefined, elementArea: DOMRect): string {
    if (clipArea) {
      const clippedRect = rectIntersection(clipArea, elementArea);
      if (clippedRect) {
        const topInset = Math.abs(clippedRect.top - elementArea.top);
        const rightInset = Math.abs(elementArea.right - clippedRect.right);
        const bottomInset = Math.abs(elementArea.bottom - clippedRect.bottom);
        const leftInset = Math.abs(clippedRect.left - elementArea.left);
        return `inset(${topInset}px ${rightInset}px ${bottomInset}px ${leftInset}px)`;
      }
    }
    return 'none';
  }
}
