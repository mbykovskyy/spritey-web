"use client"

import { Dimension, findPowerOfTwo } from "./dimension";
import { Rectangle } from "./rectangle";

// Calculates how much a sheet needs to be expanded in order to fit a sprite
export function getExpandBy(
  zones: Rectangle[],
  sprite: Rectangle,
  currentSheetSize: Dimension,
  maxSheetSize: Dimension
) {
  // Go through zones to see how much a zone needs to be expanded by to fit a sprite
  for (const zone of zones) {
    const canExpandZoneWidth = (zone.x + zone.width === currentSheetSize.width);
    const canExpandZoneHeight = (zone.y + zone.height === currentSheetSize.height);

    if (zone.height >= sprite.height && canExpandZoneWidth) {
      const powerOfTwoSheetWidth = findPowerOfTwo(currentSheetSize.width + sprite.width - zone.width)
      const expandWidthBy = powerOfTwoSheetWidth - currentSheetSize.width;

      if (powerOfTwoSheetWidth <= maxSheetSize.width) {
        return {width: expandWidthBy, height: 0};
      }
    } else if (zone.width >= sprite.width && canExpandZoneHeight) {
      const powerOfTwoSheetHeight = findPowerOfTwo(currentSheetSize.height + sprite.height - zone.height)
      const expandHeightBy = powerOfTwoSheetHeight - currentSheetSize.height;

      if (powerOfTwoSheetHeight <= maxSheetSize.height) {
          return {width: 0, height: expandHeightBy};
      }
    } else if (canExpandZoneWidth && canExpandZoneHeight) {
      const powerOfTwoSheetWidth = findPowerOfTwo(currentSheetSize.width + sprite.width - zone.width)
      const expandWidthBy = powerOfTwoSheetWidth - currentSheetSize.width;
      const powerOfTwoSheetHeight = findPowerOfTwo(currentSheetSize.height + sprite.height - zone.height)
      const expandHeightBy = powerOfTwoSheetHeight - currentSheetSize.height;

      if (powerOfTwoSheetWidth <= maxSheetSize.width && powerOfTwoSheetHeight <= maxSheetSize.height) {
          return {width: expandWidthBy, height: expandHeightBy};
      }
    }
  }

  const powerOfTwoSheetWidth = findPowerOfTwo(currentSheetSize.width + sprite.width);
  const powerOfTwoSheetHeight = findPowerOfTwo(currentSheetSize.height + sprite.height);
  const canExpandSheetWidth = (powerOfTwoSheetWidth <= maxSheetSize.width);
  const canExpandSheetHeight = (powerOfTwoSheetHeight <= maxSheetSize.height);
  //const shouldExpandSheetHeight = currentSheetSize.width > currentSheetSize.height || !canExpandSheetWidth;
  const shouldExpandSheetHeight = sprite.height < sprite.width || !canExpandSheetWidth;

  if (canExpandSheetHeight && shouldExpandSheetHeight) {
    const expandHeightBy = powerOfTwoSheetHeight - currentSheetSize.height;

    if (sprite.width > currentSheetSize.width) {
      const powerOfTwoSheetWidth = findPowerOfTwo(sprite.width);

      if (powerOfTwoSheetWidth <= maxSheetSize.width) {
        return {width: powerOfTwoSheetWidth - currentSheetSize.width, height: expandHeightBy};
      }
      throw new Error('Sheet maximum width is too small');
    }
    return {width: 0, height: expandHeightBy};
  } else if (canExpandSheetWidth) {
    const expandWidthBy = powerOfTwoSheetWidth - currentSheetSize.width;

    if (sprite.height > currentSheetSize.height) {
      const powerOfTwoSheetHeight = findPowerOfTwo(sprite.height);

      if (powerOfTwoSheetHeight <= maxSheetSize.height) {
        return {width: expandWidthBy, height: powerOfTwoSheetHeight - currentSheetSize.height};
      }
      throw new Error('Sheet maximum height is too small');
    }
    return {width: expandWidthBy, height: 0};
  }
  throw new Error('Maximum sheet dimensions are too small');
}
