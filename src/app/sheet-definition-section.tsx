"use client";

import { Sheet } from './types';
import { findPowerOfTwo } from './packer/dimension';

export default function SheetDefinitionSection({sheet, onChange}: {sheet: Sheet, onChange: any}) {
  function onPowerOfTwoChanged(isPowerOfTwo: boolean) {
    const newSheetDefinition = {...sheet, isPowerOfTwo: isPowerOfTwo};

    if (isPowerOfTwo) {
      newSheetDefinition.maxWidth = findPowerOfTwo(sheet.maxWidth);
      newSheetDefinition.maxHeight = findPowerOfTwo(sheet.maxHeight);
    }

    onChange(newSheetDefinition);
  }

  function onMaxWidthBlur() {
    if (sheet.isPowerOfTwo) {
      onChange({...sheet, maxWidth: findPowerOfTwo(sheet.maxWidth)});
    }
  }

  function onMaxHeightBlur() {
    if (sheet.isPowerOfTwo) {
      onChange({...sheet, maxHeight: findPowerOfTwo(sheet.maxHeight)});
    }
  }

  return (
    <div className="flex">
      <span className="text-6xl mt-3 me-4">1.</span>
      <div className="w-full mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h4 className="flex mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-300">
          Sprite sheet dimentions and color
        </h4>
        <form>
          <div className="grid gap-6 mb-4 md:grid-cols-2">
            <div>
              <label htmlFor="max-width-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Maximum width
              </label>
              <input
                id="max-width-input"
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={sheet.maxWidth}
                onChange={(e) => onChange({...sheet, maxWidth: e.target.value})}
                onBlur={onMaxWidthBlur}
              />
            </div>
            <div>
              <label htmlFor="max-height-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Maximum height
              </label>
              <input
                id="max-height-input"
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={sheet.maxHeight}
                onChange={(e) => onChange({...sheet, maxHeight: e.target.value})}
                onBlur={onMaxHeightBlur}
              />
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="power-of-two-checkbox"
              type="checkbox"
              defaultChecked={sheet.isPowerOfTwo}
              onChange={(e) => onPowerOfTwoChanged(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="power-of-two-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Make sheet dimentions power of two
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="maintain-aspek-ratio-checkbox"
              type="checkbox"
              defaultChecked={sheet.isMaintainAspectRatio}
              onChange={(e) => onChange({...sheet, isMaintainAspectRatio: e.target.checked})}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="maintain-aspek-ratio-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Maintain dimentions aspect ratio
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="background-color-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Background color
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xl text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  #
                </span>
                <input
                  id="background-color-input"
                  type="text"
                  className="rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  defaultValue={sheet.backgroundColor}
                  onChange={(e) => onChange({...sheet, backgroundColor: e.target.value})}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) 
}
