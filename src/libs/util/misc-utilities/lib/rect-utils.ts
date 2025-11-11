export function rectIntersection(a: DOMRect, b: DOMRect): DOMRect | undefined {
  if (!rectOverlap(a, b)) {
    return;
  }
  const intersection = {
    x: Math.max(a.x, b.x),
    y: Math.max(a.y, b.y),
    width: Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
    height: Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
  };
  return DOMRect.fromRect(intersection);
}

export function rectUnion(a: DOMRect, b: DOMRect): DOMRect {
  const { right: aRight, bottom: aBottom } = a;
  const { right: bRight, bottom: bBottom } = b;
  const left = a.x < b.x ? a.x : b.x;
  const top = a.y < b.y ? a.y : b.y;
  const right = aRight > bRight ? aRight : bRight;
  const bottom = aBottom > bBottom ? aBottom : bBottom;
  return DOMRect.fromRect({ x: left, y: top, width: right - left, height: bottom - top });
}

export function rectOverlap(a: DOMRect, b: DOMRect): boolean {
  if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) {
    return true;
  } else {
    return false;
  }
}
