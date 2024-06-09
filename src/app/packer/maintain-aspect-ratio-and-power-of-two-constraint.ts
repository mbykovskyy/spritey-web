"use client"

import { Dimension, findPowerOfTwo } from "./dimension";
import { Rectangle } from "./rectangle";

// Calculates how much a sheet needs to be expanded in order to fix a sprite
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
      const powerOfTwoSheetWidth = findPowerOfTwo(currentSheetSize.width + sprite.width - zone.width)
      const expandWidthBy = powerOfTwoSheetWidth - currentSheetSize.width;

      if (powerOfTwoSheetWidth <= maxSheetSize.width) {
        const expandHeightBy = Math.round(expandWidthBy / ratio);

        if (currentSheetSize.height + expandHeightBy <= maxSheetSize.height) {
          return {width: expandWidthBy, height: expandHeightBy};
        }
      }
    } else if (zone.width >= sprite.width && canExpandZoneHeight) {
      const powerOfTwoSheetHeight = findPowerOfTwo(currentSheetSize.height + sprite.height - zone.height)
      const expandHeightBy = powerOfTwoSheetHeight - currentSheetSize.height;

      if (powerOfTwoSheetHeight <= maxSheetSize.height) {
        const expandWidthBy = Math.round(expandHeightBy * ratio);

        if (currentSheetSize.width + expandWidthBy <= maxSheetSize.width) {
          return {width: expandWidthBy, height: expandHeightBy};
        }
      }
    } else if (canExpandZoneWidth && canExpandZoneHeight) {
      const powerOfTwoSheetWidth = findPowerOfTwo(currentSheetSize.width + sprite.width - zone.width)
      let expandWidthBy = powerOfTwoSheetWidth - currentSheetSize.width;
      const powerOfTwoSheetHeight = findPowerOfTwo(currentSheetSize.height + sprite.height - zone.height)
      let expandHeightBy = powerOfTwoSheetHeight - currentSheetSize.height;
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

  const powerOfTwoSheetWidth = findPowerOfTwo(currentSheetSize.width + sprite.width);
  const powerOfTwoSheetHeight = findPowerOfTwo(currentSheetSize.height + sprite.height);
  const canExpandSheetWidth = (powerOfTwoSheetWidth <= maxSheetSize.width);
  const canExpandSheetHeight = (powerOfTwoSheetHeight <= maxSheetSize.height);
  let expandWidthBy = powerOfTwoSheetWidth - currentSheetSize.width;
  let expandHeightBy = powerOfTwoSheetHeight - currentSheetSize.height;

  if (canExpandSheetWidth && ((expandWidthBy / ratio) >= expandHeightBy)) {
    const expandHeightBy = Math.round(expandWidthBy / ratio);
  
    if (currentSheetSize.height + expandHeightBy <= maxSheetSize.height) {
      return {width: expandWidthBy, height: expandHeightBy};
    }
    throw new Error('Sheet maximum height is too small');
  } else if (canExpandSheetHeight && ((expandHeightBy * ratio) >= expandWidthBy)) {
    const expandWidthBy = Math.round(expandHeightBy * ratio);

    if (currentSheetSize.width + expandWidthBy <= maxSheetSize.width) {
      return {width: expandWidthBy, height: expandHeightBy};
    }
    throw new Error('Sheet maximum width is too small');
  }
  throw new Error('Maximum sheet dimensions are too small');
}
