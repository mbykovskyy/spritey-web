"use client";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Checks whether r1 Rectangle entirely contains r2
export function contains(r1: Rectangle, r2: Rectangle) {
  return (
    r2.x >= r1.x &&
    r2.y >= r1.y &&
    (r2.x + r2.width) <= (r1.x + r1.width) &&
    (r2.y + r2.height) <= (r1.y + r1.height)
  );
}

// Checks whether r1 and r2 Rectangles intersects
export function intersects(r1: Rectangle, r2: Rectangle) {
  return !(
    (r1.x + r1.width < r2.x) ||
    r1.x > (r2.x + r2.width) ||
    (r1.y + r1.height) < r2.y ||
    r1.y > (r2.y + r2.height)
  );
}

// Subtracts r2 rectangle from r1
export function subtract(r1: Rectangle, r2: Rectangle) {
  if (!intersects(r2, r1)) {
    return [r1];
  }

  const results = [];

  if (r2.x > r1.x) {
    results.push({x: r1.x, y: r1.y, width: r2.x - r1.x, height: r1.height});
  }

  if (r2.x + r2.width < r1.x + r1.width) {
    results.push({x: r2.x + r2.width, y: r1.y, width: r1.x + r1.width - (r2.x + r2.width), height: r1.height});
  }

  if (r2.y > r1.y) {
    results.push({x: r1.x, y: r1.y, width: r1.width, height: r2.y - r1.y});
  }

  if (r2.y + r2.height < r1.y + r1.height) {
    results.push({x: r1.x, y: r2.y + r2.height, width: r1.width, height: r1.y + r1.height - (r2.y + r2.height)});
  }

  return results;
}
