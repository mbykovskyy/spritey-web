"use client";

import { Dimension } from "./dimension"
import { contains, subtract, Rectangle } from "./rectangle";
import { getExpandBy } from "./max-dimensions-constraint";
import { getExpandBy as getExpandByMaintainAspectRatio } from "./maintain-aspect-ratio-constraint";
import { getExpandBy as getExpandByMaintainPowerOfTwo } from "./power-of-two-constraint";
import { getExpandBy as getExpandByMaintianPowerOfTwoAndAspectRatio } from "./maintain-aspect-ratio-and-power-of-two-constraint";
import { Sheet } from '../types';

// Finds a location for a sprite
function findLocation(freeZones: Rectangle[], sprite: Rectangle) {
  for (const zone of freeZones) {
    const zoneLocation = { x: zone.x, y: zone.y };
    const locatedSprite = {...sprite, ...zoneLocation};

    if (contains(zone, locatedSprite)) {
      return zoneLocation;
    }
  }
  return null;
}

function removeContainedZones(zones: Rectangle[]) {
  sortZonesByArea(zones);

  const result = [];

  for (let i = 0; i < zones.length; ++i) {
    let isContained = false;

    for (let j = i + 1; j < zones.length; ++j) {
      if (contains(zones[j], zones[i])) {
        isContained = true;
        break;
      }
    }

    if (!isContained) {
      result.push(zones[i]);
    }
  }

  return result;
}

function sortZonesByArea(zones: Rectangle[]) {
  return zones.sort((r1, r2) => r1.width * r1.height - r2.width * r2.height);
}

// Sorts zones by the highest left most position
// function sortZonesByClosestToTop(zones: Rectangle[]) {
//   return zones.sort((r1, r2) => (r1.y !== r2.y) ? r1.y - r2.y : r1.x - r2.x);
// }

function sortZonesByClosestToTopLeftCorner(zones: Rectangle[]) {
  return zones.sort((r1, r2) => (r1.x + r1.y) - (r2.x + r2.y));
}

// Recalculates zones
function recalculateZones(zones: Rectangle[], sprite: Rectangle) {
  const newZones = [];

  for (const zone of zones) {
    newZones.push(...subtract(zone, sprite));
  }

  return sortZonesByClosestToTopLeftCorner(removeContainedZones(newZones));
}

// Expand zones by the expandBy amount
function expandZones(zones: Rectangle[], expandBy: Dimension, currentSheetSize: Dimension): Rectangle[] {
  const newZones: Rectangle[] = [];

  for (const zone of zones) {
    const newZone = {...zone};

    // Zone is touching the right sheet border
    if (zone.x + zone.width === currentSheetSize.width) {
      newZone.width += expandBy.width;
    }
    // Zone is touching the bottom sheet border
    if (zone.y + zone.height === currentSheetSize.height) {
      newZone.height += expandBy.height;
    }

    newZones.push(newZone);
  }

  if (expandBy.width > 0) {
    newZones.push({
      x: currentSheetSize.width,
      y: 0,
      width: expandBy.width,
      height: currentSheetSize.height + expandBy.height
    });
  }
  if (expandBy.height > 0) {
    newZones.push({
      x: 0,
      y: currentSheetSize.height,
      width: currentSheetSize.width + expandBy.width,
      height: expandBy.height
    });
  }

  // For the sake of optimisation there's no need to sort and filter zones
  // because they will be sorted and filtered after the next sprite is
  // positioned.
  return newZones;
}

function getExpandByStrategy(sheet: Sheet) {
  if (sheet.isMaintainAspectRatio && sheet.isPowerOfTwo) {
    return getExpandByMaintianPowerOfTwoAndAspectRatio;
  } else if (sheet.isMaintainAspectRatio) {
    return getExpandByMaintainAspectRatio;
  } else if (sheet.isPowerOfTwo) {
    return getExpandByMaintainPowerOfTwo;
  } else {
    return getExpandBy;
  }
}

// Packs sprite sheet
export default function pack(sprites: Rectangle[], sheet: Sheet) {
  const currentSheetSize: Dimension = {width: 0, height: 0};
  const maxSheetSize: Dimension = {width: sheet.maxWidth, height: sheet.maxHeight};
  let freeZones: Rectangle[] = [];
  
  if (sprites.length === 0) {
    throw new Error("There are no sprites to pack into a sprite sheet.");
  }

  // Sorts sprites by their width in descending order. I.e packs widest first
  sprites.sort((s1, s2) => s2.width - s1.width);

  for (const sprite of sprites) {
    const location = findLocation(freeZones, sprite)

    if (null != location) {
      sprite.x = location.x;
      sprite.y = location.y;

      freeZones = recalculateZones(freeZones, sprite);
    } else {
      // Expand sprite sheet and try again.
      const expandByDimension = getExpandByStrategy(sheet)(freeZones, sprite, currentSheetSize, maxSheetSize);
      freeZones = expandZones(freeZones, expandByDimension, currentSheetSize);

      // Expand sheet
      currentSheetSize.width += expandByDimension.width;
      currentSheetSize.height += expandByDimension.height;

      const location = findLocation(freeZones, sprite)
      if (null == location) {
        throw new Error('Maximum sheet dimensions are too small.');
      }

      sprite.x = location.x;
      sprite.y = location.y;

      freeZones = recalculateZones(freeZones, sprite);
    }
  }

  return currentSheetSize;
}
