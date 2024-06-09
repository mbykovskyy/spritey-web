"use client";

export interface Dimension {
  width: number;
  height: number;
}

export function findPowerOfTwo(value: number) {
  return value <= 0 ? 1 : 1 << (32 - Math.clz32(value - 1));
}
