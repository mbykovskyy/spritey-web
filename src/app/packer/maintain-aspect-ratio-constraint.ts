"use client"

import { Dimension } from "./dimension";
import { Rectangle } from "./rectangle";

// Calculates how much a sheet needs to be expanded in order to fit a sprite
export function getExpandBy(
  zones: Rectangle[],
  sprite: Rectangle,
  currentSheetSize: Dimension,
  maxSheetSize: Dimension
) {
  const ratio = maxSheetSize.width / maxSheetSize.height;
  // Go through zones to see how much a zone needs to be expanded by to fit a sprite
  for (const zone of zones) {
    const canExpandZoneWidth = (zone.x + zone.width === currentSheetSize.width);
    const canExpandZoneHeight = (zone.y + zone.height === currentSheetSize.height);

    if (zone.height >= sprite.height && canExpandZoneWidth) {
      const expandWidthBy = sprite.width - zone.width;

      if (currentSheetSize.width + expandWidthBy <= maxSheetSize.width) {
        const expandHeightBy = Math.round(expandWidthBy / ratio);

        if (currentSheetSize.height + expandHeightBy <= maxSheetSize.height) {
          return {width: expandWidthBy, height: expandHeightBy};
        }
      }
    } else if (zone.width >= sprite.width && canExpandZoneHeight) {
      const expandHeightBy = sprite.height - zone.height;

      if (currentSheetSize.height + expandHeightBy <= maxSheetSize.height) {
        const expandWidthBy = Math.round(expandHeightBy * ratio);

        if (currentSheetSize.width + expandWidthBy <= maxSheetSize.width) {
          return {width: expandWidthBy, height: expandHeightBy};
        }
      }
    } else if (canExpandZoneWidth && canExpandZoneHeight) {
      let expandWidthBy = sprite.width - zone.width;
      let expandHeightBy = sprite.height - zone.height;

      // Adjust either width or height to maintain aspect ratio
      if ((expandWidthBy / ratio) >= expandHeightBy) {
        expandHeightBy = Math.round(expandWidthBy / ratio);
      } else {
        expandWidthBy = Math.round(expandHeightBy * ratio);
      }

      if ((currentSheetSize.width + expandWidthBy <= maxSheetSize.width)
        && (currentSheetSize.height + expandHeightBy <= maxSheetSize.height)) {
          return {width: expandWidthBy, height: expandHeightBy};
      }
    }
  }
  
  const canExpandWidth = currentSheetSize.width + sprite.width <= maxSheetSize.width;
  const canExpandHeight = currentSheetSize.height + sprite.height <= maxSheetSize.height;

  if (canExpandWidth && ((sprite.width / ratio) >= sprite.height)) {
    const expandHeightBy = Math.round(sprite.width / ratio);

    if (currentSheetSize.height + expandHeightBy <= maxSheetSize.height) {
      return {width: sprite.width, height: expandHeightBy};
    }
    throw new Error('Sheet maximum height is too small');
  } else if (canExpandHeight && ((sprite.height * ratio) >= sprite.width)) {
    const expandWidthBy = Math.round(sprite.height * ratio);

    if (currentSheetSize.width + expandWidthBy <= maxSheetSize.width) {
      return {width: expandWidthBy, height: sprite.height};
    }
    throw new Error('Sheet maximum width is too small');
  }
  throw new Error('Maximum sheet dimensions are too small');
}
