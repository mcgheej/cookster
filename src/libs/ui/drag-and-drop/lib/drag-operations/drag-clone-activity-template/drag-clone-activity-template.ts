import { DragEndProps, DragMoveProps, DragOperation, DragResult, DragStartProps } from '../drag-operation';

export class DragCloneActivityTemplate extends DragOperation {
  // Implementation for cloning an activity template by dragging

  start(props: DragStartProps): void {}

  move(props: DragMoveProps): void {}

  end(props: DragEndProps): DragResult | undefined {
    return undefined;
  }
}
