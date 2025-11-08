import { DragEndProps, DragMoveProps, DragOperation, DragStartProps } from '../drag-operation';

export class DragChangeActivityDuration extends DragOperation {
  // Implementation for changing the duration of an activity by dragging handle on
  // bottom edge of activity tile.

  start(props: DragStartProps): void {}

  move(props: DragMoveProps): void {}

  end(props: DragEndProps): void {}
}
