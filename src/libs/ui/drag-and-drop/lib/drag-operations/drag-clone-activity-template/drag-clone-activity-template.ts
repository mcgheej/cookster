import { DragEndProps, DragMoveProps, DragOperation, DragStartProps } from '../drag-operation';

export class DragCloneActivityTemplate extends DragOperation {
  // Implementation for cloning an activity template by dragging

  start(props: DragStartProps): void {}

  move(props: DragMoveProps): void {}

  end(props: DragEndProps): void {}
}
