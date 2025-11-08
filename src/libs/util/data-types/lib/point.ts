export interface Point {
  x: number;
  y: number;
}

export function pointInRect(point: Point, rect: DOMRect): boolean {
  return !(point.x < rect.left || point.x > rect.right || point.y < rect.top || point.y > rect.bottom);
}

export function subPoints(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function addPoints(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}
