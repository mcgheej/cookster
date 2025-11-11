import { DragOperation } from '../drag-operations/drag-operation';
import { PointerData } from '../types/pointer-data';
import { DropArea } from './drop-area';

export interface PreviewComponentProps {
  pointerPos: PointerData;
  dropArea: DropArea | null;
  dragOp: DragOperation;
  clipArea: DOMRect | undefined;
}

export abstract class PreviewComponentBase {}
