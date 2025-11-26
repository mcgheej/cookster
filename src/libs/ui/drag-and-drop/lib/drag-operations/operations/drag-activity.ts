import { DragEndProps, DragMoveProps, DragOperation, DragResult, DragStartProps } from '../drag-operation';

export class DragActivity extends DragOperation {
  // Implementation for moving an activity within and/or between resource lanes

  start(props: DragStartProps): void {}

  move(props: DragMoveProps): void {}

  end(props: DragEndProps): DragResult | undefined {
    return undefined;
  }
}
