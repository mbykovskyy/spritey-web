"use client"

import { Dimension } from "./dimension";
import { Rectangle } from "./rectangle";

// Calculates how much a sheet needs to be expanded in order to fix a sprite
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
      const expandWidthBy = sprite.width - zone.width;

      if (currentSheetSize.width + expandWidthBy <= maxSheetSize.width) {
        return {width: expandWidthBy, height: 0};
      }
    } else if (zone.width >= sprite.width && canExpandZoneHeight) {
        const expandHeightBy = sprite.height - zone.height;

        if (currentSheetSize.height + expandHeightBy <= maxSheetSize.height) {
            return {width: 0, height: expandHeightBy};
        }
    } else if (canExpandZoneWidth && canExpandZoneHeight) {
      const expandWidthBy = sprite.width - zone.width;
      const expandHeightBy = sprite.height - zone.height;

      if ((currentSheetSize.width + expandWidthBy <= maxSheetSize.width)
        && (currentSheetSize.height + expandHeightBy <= maxSheetSize.height)) {
          return {width: expandWidthBy, height: expandHeightBy};
      }
    }
  }
  // If we reach this point it means one of the following: either there
  // are no zones, no zone can be expanded or expanding a zone will
  // break the maximum size constraint. Try to expand either width or
  // height, what ever is the smallest, one last time. It could be the
  // case that we almost reached the maximum size of one dimension and the
  // other dimension does not have any expandable zones.
  const canExpandSheetWidth = (currentSheetSize.width + sprite.width <= maxSheetSize.width);
  const canExpandSheetHeight = (currentSheetSize.height + sprite.height <= maxSheetSize.height);
  //const shouldExpandSheetHeight = currentSheetSize.width > currentSheetSize.height || !canExpandSheetWidth;
  const shouldExpandSheetHeight = sprite.height < sprite.width || !canExpandSheetWidth;

  if (canExpandSheetHeight && shouldExpandSheetHeight) {
      if (sprite.width > currentSheetSize.width) {
          if (sprite.width <= maxSheetSize.width) {
              return {width: sprite.width - currentSheetSize.width, height: sprite.height};
          }
          // Sprite width is bigger than maximum width.
          throw new Error('Sheet maximum width is too small');
      }
      return {width: 0, height: sprite.height};
  } else if (canExpandSheetWidth) {
      if (sprite.height > currentSheetSize.height) {
          if (sprite.height <= maxSheetSize.height) {
              return {width: sprite.width, height: sprite.height - currentSheetSize.height};
          }
          // Sprite height is bigger than maximum height. We have to
          // terminate packing as not all sprites can fit into sprite
          // sheet.
          throw new Error('Sheet maximum height is too small');
      }
      return {width: sprite.width, height: 0};
  }
  throw new Error('Maximum sheet dimensions are too small');
}
