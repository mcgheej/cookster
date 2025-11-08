import { DragEndProps, DragMoveProps, DragOperation, DragStartProps } from '../drag-operation';

export class DragMoveResourceAction extends DragOperation {
  // Implementation for moving  a resource action in a resource lane

  start(props: DragStartProps): void {}

  move(props: DragMoveProps): void {}

  end(props: DragEndProps): void {}
}
