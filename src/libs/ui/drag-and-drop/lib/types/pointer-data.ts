import { Point } from '@util/data-types/index';

export interface PointerData {
  rawPosition: Point;
  dragPosition: Point;
  offsetPosition: Point;
  shiftKey: boolean;
}
