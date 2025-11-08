import { DragEndProps, DragMoveProps, DragOperation, DragStartProps } from '../drag-operation';

export class DragPlanEnd extends DragOperation {
  // Implementation for dragging the end of a plan

  start(props: DragStartProps): void {}

  move(props: DragMoveProps): void {}

  end(props: DragEndProps): void {}
}
